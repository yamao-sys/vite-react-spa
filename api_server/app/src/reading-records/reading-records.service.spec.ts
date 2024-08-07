import { Test, TestingModule } from '@nestjs/testing';
import { ReadingRecordsService } from './reading-records.service';
import { PrismaService } from '../prisma.service';
import { GoogleCloudService } from '../google-cloud/google-cloud.service';
import { resetTestDatabase } from '../../test/resetTestDatabase';
import { ReadingRecord, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { mock } from 'jest-mock-extended';
import { NotFoundException } from '@nestjs/common';

describe('ReadingRecordsService', () => {
  let service: ReadingRecordsService;
  let prisma: PrismaService;
  let user: User;
  let otherUser: User;
  let readingRecord: ReadingRecord;

  beforeEach(async () => {
    const googleCloudServiceMock = mock<GoogleCloudService>();
    googleCloudServiceMock.uploadToStorage.mockResolvedValue(
      'book_image/1.jpg',
    );
    googleCloudServiceMock.downloadFromStorage.mockResolvedValue(
      'data:image/jpeg;base64,mockedFile',
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReadingRecordsService,
        PrismaService,
        { provide: GoogleCloudService, useValue: googleCloudServiceMock },
      ],
    }).compile();

    service = module.get<ReadingRecordsService>(ReadingRecordsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    await resetTestDatabase();
  });

  describe('create', () => {
    beforeEach(async () => {
      user = await prisma.user.create({
        data: {
          name: 'test_name',
          email: 'test@example.com',
          password: await bcrypt.hash('Passwor1', 10),
        },
      });
    });

    describe('ファイルの入力なし', () => {
      it('登録できること', async () => {
        const readingRecord = await service.create(
          {
            title: 'test_title',
            author: 'test_author',
            impression: 'test_impression',
            learnedContent: 'test_learned_content',
          },
          user.id,
        );

        expect(readingRecord.title).toEqual('test_title');
        expect(
          await prisma.readingRecord.findFirst({ where: { id: user.id } }),
        ).toBeTruthy();
      });
    });

    describe('ファイルの入力あり', () => {
      it('登録できること', async () => {
        await service.create(
          {
            title: 'test_title',
            author: 'test_author',
            impression: 'test_impression',
            learnedContent: 'test_learned_content',
            bookImage: 'https://example.com/test_image.jpg',
          },
          user.id,
        );

        const readingRecord = await prisma.readingRecord.findFirst({
          where: { id: user.id },
        });
        expect(readingRecord?.title).toEqual('test_title');
        expect(readingRecord?.bookImage).toEqual('book_image/1.jpg');
      });
    });
  });

  describe('findAll', () => {
    beforeEach(async () => {
      user = await prisma.user.create({
        data: {
          name: 'test_name',
          email: 'test@example.com',
          password: await bcrypt.hash('Passwor1', 10),
        },
      });
      otherUser = await prisma.user.create({
        data: {
          name: 'test_name_other',
          email: 'tes_othert@example.com',
          password: await bcrypt.hash('Passwor1', 10),
        },
      });
      readingRecord = await prisma.readingRecord.create({
        data: {
          userId: user.id,
          title: 'test_title',
          author: 'test_author',
          impression: 'test_impression',
          learnedContent: 'test_learned_content',
        },
      });
      await prisma.readingRecord.create({
        data: {
          userId: otherUser.id,
          title: 'test_title_other',
          author: 'test_author_other',
          impression: 'test_impression_other',
          learnedContent: 'test_learned_content_other',
        },
      });
    });

    describe('読書記録にファイルなしの場合', () => {
      it('指定したユーザの読書記録が取得できること', async () => {
        const result = await service.findAll(user.id);

        expect(result.length).toEqual(1);
        expect(result[0].title).toEqual(readingRecord.title);
      });
    });

    describe('読書記録にファイルありの場合', () => {
      beforeEach(async () => {
        await prisma.readingRecord.update({
          where: { id: readingRecord.id },
          data: {
            bookImage: `book_image/${readingRecord.id}.jpg`,
          },
        });
      });

      it('指定したユーザの読書記録が取得できること', async () => {
        const result = await service.findAll(user.id);

        expect(result.length).toEqual(1);
        expect(result[0].title).toEqual(readingRecord.title);
        expect(result[0].bookImage).toEqual(
          'data:image/jpeg;base64,mockedFile',
        );
      });
    });
  });

  describe('findOne', () => {
    beforeEach(async () => {
      user = await prisma.user.create({
        data: {
          name: 'test_name',
          email: 'test@example.com',
          password: await bcrypt.hash('Passwor1', 10),
        },
      });
      otherUser = await prisma.user.create({
        data: {
          name: 'test_name_other',
          email: 'tes_othert@example.com',
          password: await bcrypt.hash('Passwor1', 10),
        },
      });
      readingRecord = await prisma.readingRecord.create({
        data: {
          userId: user.id,
          title: 'test_title',
          author: 'test_author',
          impression: 'test_impression',
          learnedContent: 'test_learned_content',
        },
      });
      await prisma.readingRecord.create({
        data: {
          userId: otherUser.id,
          title: 'test_title_other',
          author: 'test_author_other',
          impression: 'test_impression_other',
          learnedContent: 'test_learned_content_other',
        },
      });
    });

    describe('読書記録にファイルなしの場合', () => {
      it('指定した読書記録が取得できること', async () => {
        const result = await service.findOne(readingRecord.id, user.id);

        expect(result.title).toEqual(readingRecord.title);
      });
    });

    describe('読書記録にファイルありの場合', () => {
      beforeEach(async () => {
        await prisma.readingRecord.update({
          where: { id: readingRecord.id },
          data: {
            bookImage: `book_image/${readingRecord.id}.jpg`,
          },
        });
      });

      it('指定したユーザの読書記録が取得できること', async () => {
        const result = await service.findOne(readingRecord.id, user.id);

        expect(result.title).toEqual(readingRecord.title);
        expect(result.bookImage).toEqual('data:image/jpeg;base64,mockedFile');
      });
    });

    describe('指定したIDの読書記録が存在しないとき', () => {
      it('404エラーが発生すること', async () => {
        const id = await prisma.readingRecord
          .findMany({
            orderBy: {
              id: 'desc',
            },
            take: 1,
          })
          .then((res) => res[0]?.id);
        await expect(service.findOne(id + 1, user.id)).rejects.toThrow(
          NotFoundException,
        );
      });
    });

    describe('指定したユーザIDの読書記録が存在しないとき', () => {
      it('404エラーが発生すること', async () => {
        await expect(
          service.findOne(readingRecord.id, otherUser.id),
        ).rejects.toThrow(NotFoundException);
      });
    });
  });

  describe('update', () => {
    const updateData = {
      title: 'test_title_updated',
      author: 'test_author_updated',
      impression: 'test_impression_updated',
      learnedContent: 'test_learned_content_updated',
    };
    beforeEach(async () => {
      user = await prisma.user.create({
        data: {
          name: 'test_name',
          email: 'test@example.com',
          password: await bcrypt.hash('Passwor1', 10),
        },
      });
      otherUser = await prisma.user.create({
        data: {
          name: 'test_name_other',
          email: 'tes_othert@example.com',
          password: await bcrypt.hash('Passwor1', 10),
        },
      });
      readingRecord = await prisma.readingRecord.create({
        data: {
          userId: user.id,
          title: 'test_title',
          author: 'test_author',
          impression: 'test_impression',
          learnedContent: 'test_learned_content',
        },
      });
      await prisma.readingRecord.create({
        data: {
          userId: otherUser.id,
          title: 'test_title_other',
          author: 'test_author_other',
          impression: 'test_impression_other',
          learnedContent: 'test_learned_content_other',
        },
      });
    });

    it('更新できること', async () => {
      await service.update(readingRecord.id, updateData, user.id);

      const updatedReadingRecord = await prisma.readingRecord.findFirst({
        where: { id: readingRecord.id },
      });
      expect(updatedReadingRecord?.title).toEqual(updateData.title);
      expect(updatedReadingRecord?.author).toEqual(updateData.author);
      expect(updatedReadingRecord?.impression).toEqual(updateData.impression);
      expect(updatedReadingRecord?.learnedContent).toEqual(
        updateData.learnedContent,
      );
    });

    describe('指定したIDの読書記録が存在しないとき', () => {
      it('例外が発生すること', async () => {
        const id = await prisma.readingRecord
          .findMany({
            orderBy: {
              id: 'desc',
            },
            take: 1,
          })
          .then((res) => res[0]?.id);
        await expect(
          service.update(id + 1, updateData, user.id),
        ).rejects.toThrow();
      });
    });

    describe('指定したユーザIDの読書記録が存在しないとき', () => {
      it('例外が発生すること', async () => {
        await expect(
          service.update(readingRecord.id, updateData, otherUser.id),
        ).rejects.toThrow();
      });
    });
  });

  describe('remove', () => {
    beforeEach(async () => {
      user = await prisma.user.create({
        data: {
          name: 'test_name',
          email: 'test@example.com',
          password: await bcrypt.hash('Passwor1', 10),
        },
      });
      otherUser = await prisma.user.create({
        data: {
          name: 'test_name_other',
          email: 'tes_othert@example.com',
          password: await bcrypt.hash('Passwor1', 10),
        },
      });
      readingRecord = await prisma.readingRecord.create({
        data: {
          userId: user.id,
          title: 'test_title',
          author: 'test_author',
          impression: 'test_impression',
          learnedContent: 'test_learned_content',
        },
      });
      await prisma.readingRecord.create({
        data: {
          userId: otherUser.id,
          title: 'test_title_other',
          author: 'test_author_other',
          impression: 'test_impression_other',
          learnedContent: 'test_learned_content_other',
        },
      });
    });

    it('削除できること', async () => {
      await service.remove(readingRecord.id, user.id);

      const removedReadingRecord = await prisma.readingRecord.findFirst({
        where: { id: readingRecord.id },
      });
      expect(removedReadingRecord).toBeFalsy();
    });

    describe('指定したIDの読書記録が存在しないとき', () => {
      it('例外が発生すること', async () => {
        const id = await prisma.readingRecord
          .findMany({
            orderBy: {
              id: 'desc',
            },
            take: 1,
          })
          .then((res) => res[0]?.id);
        await expect(service.remove(id + 1, user.id)).rejects.toThrow();
      });
    });

    describe('指定したユーザIDの読書記録が存在しないとき', () => {
      it('例外が発生すること', async () => {
        await expect(
          service.remove(readingRecord.id, otherUser.id),
        ).rejects.toThrow();
      });
    });
  });
});
