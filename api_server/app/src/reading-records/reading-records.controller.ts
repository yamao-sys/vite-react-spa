import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ReadingRecordsService } from './reading-records.service';
import { CreateReadingRecordDto } from './dto/create-reading-record.dto';
import { UpdateReadingRecordDto } from './dto/update-reading-record.dto';
import { AuthGuard } from '../auth/auth.guard';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@UseGuards(AuthGuard)
@Controller('readingRecords')
export class ReadingRecordsController {
  constructor(private readonly readingRecordsService: ReadingRecordsService) {}

  @Post()
  async create(
    @Request() req: { user: JwtPayload },
    @Body() createReadingRecordDto: CreateReadingRecordDto,
  ) {
    return await this.readingRecordsService.create(
      createReadingRecordDto,
      Number(req.user.userId),
    );
  }

  @Get()
  async findAll(@Request() req: { user: JwtPayload }) {
    return await this.readingRecordsService.findAll(Number(req.user.userId));
  }

  @Get(':id')
  async findOne(@Request() req: { user: JwtPayload }, @Param('id') id: string) {
    return await this.readingRecordsService.findOne(
      +id,
      Number(req.user.userId),
    );
  }

  @Patch(':id')
  async update(
    @Request() req: { user: JwtPayload },
    @Param('id') id: string,
    @Body() updateReadingRecordDto: UpdateReadingRecordDto,
  ) {
    return await this.readingRecordsService.update(
      +id,
      updateReadingRecordDto,
      Number(req.user.userId),
    );
  }

  @Delete(':id')
  async remove(@Request() req: { user: JwtPayload }, @Param('id') id: string) {
    await this.readingRecordsService.remove(+id, Number(req.user.userId));
    return { result: true };
  }
}
