import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SearchBooksService } from './search-books.service';
import { SearchBooksController } from './search-books.controller';

@Module({
  imports: [HttpModule],
  controllers: [SearchBooksController],
  providers: [SearchBooksService],
})
export class SearchBooksModule {}
