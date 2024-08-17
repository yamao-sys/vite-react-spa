/* eslint-disable */
import type { DefineMethods } from 'aspida';
import type * as Types from '../../@types';

export type Methods = DefineMethods<{
  /** 認証済みかどうかをチェック */
  get: {
    status: 200;
    /** 認証済みかどうかチェック成功 */
    resBody: Types.CheckSignedInResponseDto;
  };
}>;
