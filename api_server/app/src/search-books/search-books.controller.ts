import { Controller, Get, Query } from '@nestjs/common';
import { SearchBooksService } from './search-books.service';
import { Observable } from 'rxjs';
import { BookItem } from './types/book';

@Controller('searchBooks')
export class SearchBooksController {
  constructor(private readonly searchBooksService: SearchBooksService) {}

  @Get()
  async findAll(
    @Query('keyword') keyword: string,
  ): Promise<Observable<BookItem[]>> {
    return await this.searchBooksService.findAll(keyword);
  }
}
