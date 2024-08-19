import { SignUpTemplate } from './components/SignUpTemplate';
import { SignUpProvider } from './contexts/SignUpContext';

export const SignUpPage = () => {
  return (
    <>
      <SignUpProvider>
        <SignUpTemplate />
      </SignUpProvider>
    </>
  );
};
