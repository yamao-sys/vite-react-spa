/* eslint-disable */
import type { DefineMethods } from 'aspida';
import type * as Types from '../../@types';

export type Methods = DefineMethods<{
  /** 会員登録のバリデーションチェック */
  post: {
    status: 201;
    /** バリデーションチェック成功 */
    resBody: Types.ValidateSignUpResponseDto;
    reqBody: Types.SignUpDto;
  };
}>;
