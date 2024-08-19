import aspida from '@aspida/fetch';
import api from '@/generated/search_books/$api';

const getSearchBooksApiClient = () => {
  const baseFetchConditions = {
    baseURL: import.meta.env.VITE_BASE_API_URL,
    throwHttpErrors: true,
  };

  return api(aspida(fetch, { ...baseFetchConditions, ...{ credentials: 'include' } }));
};

export const searchBooks = async (keyword: string) => {
  return await getSearchBooksApiClient().searchBooks.$get({
    query: { keyword },
  });
};
