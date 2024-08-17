/* eslint-disable */
import type { DefineMethods } from 'aspida';
import type * as Types from '../../@types';

export type Methods = DefineMethods<{
  /** ログイン */
  post: {
    status: 200;
    /** ログイン成功 */
    resBody: Types.SignInResponseDto;
    reqBody: Types.SignInDto;
  };
}>;
