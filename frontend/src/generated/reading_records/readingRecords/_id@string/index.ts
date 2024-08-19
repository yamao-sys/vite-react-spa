/* eslint-disable */
import type { DefineMethods } from 'aspida';
import type * as Types from '../../@types';

export type Methods = DefineMethods<{
  /** 読書記録の取得 */
  get: {
    status: 200;
    /** 読書記録の取得成功 */
    resBody: Types.FetchReadingRecordResponseDto;
  };

  /** 読書記録の更新 */
  patch: {
    status: 200;
    /** 読書記録の更新成功 */
    resBody: Types.UpdateReadingRecordResponseDto;
    reqBody: Types.UpdateReadingRecordDto;
  };

  /** 読書記録の削除 */
  delete: {
    status: 200;
    /** 読書記録の削除成功 */
    resBody: Types.DeleteReadingRecordResponseDto;
  };
}>;
