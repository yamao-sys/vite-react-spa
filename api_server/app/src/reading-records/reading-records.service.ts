import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReadingRecordDto } from './dto/create-reading-record.dto';
import { UpdateReadingRecordDto } from './dto/update-reading-record.dto';
import { PrismaService } from 'src/prisma.service';
import { GoogleCloudService } from 'src/google-cloud/google-cloud.service';
import { ReadingRecord } from '@prisma/client';

@Injectable()
export class ReadingRecordsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly googleCloud: GoogleCloudService,
  ) {}

  async create(createReadingRecordDto: CreateReadingRecordDto, userId: number) {
    const input = { userId, ...createReadingRecordDto };
    // TODO: transaction入れる
    const readingRecord = await this.prisma.readingRecord.create({
      data: input,
    });
    if (!createReadingRecordDto.bookImage) return readingRecord;

    const filePath = await this.googleCloud.uploadToStorage(
      createReadingRecordDto.bookImage,
      `book_image/${readingRecord.id}`,
    );
    const savedImageReadingRecord = await this.prisma.readingRecord.update({
      where: { id: readingRecord.id },
      data: { bookImage: filePath },
    });

    return this.setBookImage(savedImageReadingRecord);
  }

  async findAll(userId: number) {
    const readingRecords = await this.prisma.readingRecord.findMany({
      where: { userId },
    });
    if (!readingRecords) return readingRecords;

    return Promise.all(
      readingRecords.map(async (readingRecord) =>
        this.setBookImage(readingRecord),
      ),
    );
  }

  async findOne(id: number, userId: number) {
    const readingRecord = await this.prisma.readingRecord.findFirst({
      where: {
        id,
        userId,
      },
    });
    if (!readingRecord) {
      throw new NotFoundException();
    }

    return this.setBookImage(readingRecord);
  }

  async update(
    id: number,
    updateReadingRecordDto: UpdateReadingRecordDto,
    userId: number,
  ) {
    const updatedReadingRecord = await this.prisma.readingRecord.update({
      where: { id, userId },
      data: updateReadingRecordDto,
    });
    return this.setBookImage(updatedReadingRecord);
  }

  async remove(id: number, userId: number) {
    return await this.prisma.readingRecord.delete({
      where: { id, userId },
    });
  }

  private async setBookImage(readingRecord: ReadingRecord) {
    if (!readingRecord.bookImage) return readingRecord;

    readingRecord.bookImage = await this.googleCloud.downloadFromStorage(
      readingRecord.bookImage,
    );
    return readingRecord;
  }
}
