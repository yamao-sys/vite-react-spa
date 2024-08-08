import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma.service';
import { ReadingRecord, User } from '@prisma/client';
import { resetTestDatabase } from './resetTestDatabase';
import { GoogleCloudService } from '../src/google-cloud/google-cloud.service';

describe('ReadingRecordsController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let prisma: PrismaService;
  let googleCloudService: GoogleCloudService;

  let user1: User;
  let user2: User;

  beforeEach(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    googleCloudService =
      moduleFixture.get<GoogleCloudService>(GoogleCloudService);
    await app.init();

    user1 = await prisma.user.create({
      data: {
        name: 'test_name1',
        email: 'test_email1@example.com',
        password: await bcrypt.hash('Passwor1', 10),
      },
    });
    user2 = await prisma.user.create({
      data: {
        name: 'test_name2',
        email: 'test_email2@example.com',
        password: await bcrypt.hash('Passwor1', 10),
      },
    });
  });

  // テストで起動したNestアプリを終了しないとJestで警告が発生するため、以下のコードで終了
  afterEach(async () => {
    await resetTestDatabase();
    await app.close();
    await moduleFixture.close();
  });

  describe('Query findAll()', () => {
    beforeEach(async () => {
      const readingRecord = await prisma.readingRecord.create({
        data: {
          title: 'test title1',
          learnedContent: 'test learned content1',
          impression: 'test impression1',
          userId: user1.id,
        },
      });
      const bookImage = await googleCloudService.uploadToStorage(
        'https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/0209/9784297100209.jpg',
        `book_image/${readingRecord.id}`,
      );
      await prisma.readingRecord.update({
        where: { id: readingRecord.id },
        data: { bookImage },
      });

      await prisma.readingRecord.create({
        data: {
          title: 'test title2',
          learnedContent: 'test learned content2',
          impression: 'test impression2',
          userId: user2.id,
        },
      });
    });

    describe('未ログインの場合', () => {
      it('401エラーとなること', async () => {
        await request(app.getHttpServer()).get('/readingRecords').expect(401);
      });
    });

    describe('ログイン中の場合', () => {
      it('ログインユーザの読書記録を取得できること', async () => {
        const res = await request(app.getHttpServer())
          .post('/auth/signIn')
          .send({
            email: user1.email,
            password: 'Passwor1',
          });
        const cookie = res.get('Set-Cookie') ?? '';
        if (cookie === '') throw new Error();

        const { body } = await request(app.getHttpServer())
          .get('/readingRecords')
          .set('Cookie', cookie[0])
          .expect(200);
        expect(body.length).toEqual(1);

        expect(body[0].title).toEqual('test title1');
        expect(body[0].learnedContent).toEqual('test learned content1');
        expect(body[0].impression).toEqual('test impression1');
        expect(body[0].bookImage).toMatch(/base64/);
      });
    });
  });

  describe('Query findOne()', () => {
    let readingRecord: ReadingRecord;

    beforeEach(async () => {
      readingRecord = await prisma.readingRecord.create({
        data: {
          title: 'test title1',
          learnedContent: 'test learned content1',
          impression: 'test impression1',
          userId: user1.id,
        },
      });
      const bookImage = await googleCloudService.uploadToStorage(
        'https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/0209/9784297100209.jpg',
        `book_image/${readingRecord.id}`,
      );
      await prisma.readingRecord.update({
        where: { id: readingRecord.id },
        data: { bookImage },
      });
    });

    describe('未ログインの場合', () => {
      it('401エラーが発生すること', async () => {
        await request(app.getHttpServer())
          .get(`/readingRecords/${readingRecord.id}`)
          .expect(401);
      });
    });

    describe('ログイン中の場合', () => {
      describe('ログインユーザの読書記録を指定した場合', () => {
        it('指定した読書記録が取得できること', async () => {
          const res = await request(app.getHttpServer())
            .post('/auth/signIn')
            .send({
              email: user1.email,
              password: 'Passwor1',
            });
          const cookie = res.get('Set-Cookie') ?? '';
          if (cookie === '') throw new Error();

          const { body } = await request(app.getHttpServer())
            .get(`/readingRecords/${readingRecord.id}`)
            .set('Cookie', cookie[0])
            .expect(200);
          expect(body.title).toEqual('test title1');
          expect(body.learnedContent).toEqual('test learned content1');
          expect(body.impression).toEqual('test impression1');
          expect(body.bookImage).toMatch(/base64/);
        });
      });

      describe('ログインユーザ以外の読書記録を指定した場合', () => {
        it('404エラーが発生すること', async () => {
          const res = await request(app.getHttpServer())
            .post('/auth/signIn')
            .send({
              email: user2.email,
              password: 'Passwor1',
            });
          const cookie = res.get('Set-Cookie') ?? '';
          if (cookie === '') throw new Error();

          await request(app.getHttpServer())
            .get(`/readingRecords/${readingRecord.id}`)
            .set('Cookie', cookie[0])
            .expect(404);
        });
      });
    });
  });

  describe('Mutation createTodo()', () => {
    describe('未ログインの場合', () => {
      it('401エラーが発生すること', async () => {
        await request(app.getHttpServer())
          .post('/readingRecords')
          .send({
            title: 'test title1',
            learnedContent: 'test learned content1',
            impression: 'test impression1',
          })
          .expect(401);
      });
    });

    it('todoが作成できること', async () => {
      const res = await request(app.getHttpServer()).post('/auth/signIn').send({
        email: user1.email,
        password: 'Passwor1',
      });
      const cookie = res.get('Set-Cookie') ?? '';
      if (cookie === '') throw new Error();

      const { body } = await request(app.getHttpServer())
        .post('/readingRecords')
        .send({
          title: 'test title1',
          learnedContent: 'test learned content1',
          impression: 'test impression1',
        })
        .set('Cookie', cookie[0])
        .expect(201);
      expect(body.title).toEqual('test title1');
      expect(body.learnedContent).toEqual('test learned content1');
      expect(body.impression).toEqual('test impression1');

      const createdReadingRecord = await prisma.readingRecord.findFirst({
        where: { title: 'test title1', userId: user1.id },
      });
      expect(!!createdReadingRecord).toBeTruthy();
    });

    describe('画像の入力がある場合', () => {
      it('todoが作成できること', async () => {
        const res = await request(app.getHttpServer())
          .post('/auth/signIn')
          .send({
            email: user1.email,
            password: 'Passwor1',
          });
        const cookie = res.get('Set-Cookie') ?? '';
        if (cookie === '') throw new Error();

        const { body } = await request(app.getHttpServer())
          .post('/readingRecords')
          .send({
            title: 'test title1',
            learnedContent: 'test learned content1',
            impression: 'test impression1',
            bookImage:
              'https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/0209/9784297100209.jpg',
          })
          .set('Cookie', cookie[0])
          .expect(201);
        const createdReadingRecord = await prisma.readingRecord.findFirst({
          where: { title: 'test title1', userId: user1.id },
        });
        expect(!!createdReadingRecord).toBeTruthy();
        expect(body.title).toEqual('test title1');
        expect(body.learnedContent).toEqual('test learned content1');
        expect(body.impression).toEqual('test impression1');
        expect(createdReadingRecord?.bookImage).toEqual(
          `book_image/${createdReadingRecord?.id}.jpg`,
        );
      });
    });
  });

  describe('Mutation updateTodo()', () => {
    let readingRecord: ReadingRecord;

    beforeEach(async () => {
      readingRecord = await prisma.readingRecord.create({
        data: {
          title: 'test title1',
          learnedContent: 'test learned content1',
          impression: 'test impression1',
          userId: user1.id,
        },
      });
    });

    describe('未ログインの場合', () => {
      it('401エラーが発生すること', async () => {
        await request(app.getHttpServer())
          .patch(`/readingRecords/${readingRecord.id}`)
          .send({
            title: 'test updated title1',
            learnedContent: 'test updated learned content1',
            impression: 'test updated impression1',
          })
          .expect(401);
      });
    });

    describe('ログイン中の場合', () => {
      describe('ログインユーザの読書記録を指定した場合', () => {
        it('読書記録が更新できること', async () => {
          const res = await request(app.getHttpServer())
            .post('/auth/signIn')
            .send({
              email: user1.email,
              password: 'Passwor1',
            });
          const cookie = res.get('Set-Cookie') ?? '';
          if (cookie === '') throw new Error();

          const { body } = await request(app.getHttpServer())
            .patch(`/readingRecords/${readingRecord.id}`)
            .send({
              title: 'test updated title1',
              learnedContent: 'test updated learned content1',
              impression: 'test updated impression1',
            })
            .set('Cookie', cookie[0])
            .expect(200);
          expect(body.title).toEqual('test updated title1');
          expect(body.learnedContent).toEqual('test updated learned content1');
          expect(body.impression).toEqual('test updated impression1');

          const updatedReadingRecord = await prisma.readingRecord.findFirst({
            where: { title: 'test updated title1' },
          });
          expect(!!updatedReadingRecord).toBeTruthy();
        });
      });

      describe('ログインユーザ以外の読書記録を指定した場合', () => {
        it('404が発生すること', async () => {
          const res = await request(app.getHttpServer())
            .post('/auth/signIn')
            .send({
              email: user2.email,
              password: 'Passwor1',
            });
          const cookie = res.get('Set-Cookie') ?? '';
          if (cookie === '') throw new Error();

          await request(app.getHttpServer())
            .patch(`/readingRecords/${readingRecord.id}`)
            .send({
              title: 'test updated title1',
              learnedContent: 'test updated learned content1',
              impression: 'test updated impression1',
            })
            .set('Cookie', cookie[0])
            .expect(500);
        });
      });
    });
  });

  describe('Mutation removeTodo()', () => {
    let readingRecord: ReadingRecord;

    beforeEach(async () => {
      readingRecord = await prisma.readingRecord.create({
        data: {
          title: 'test title1',
          learnedContent: 'test learned content1',
          impression: 'test impression1',
          userId: user1.id,
        },
      });
    });

    describe('未ログインの場合', () => {
      it('401エラーが発生すること', async () => {
        await request(app.getHttpServer())
          .delete(`/readingRecords/${readingRecord.id}`)
          .expect(401);
      });
    });

    describe('ログイン中の場合', () => {
      describe('ログインユーザの読書記録を指定した場合', () => {
        it('読書記録が削除できること', async () => {
          const res = await request(app.getHttpServer())
            .post('/auth/signIn')
            .send({
              email: user1.email,
              password: 'Passwor1',
            });
          const cookie = res.get('Set-Cookie') ?? '';
          if (cookie === '') throw new Error();

          const { body } = await request(app.getHttpServer())
            .delete(`/readingRecords/${readingRecord.id}`)
            .set('Cookie', cookie[0])
            .expect(200);
          expect(body.result).toEqual(true);

          const removedReadingRecord = await prisma.readingRecord.findFirst({
            where: { title: 'test title1' },
          });
          expect(!!removedReadingRecord).toBeFalsy();
        });
      });

      describe('ログインユーザ以外の読書記録を指定した場合', () => {
        it('エラーが発生すること', async () => {
          const res = await request(app.getHttpServer())
            .post('/auth/signIn')
            .send({
              email: user2.email,
              password: 'Passwor1',
            });
          const cookie = res.get('Set-Cookie') ?? '';
          if (cookie === '') throw new Error();

          await request(app.getHttpServer())
            .delete(`/readingRecords/${readingRecord.id}`)
            .set('Cookie', cookie[0])
            .expect(500);
        });
      });
    });
  });
});
