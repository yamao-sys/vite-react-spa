import { SignUpDto } from '@/generated/auth/@types';
import { useState } from 'react';

export const useSignUp = () => {
  const [signUpInput, setSignUpInput] = useState<SignUpDto>({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });

  const updateSignUpInput = (params: Partial<SignUpDto>) => {
    setSignUpInput({ ...signUpInput, ...params });
  };

  return {
    signUpInput,
    updateSignUpInput,
  };
};
