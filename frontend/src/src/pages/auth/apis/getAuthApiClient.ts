import api from '@/generated/auth/$api';
import aspida, { FetchConfig } from '@aspida/fetch';

export const getAuthApiClient = (options?: FetchConfig) => {
  const baseFetchConditions = {
    baseURL: import.meta.env.VITE_BASE_API_URL,
    throwHttpErrors: true,
  };

  return api(aspida(fetch, { ...baseFetchConditions, ...(options || {}) }));
};
