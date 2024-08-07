import { Module } from '@nestjs/common';
import { ReadingRecordsService } from './reading-records.service';
import { ReadingRecordsController } from './reading-records.controller';
import { PrismaService } from 'src/prisma.service';
import { GoogleCloudService } from 'src/google-cloud/google-cloud.service';

@Module({
  controllers: [ReadingRecordsController],
  providers: [ReadingRecordsService, PrismaService, GoogleCloudService],
})
export class ReadingRecordsModule {}
