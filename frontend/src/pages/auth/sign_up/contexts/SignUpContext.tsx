import { SignUpDto } from '@/generated/auth/@types';
import { createContext, FC, useContext } from 'react';
import { useSignUp } from '../hooks/useSignUp';

type Props = {
  children: React.ReactNode;
};

interface ContextInterface {
  signUpInput: SignUpDto;
  updateSignUpInput: (params: Partial<SignUpDto>) => void;
}

const SignUpContext = createContext({} as ContextInterface);

export const SignUpProvider: FC<Props> = ({ children }) => {
  const { signUpInput, updateSignUpInput } = useSignUp();

  return (
    <SignUpContext.Provider value={{ signUpInput, updateSignUpInput }}>
      {children}
    </SignUpContext.Provider>
  );
};

export const useSignUpContext = () => useContext(SignUpContext); // eslint-disable-line react-refresh/only-export-components
