import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { resetTestDatabase } from '../../test/resetTestDatabase';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, PrismaService, JwtService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  // テストで起動したNestアプリを終了しないとJestで警告が発生するため、以下のコードで終了
  afterEach(async () => {
    await resetTestDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateSignUp', () => {
    describe('正常系', () => {
      it('空hashのerrorsが返ること', async () => {
        const result = await service.validateSignUp({
          name: 'test_name',
          email: 'test@example.com',
          password: 'Passwor1',
          passwordConfirm: 'Passwor1',
        });

        expect(result).toEqual([]);
      });
    });

    describe('異常系', () => {
      it('空値', async () => {
        const result = await service.validateSignUp({
          name: '',
          email: '',
          password: '',
          passwordConfirm: '',
        });

        expect(
          Object.values(
            result.find((res) => res.property === 'name')?.constraints ?? {},
          ),
        ).toEqual(expect.arrayContaining(['ユーザ名は必須です。']));

        expect(
          Object.values(
            result.find((res) => res.property === 'email')?.constraints ?? {},
          ),
        ).toEqual(
          expect.arrayContaining([
            'メールアドレスの形式はxxx@example.comでお願いします。',
            'メールアドレスは必須です。',
          ]),
        );

        expect(
          Object.values(
            result.find((res) => res.property === 'password')?.constraints ??
              {},
          ),
        ).toEqual(
          expect.arrayContaining([
            'パスワードは8文字以上20文字以内で入力をお願いします。',
            'パスワードは必須です。',
            'パスワードは半角英数字の大文字・小文字・数字をそれぞれ最低1文字で入力をお願いします。',
          ]),
        );

        expect(
          Object.values(
            result.find((res) => res.property === 'passwordConfirm')
              ?.constraints ?? {},
          ),
        ).toEqual(expect.arrayContaining(['パスワード確認用は必須です。']));
      });

      it('メールアドレスの形式', async () => {
        const result = await service.validateSignUp({
          name: 'test_name',
          email: 'testexample.com',
          password: 'Passwor1',
          passwordConfirm: 'Passwor1',
        });

        expect(
          Object.values(
            result.find((res) => res.property === 'email')?.constraints ?? {},
          ),
        ).toEqual(
          expect.arrayContaining([
            'メールアドレスの形式はxxx@example.comでお願いします。',
          ]),
        );
      });

      it('パスワードの形式', async () => {
        const result = await service.validateSignUp({
          name: 'test_name',
          email: 'test@example.com',
          password: 'password',
          passwordConfirm: 'password',
        });

        expect(
          Object.values(
            result.find((res) => res.property === 'password')?.constraints ??
              {},
          ),
        ).toEqual(
          expect.arrayContaining([
            'パスワードは半角英数字の大文字・小文字・数字をそれぞれ最低1文字で入力をお願いします。',
          ]),
        );
      });

      it('パスワードの長さ(8文字未満)', async () => {
        const result = await service.validateSignUp({
          name: 'test_name',
          email: 'test@example.com',
          password: 'Passwo1',
          passwordConfirm: 'Passwo1',
        });

        expect(
          Object.values(
            result.find((res) => res.property === 'password')?.constraints ??
              {},
          ),
        ).toEqual(
          expect.arrayContaining([
            'パスワードは8文字以上20文字以内で入力をお願いします。',
          ]),
        );
      });

      it('パスワードの長さ(21文字以上)', async () => {
        const result = await service.validateSignUp({
          name: 'test_name',
          email: 'test@example.com',
          password: 'PasswordPasswordPass1',
          passwordConfirm: 'PasswordPasswordPass1',
        });

        expect(
          Object.values(
            result.find((res) => res.property === 'password')?.constraints ??
              {},
          ),
        ).toEqual(
          expect.arrayContaining([
            'パスワードは8文字以上20文字以内で入力をお願いします。',
          ]),
        );
      });

      it('パスワード確認用がパスワードと異なる', async () => {
        const result = await service.validateSignUp({
          name: 'test_name',
          email: 'test@example.com',
          password: 'Passwor1',
          passwordConfirm: 'Passwor2',
        });

        expect(
          Object.values(
            result.find((res) => res.property === 'passwordConfirm')
              ?.constraints ?? {},
          ),
        ).toEqual(
          expect.arrayContaining([
            'パスワードとパスワード確認用が異なります。',
          ]),
        );
      });
    });
  });

  describe('signUp', () => {
    it('userが保存できること', async () => {
      await service.signUp({
        name: 'test_name',
        email: 'test@example.com',
        password: 'Passwor1',
        passwordConfirm: 'Passwor1',
      });

      expect(
        prisma.user.findFirst({ where: { name: 'test_name' } }),
      ).toBeTruthy();
    });
  });

  describe('validateSignIn', () => {
    let user: User;

    beforeEach(async () => {
      user = await prisma.user.create({
        data: {
          name: 'test_name',
          email: 'test@example.com',
          password: await bcrypt.hash('Passwor1', 10),
        },
      });
    });

    it('正常系', async () => {
      const result = await service.validateSignIn({
        email: 'test@example.com',
        password: 'Passwor1',
      });
      expect(result).toEqual({ user, errors: [] });
    });

    describe('異常系', () => {
      describe('メールアドレスが異なる', () => {
        it('エラーメッセージが返る', async () => {
          const result = await service.validateSignIn({
            email: 'test@example.com',
            password: 'Passwor2',
          });
          expect(result).toEqual({
            user: null,
            errors: ['メールアドレス、またはパスワードが異なります。'],
          });
        });
      });
      describe('パスワードが異なる', () => {
        it('エラーメッセージが返る', async () => {
          const result = await service.validateSignIn({
            email: 'test2@example.com',
            password: 'Passwor1',
          });
          expect(result).toEqual({
            user: null,
            errors: ['メールアドレス、またはパスワードが異なります。'],
          });
        });
      });
    });
  });
});
