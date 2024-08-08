import { Test, TestingModule } from '@nestjs/testing';
import { SearchBooksService } from './search-books.service';
import { mock } from 'jest-mock-extended';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { BookApiResponse } from './types/book';

const pipe = jest.fn();

describe('SearchBooksService', () => {
  let service: SearchBooksService;

  beforeEach(async () => {
    const httpServiceMock = mock<HttpService>();
    httpServiceMock.get.mockReturnValue({
      data: {
        Items: [
          {
            Item: {
              title: 'test_title',
              author: 'test_author',
              mediumImageUrl: 'https://example.com/1',
            },
          },
          {
            Item: {
              title: 'test_title_2',
              author: 'test_author_2',
              mediumImageUrl: 'https://example.com/2',
            },
          },
        ],
      },
      pipe,
    } as unknown as Observable<AxiosResponse<BookApiResponse, any>>);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchBooksService,
        { provide: HttpService, useValue: httpServiceMock },
      ],
    }).compile();

    service = module.get<SearchBooksService>(SearchBooksService);
  });

  describe('findAll', () => {
    it('検索結果が返ってくること', async () => {
      await service.findAll('test_title');

      expect(pipe).toHaveBeenCalled();
    });
  });
});
