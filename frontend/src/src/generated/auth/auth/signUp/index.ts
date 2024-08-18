/* eslint-disable */
import type { DefineMethods } from 'aspida';
import type * as Types from '../../@types';

export type Methods = DefineMethods<{
  /** 会員登録実行 */
  post: {
    status: 201;
    /** 会員登録成功 */
    resBody: Types.SignUpResponseDto;
    reqBody: Types.SignUpDto;
  };
}>;
