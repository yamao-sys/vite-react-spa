import type { AspidaClient, BasicHeaders } from 'aspida';
import type { Methods as Methods_1y1mq94 } from './readingRecords';
import type { Methods as Methods_1818xes } from './readingRecords/_id@string';

const api = <T>({ baseURL, fetch }: AspidaClient<T>) => {
  const prefix = (baseURL === undefined ? '' : baseURL).replace(/\/$/, '');
  const PATH0 = '/readingRecords';
  const GET = 'GET';
  const POST = 'POST';
  const DELETE = 'DELETE';
  const PATCH = 'PATCH';

  return {
    readingRecords: {
      _id: (val1: string) => {
        const prefix1 = `${PATH0}/${val1}`;

        return {
          /**
           * 読書記録の取得
           * @returns 読書記録の取得成功
           */
          get: (option?: { config?: T | undefined } | undefined) =>
            fetch<
              Methods_1818xes['get']['resBody'],
              BasicHeaders,
              Methods_1818xes['get']['status']
            >(prefix, prefix1, GET, option).json(),
          /**
           * 読書記録の取得
           * @returns 読書記録の取得成功
           */
          $get: (option?: { config?: T | undefined } | undefined) =>
            fetch<
              Methods_1818xes['get']['resBody'],
              BasicHeaders,
              Methods_1818xes['get']['status']
            >(prefix, prefix1, GET, option)
              .json()
              .then((r) => r.body),
          /**
           * 読書記録の更新
           * @returns 読書記録の更新成功
           */
          patch: (option: { body: Methods_1818xes['patch']['reqBody']; config?: T | undefined }) =>
            fetch<
              Methods_1818xes['patch']['resBody'],
              BasicHeaders,
              Methods_1818xes['patch']['status']
            >(prefix, prefix1, PATCH, option).json(),
          /**
           * 読書記録の更新
           * @returns 読書記録の更新成功
           */
          $patch: (option: { body: Methods_1818xes['patch']['reqBody']; config?: T | undefined }) =>
            fetch<
              Methods_1818xes['patch']['resBody'],
              BasicHeaders,
              Methods_1818xes['patch']['status']
            >(prefix, prefix1, PATCH, option)
              .json()
              .then((r) => r.body),
          /**
           * 読書記録の削除
           * @returns 読書記録の削除成功
           */
          delete: (option?: { config?: T | undefined } | undefined) =>
            fetch<
              Methods_1818xes['delete']['resBody'],
              BasicHeaders,
              Methods_1818xes['delete']['status']
            >(prefix, prefix1, DELETE, option).json(),
          /**
           * 読書記録の削除
           * @returns 読書記録の削除成功
           */
          $delete: (option?: { config?: T | undefined } | undefined) =>
            fetch<
              Methods_1818xes['delete']['resBody'],
              BasicHeaders,
              Methods_1818xes['delete']['status']
            >(prefix, prefix1, DELETE, option)
              .json()
              .then((r) => r.body),
          $path: () => `${prefix}${prefix1}`,
        };
      },
      /**
       * 読書記録の作成
       * @returns 読書記録の作成成功
       */
      post: (option: { body: Methods_1y1mq94['post']['reqBody']; config?: T | undefined }) =>
        fetch<Methods_1y1mq94['post']['resBody'], BasicHeaders, Methods_1y1mq94['post']['status']>(
          prefix,
          PATH0,
          POST,
          option,
        ).json(),
      /**
       * 読書記録の作成
       * @returns 読書記録の作成成功
       */
      $post: (option: { body: Methods_1y1mq94['post']['reqBody']; config?: T | undefined }) =>
        fetch<Methods_1y1mq94['post']['resBody'], BasicHeaders, Methods_1y1mq94['post']['status']>(
          prefix,
          PATH0,
          POST,
          option,
        )
          .json()
          .then((r) => r.body),
      /**
       * 読書記録の一覧取得
       * @returns 読書記録の一覧取得成功
       */
      get: (option?: { config?: T | undefined } | undefined) =>
        fetch<Methods_1y1mq94['get']['resBody'], BasicHeaders, Methods_1y1mq94['get']['status']>(
          prefix,
          PATH0,
          GET,
          option,
        ).json(),
      /**
       * 読書記録の一覧取得
       * @returns 読書記録の一覧取得成功
       */
      $get: (option?: { config?: T | undefined } | undefined) =>
        fetch<Methods_1y1mq94['get']['resBody'], BasicHeaders, Methods_1y1mq94['get']['status']>(
          prefix,
          PATH0,
          GET,
          option,
        )
          .json()
          .then((r) => r.body),
      $path: () => `${prefix}${PATH0}`,
    },
  };
};

export type ApiInstance = ReturnType<typeof api>;
export default api;
