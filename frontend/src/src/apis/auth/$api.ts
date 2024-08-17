import type { AspidaClient, BasicHeaders } from 'aspida';
import type { Methods as Methods_rmdwew } from './auth/checkSignedIn';
import type { Methods as Methods_20ilnn } from './auth/signIn';
import type { Methods as Methods_1ybobht } from './auth/signUp';
import type { Methods as Methods_1hyhucz } from './auth/validateSignUp';

const api = <T>({ baseURL, fetch }: AspidaClient<T>) => {
  const prefix = (baseURL === undefined ? '' : baseURL).replace(/\/$/, '');
  const PATH0 = '/auth/checkSignedIn';
  const PATH1 = '/auth/signIn';
  const PATH2 = '/auth/signUp';
  const PATH3 = '/auth/validateSignUp';
  const GET = 'GET';
  const POST = 'POST';

  return {
    auth: {
      checkSignedIn: {
        /**
         * 認証済みかどうかをチェック
         * @returns 認証済みかどうかチェック成功
         */
        get: (option?: { config?: T | undefined } | undefined) =>
          fetch<Methods_rmdwew['get']['resBody'], BasicHeaders, Methods_rmdwew['get']['status']>(
            prefix,
            PATH0,
            GET,
            option,
          ).json(),
        /**
         * 認証済みかどうかをチェック
         * @returns 認証済みかどうかチェック成功
         */
        $get: (option?: { config?: T | undefined } | undefined) =>
          fetch<Methods_rmdwew['get']['resBody'], BasicHeaders, Methods_rmdwew['get']['status']>(
            prefix,
            PATH0,
            GET,
            option,
          )
            .json()
            .then((r) => r.body),
        $path: () => `${prefix}${PATH0}`,
      },
      signIn: {
        /**
         * ログイン
         * @returns ログイン成功
         */
        post: (option: { body: Methods_20ilnn['post']['reqBody']; config?: T | undefined }) =>
          fetch<Methods_20ilnn['post']['resBody'], BasicHeaders, Methods_20ilnn['post']['status']>(
            prefix,
            PATH1,
            POST,
            option,
          ).json(),
        /**
         * ログイン
         * @returns ログイン成功
         */
        $post: (option: { body: Methods_20ilnn['post']['reqBody']; config?: T | undefined }) =>
          fetch<Methods_20ilnn['post']['resBody'], BasicHeaders, Methods_20ilnn['post']['status']>(
            prefix,
            PATH1,
            POST,
            option,
          )
            .json()
            .then((r) => r.body),
        $path: () => `${prefix}${PATH1}`,
      },
      signUp: {
        /**
         * 会員登録実行
         * @returns 会員登録成功
         */
        post: (option: { body: Methods_1ybobht['post']['reqBody']; config?: T | undefined }) =>
          fetch<
            Methods_1ybobht['post']['resBody'],
            BasicHeaders,
            Methods_1ybobht['post']['status']
          >(prefix, PATH2, POST, option).json(),
        /**
         * 会員登録実行
         * @returns 会員登録成功
         */
        $post: (option: { body: Methods_1ybobht['post']['reqBody']; config?: T | undefined }) =>
          fetch<
            Methods_1ybobht['post']['resBody'],
            BasicHeaders,
            Methods_1ybobht['post']['status']
          >(prefix, PATH2, POST, option)
            .json()
            .then((r) => r.body),
        $path: () => `${prefix}${PATH2}`,
      },
      validateSignUp: {
        /**
         * 会員登録のバリデーションチェック
         * @returns バリデーションチェック成功
         */
        post: (option: { body: Methods_1hyhucz['post']['reqBody']; config?: T | undefined }) =>
          fetch<
            Methods_1hyhucz['post']['resBody'],
            BasicHeaders,
            Methods_1hyhucz['post']['status']
          >(prefix, PATH3, POST, option).json(),
        /**
         * 会員登録のバリデーションチェック
         * @returns バリデーションチェック成功
         */
        $post: (option: { body: Methods_1hyhucz['post']['reqBody']; config?: T | undefined }) =>
          fetch<
            Methods_1hyhucz['post']['resBody'],
            BasicHeaders,
            Methods_1hyhucz['post']['status']
          >(prefix, PATH3, POST, option)
            .json()
            .then((r) => r.body),
        $path: () => `${prefix}${PATH3}`,
      },
    },
  };
};

export type ApiInstance = ReturnType<typeof api>;
export default api;
