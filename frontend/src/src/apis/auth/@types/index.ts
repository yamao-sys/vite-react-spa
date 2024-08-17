/* eslint-disable */
/** 読書記録作成のrequest DTO */
export type SignUpDto = {
  name?: string | undefined;
  email: string;
  password: string;
  passwordConfirm: string;
};

/** 会員登録のバリデーションチェックのレスポンスDTO */
export type ValidateSignUpResponseDto = {
  errors: {
    name?: string[] | undefined;
    email?: string[] | undefined;
    password?: string[] | undefined;
    passwordConfirm?: string[] | undefined;
  };
};

/** 会員登録のレスポンスDTO */
export type SignUpResponseDto = {
  result: boolean;
};

/** Sign in params. */
export type SignInDto = {
  email: string;
  password: string;
  errors?: string[] | undefined;
};

/** ログインのレスポンス */
export type SignInResponseDto = {
  errors: string[];
};

/** 認証済みかどうかチェックのレスポンスDTO */
export type CheckSignedInResponseDto = boolean;
