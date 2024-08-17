import api from '@/apis/auth/$api';
import aspida from '@aspida/fetch';

export const getAuthApiClient = () => {
  const baseFetchConditions = {
    baseURL: import.meta.env.VITE_BASE_API_URL,
    throwHttpErrors: true,
  };

  return api(aspida(fetch, { ...baseFetchConditions }));
};
