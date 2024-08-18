import { CreateReadingRecordDto, ReadingRecordDto } from '@/generated/reading_records/@types';
import { useCallback, useEffect, useState } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import {
  deleteReadingRecord,
  fetchReadingRecords,
  postCreateReadingRecord,
} from '@/apis/readingRecordsApi';

export const useReadingRecord = () => {
  const { isSignedIn } = useAuthContext();
  const [readingRecords, setReadingRecords] = useState<ReadingRecordDto[]>([]);

  const handleFetchReadingRecords = useCallback(async () => {
    const data = await fetchReadingRecords();
    setReadingRecords(data);
  }, [setReadingRecords]);

  const handleCreateReadingRecord = useCallback(
    async (inputReadingRecord: CreateReadingRecordDto) => {
      const res = await postCreateReadingRecord(inputReadingRecord);
      setReadingRecords([...readingRecords, res]);
    },
    [readingRecords, setReadingRecords],
  );

  const handleDeleteReadingRecord = useCallback(
    async (id: string) => {
      await deleteReadingRecord(id);

      const newReadingRecords = readingRecords.filter(
        (readingRecord: ReadingRecordDto) => readingRecord.id !== id,
      );
      setReadingRecords(newReadingRecords);
    },
    [readingRecords, setReadingRecords],
  );

  useEffect(() => {
    if (isSignedIn) handleFetchReadingRecords();
  }, [isSignedIn, handleFetchReadingRecords]);

  return {
    readingRecords,
    handleCreateReadingRecord,
    handleDeleteReadingRecord,
  };
};
