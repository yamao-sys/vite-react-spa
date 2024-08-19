/* eslint-disable */
import type { DefineMethods } from 'aspida';
import type * as Types from '../@types';

export type Methods = DefineMethods<{
  /** 書籍情報検索 */
  get: {
    query: {
      keyword: string;
    };

    status: 200;
    /** 読書記録の一覧取得成功 */
    resBody: Types.SearchBooksResponseDto;
  };
}>;
