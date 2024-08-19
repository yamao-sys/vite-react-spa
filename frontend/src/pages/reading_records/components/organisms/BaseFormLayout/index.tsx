import React from 'react';

type Props = {
  children: React.ReactNode;
  additionalStyle?: string;
};

export const BaseFormLayout = ({ children, additionalStyle = '' }: Props) => {
  return (
    <>
      <div className={`mt-16 ${additionalStyle}`}>{children}</div>
    </>
  );
};
