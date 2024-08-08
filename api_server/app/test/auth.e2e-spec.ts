import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma.service';
import { resetTestDatabase } from './resetTestDatabase';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let prisma: PrismaService;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
      providers: [PrismaService],
    }).compile();

    // モジュールからインスタンスの作成・初期化
    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  // テストで起動したNestアプリを終了しないとJestで警告が発生するため、以下のコードで終了
  afterEach(async () => {
    await resetTestDatabase();
    await app.close();
    await moduleFixture.close();
  });

  describe('/auth/validateSignUp (POST)', () => {
    it('正常系', () => {
      return request(app.getHttpServer())
        .post('/auth/validateSignUp')
        .send({
          name: 'test_name',
          email: 'test@example.com',
          password: 'Passwor1',
          passwordConfirm: 'Passwor1',
        })
        .expect(201)
        .expect({
          errors: {},
        });
    });

    describe('異常系', () => {
      it('空値', async () => {
        const { body } = await request(app.getHttpServer())
          .post('/auth/validateSignUp')
          .send({
            name: '',
            email: '',
            password: '',
            passwordConfirm: '',
          })
          .expect(201);
        expect(body.errors.name).toEqual(
          expect.arrayContaining(['ユーザ名は必須です。']),
        );
        expect(body.errors.email).toEqual(
          expect.arrayContaining([
            'メールアドレスは必須です。',
            'メールアドレスの形式はxxx@example.comでお願いします。',
          ]),
        );
        expect(body.errors.password).toEqual(
          expect.arrayContaining([
            'パスワードは必須です。',
            'パスワードは8文字以上20文字以内で入力をお願いします。',
            'パスワードは半角英数字の大文字・小文字・数字をそれぞれ最低1文字で入力をお願いします。',
          ]),
        );
        expect(body.errors.passwordConfirm).toEqual(
          expect.arrayContaining(['パスワード確認用は必須です。']),
        );
      });

      it('メールアドレスの形式', async () => {
        const { body } = await request(app.getHttpServer())
          .post('/auth/validateSignUp')
          .send({
            email: 'testexample.com',
          })
          .expect(201);
        expect(body.errors.email).toEqual(
          expect.arrayContaining([
            'メールアドレスの形式はxxx@example.comでお願いします。',
          ]),
        );
      });

      it('パスワードの形式', async () => {
        const { body } = await request(app.getHttpServer())
          .post('/auth/validateSignUp')
          .send({
            password: 'password',
          })
          .expect(201);
        expect(body.errors.password).toEqual(
          expect.arrayContaining([
            'パスワードは半角英数字の大文字・小文字・数字をそれぞれ最低1文字で入力をお願いします。',
          ]),
        );
      });

      it('パスワードの長さ(8文字未満)', async () => {
        const { body } = await request(app.getHttpServer())
          .post('/auth/validateSignUp')
          .send({
            password: 'Passwo1',
          })
          .expect(201);
        expect(body.errors.password).toEqual(
          expect.arrayContaining([
            'パスワードは8文字以上20文字以内で入力をお願いします。',
          ]),
        );
      });

      it('パスワードの長さ(21文字以上)', async () => {
        const { body } = await request(app.getHttpServer())
          .post('/auth/validateSignUp')
          .send({
            password: 'PasswordPasswordPass1',
          })
          .expect(201);
        expect(body.errors.password).toEqual(
          expect.arrayContaining([
            'パスワードは8文字以上20文字以内で入力をお願いします。',
          ]),
        );
      });

      it('パスワード確認用がパスワードと異なる', async () => {
        const { body } = await request(app.getHttpServer())
          .post('/auth/validateSignUp')
          .send({
            password: 'Passwor1',
            passwordConfirm: 'Passwor2',
          })
          .expect(201);
        expect(body.errors.passwordConfirm).toEqual(
          expect.arrayContaining([
            'パスワードとパスワード確認用が異なります。',
          ]),
        );
      });
    });
  });

  describe('/auth/signUp (POST)', () => {
    it('正常系', () => {
      return request(app.getHttpServer())
        .post('/auth/signUp')
        .send({
          name: 'test_name',
          email: 'test@example.com',
          password: 'Passwor1',
          passwordConfirm: 'Passwor1',
        })
        .expect(201)
        .expect({
          result: true,
        });
    });

    it('異常系', () => {
      return request(app.getHttpServer())
        .post('/auth/signUp')
        .send({
          name: '',
          email: '',
          password: '',
          passwordConfirm: '',
        })
        .expect(400);
    });
  });

  describe('/auth/sign_in (POST)', () => {
    beforeAll(async () => {
      await prisma.user.create({
        data: {
          name: 'test_name',
          email: 'test@example.com',
          password: await bcrypt.hash('Passwor1', 10),
        },
      });
    });

    it('正常系', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/signIn')
        .send({
          email: 'test@example.com',
          password: 'Passwor1',
        })
        .expect(201)
        .expect({
          errors: [],
        });
      const cookie = res.get('Set-Cookie') ?? '';
      if (cookie === '') throw new Error();

      await request(app.getHttpServer())
        .get('/')
        .set('Cookie', cookie[0])
        .expect(200);
    });

    it('異常系', () => {
      return request(app.getHttpServer())
        .post('/auth/signIn')
        .send({
          email: 'test@example.comm',
          password: 'Passwor1',
        })
        .expect(201)
        .expect({
          errors: ['メールアドレス、またはパスワードが異なります。'],
        });
    });
  });

  describe('/auth/checkSignedIn (GET)', () => {
    beforeAll(async () => {
      await prisma.user.create({
        data: {
          name: 'test_name',
          email: 'test@example.com',
          password: await bcrypt.hash('Passwor1', 10),
        },
      });
    });

    it('認証済みの時はtrueを返すこと', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/signIn')
        .send({
          email: 'test@example.com',
          password: 'Passwor1',
        })
        .expect(201)
        .expect({
          errors: [],
        });
      const cookie = res.get('Set-Cookie') ?? '';
      if (cookie === '') throw new Error();

      await request(app.getHttpServer())
        .get('/auth/checkSignedIn')
        .set('Cookie', cookie[0])
        .expect(200)
        .expect('true');
    });

    it('認証済みではない時はfalseを返すこと', async () => {
      await request(app.getHttpServer())
        .get('/auth/checkSignedIn')
        .expect(200)
        .expect('false');
    });
  });
});
