import React from 'react';

type Props = {
  children: React.ReactNode;
};

export const BaseLayout = ({ children }: Props) => {
  return (
    <>
      <div className='p-4 md:p-16'>
        <div className='md:w-3/5 mx-auto'>{children}</div>
      </div>
    </>
  );
};
