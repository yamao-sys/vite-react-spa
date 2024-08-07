import { PartialType } from '@nestjs/mapped-types';
import { CreateReadingRecordDto } from './create-reading-record.dto';

export class UpdateReadingRecordDto extends PartialType(
  CreateReadingRecordDto,
) {}
