import { NAVIGATION_LIST } from '@/constants/navigation';
import React from 'react';
import { Link } from 'react-router-dom';

type Props = {
  children: React.ReactNode;
};

export const BaseLayout = ({ children }: Props) => {
  return (
    <>
      <div className='p-4 md:p-16'>
        <div className='md:w-4/5 mx-auto'>
          <div className='flex justify-between'>
            <h1 className='text-base md:text-3xl text-center'>
              <Link to={NAVIGATION_LIST.readingRecords.list}>Reading Records</Link>
            </h1>
            <div className='flex items-end'>
              <Link
                to={NAVIGATION_LIST.readingRecords.list}
                className='inline underline align-bottom text-xs md:text-sm'
              >
                読書記録TOP
              </Link>
              <Link
                to={NAVIGATION_LIST.readingRecords.new}
                className='inline ml-4 underline align-bottom text-xs md:text-sm'
              >
                読書記録登録
              </Link>
            </div>
          </div>

          {children}
        </div>
      </div>
    </>
  );
};
