import type { AspidaClient, BasicHeaders } from 'aspida';
import { dataToURLString } from 'aspida';
import type { Methods as Methods_lj2wss } from './searchBooks';

const api = <T>({ baseURL, fetch }: AspidaClient<T>) => {
  const prefix = (baseURL === undefined ? '' : baseURL).replace(/\/$/, '');
  const PATH0 = '/searchBooks';
  const GET = 'GET';

  return {
    searchBooks: {
      /**
       * 書籍情報検索
       * @returns 読書記録の一覧取得成功
       */
      get: (option: { query: Methods_lj2wss['get']['query']; config?: T | undefined }) =>
        fetch<Methods_lj2wss['get']['resBody'], BasicHeaders, Methods_lj2wss['get']['status']>(
          prefix,
          PATH0,
          GET,
          option,
        ).json(),
      /**
       * 書籍情報検索
       * @returns 読書記録の一覧取得成功
       */
      $get: (option: { query: Methods_lj2wss['get']['query']; config?: T | undefined }) =>
        fetch<Methods_lj2wss['get']['resBody'], BasicHeaders, Methods_lj2wss['get']['status']>(
          prefix,
          PATH0,
          GET,
          option,
        )
          .json()
          .then((r) => r.body),
      $path: (
        option?: { method?: 'get' | undefined; query: Methods_lj2wss['get']['query'] } | undefined,
      ) => `${prefix}${PATH0}${option && option.query ? `?${dataToURLString(option.query)}` : ''}`,
    },
  };
};

export type ApiInstance = ReturnType<typeof api>;
export default api;
