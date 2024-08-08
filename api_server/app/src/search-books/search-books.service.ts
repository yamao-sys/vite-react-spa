import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable, map } from 'rxjs';
import { BookApiResponse, BookItem } from './types/book';

@Injectable()
export class SearchBooksService {
  constructor(private httpService: HttpService) {}

  async findAll(keyword: string): Promise<Observable<BookItem[]>> {
    const params = {
      format: 'json',
      applicationId: String(process.env.BOOKS_API_APPLICATION_ID),
      title: keyword,
    };
    const response = this.httpService
      .get<BookApiResponse>(String(process.env.BOOKS_API_ENDPOINT), {
        params,
      })
      .pipe(
        map((response) =>
          response.data.Items.map((item) => {
            const book = item.Item;
            return {
              title: book.title,
              author: book.author,
              bookImageUrl: book.mediumImageUrl,
            };
          }),
        ),
      );
    return response;
  }
}
