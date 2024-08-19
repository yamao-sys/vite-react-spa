/* eslint-disable */
import type { DefineMethods } from 'aspida';
import type * as Types from '../@types';

export type Methods = DefineMethods<{
  /** 読書記録の作成 */
  post: {
    status: 201;
    /** 読書記録の作成成功 */
    resBody: Types.CreateReadingRecordResponseDto;
    reqBody: Types.CreateReadingRecordDto;
  };

  /** 読書記録の一覧取得 */
  get: {
    status: 200;
    /** 読書記録の一覧取得成功 */
    resBody: Types.FetchAllReadingRecordResponseDto;
  };
}>;
