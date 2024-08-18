import { ReactNode, createContext, useContext } from 'react';
import { useReadingRecord } from '../hooks/useReadingRecord';
import { CreateReadingRecordDto, ReadingRecordDto } from '@/generated/reading_records/@types';

type ReadingRecordContextType = {
  readingRecords: ReadingRecordDto[];
  handleCreateReadingRecord: (inputReadingRecord: CreateReadingRecordDto) => Promise<void>;
  handleDeleteReadingRecord: (id: string) => Promise<void>;
};

const ReadingRecordContext = createContext({} as ReadingRecordContextType);

type Props = {
  children: ReactNode;
};

export const ReadingRecordProvider = ({ children }: Props) => {
  const { readingRecords, handleCreateReadingRecord, handleDeleteReadingRecord } =
    useReadingRecord();

  return (
    <ReadingRecordContext.Provider
      value={{
        readingRecords,
        handleCreateReadingRecord,
        handleDeleteReadingRecord,
      }}
    >
      {children}
    </ReadingRecordContext.Provider>
  );
};

export const useReadingRecordContext = () => useContext(ReadingRecordContext); // eslint-disable-line react-refresh/only-export-components
