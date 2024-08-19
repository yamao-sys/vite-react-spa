import aspida from '@aspida/fetch';
import api from '@/generated/reading_records/$api';
import { CreateReadingRecordDto, UpdateReadingRecordDto } from '@/generated/reading_records/@types';

const getReadingRecordApiClient = () => {
  const baseFetchConditions = {
    baseURL: import.meta.env.VITE_BASE_API_URL,
    throwHttpErrors: true,
  };

  return api(aspida(fetch, { ...baseFetchConditions, ...{ credentials: 'include' } }));
};

export const fetchReadingRecords = async () => {
  return await getReadingRecordApiClient().readingRecords.$get();
};

export const postCreateReadingRecord = async (inputReadingRecord: CreateReadingRecordDto) => {
  return await getReadingRecordApiClient().readingRecords.$post({
    body: inputReadingRecord,
  });
};

export const updateReadingRecord = async (
  id: string,
  inputReadingRecord: UpdateReadingRecordDto,
) => {
  return await getReadingRecordApiClient().readingRecords._id(id).$patch({
    body: inputReadingRecord,
  });
};

export const deleteReadingRecord = async (id: string) => {
  return await getReadingRecordApiClient().readingRecords._id(id).$delete();
};
