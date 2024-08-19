import { ReactNode } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ReadingRecordProvider } from './contexts/ReadingRecordContext';

type Props = {
  children: ReactNode;
};

export const Layout = ({ children }: Props) => {
  return (
    <>
      <AuthProvider>
        <ReadingRecordProvider>{children}</ReadingRecordProvider>
      </AuthProvider>
    </>
  );
};
