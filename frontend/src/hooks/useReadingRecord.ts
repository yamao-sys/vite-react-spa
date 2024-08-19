import {
  CreateReadingRecordDto,
  ReadingRecordDto,
  UpdateReadingRecordDto,
} from '@/generated/reading_records/@types';
import { useCallback, useEffect, useState } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import {
  deleteReadingRecord,
  fetchReadingRecords,
  postCreateReadingRecord,
  updateReadingRecord,
} from '@/apis/readingRecordsApi';

export const useReadingRecord = () => {
  const { isSignedIn } = useAuthContext();
  const [readingRecords, setReadingRecords] = useState<ReadingRecordDto[]>([]);

  const handleFetchReadingRecords = useCallback(async () => {
    const data = await fetchReadingRecords();
    setReadingRecords(data);
  }, []);

  const handleCreateReadingRecord = useCallback(
    async (inputReadingRecord: CreateReadingRecordDto) => {
      const res = await postCreateReadingRecord(inputReadingRecord);
      setReadingRecords([...readingRecords, res]);
    },
    [readingRecords],
  );

  const handleUpdateReadingRecord = useCallback(
    async (id: string, inputReadingRecord: UpdateReadingRecordDto) => {
      const res = await updateReadingRecord(id, inputReadingRecord);
      const newReadingRecords = readingRecords.map((readingRecord) =>
        readingRecord.id === Number(id) ? res : readingRecord,
      );

      setReadingRecords(newReadingRecords);
    },
    [readingRecords],
  );

  const handleDeleteReadingRecord = useCallback(
    async (id: string) => {
      await deleteReadingRecord(id);

      const newReadingRecords = readingRecords.filter(
        (readingRecord: ReadingRecordDto) => readingRecord.id !== id,
      );
      setReadingRecords(newReadingRecords);
    },
    [readingRecords],
  );

  useEffect(() => {
    if (isSignedIn) handleFetchReadingRecords();
  }, [isSignedIn, handleFetchReadingRecords]);

  return {
    readingRecords,
    handleCreateReadingRecord,
    handleUpdateReadingRecord,
    handleDeleteReadingRecord,
  };
};
