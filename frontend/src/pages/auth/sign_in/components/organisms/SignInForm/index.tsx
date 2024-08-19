import { SignInResponseDto } from '@/generated/auth/@types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BaseLayout } from '@/pages/auth/sign_up/components/organisms/BaseLayout';
import { ValidationErrors } from '@/components/molecules/ValidationErrors';
import { BaseFormBox } from '@/components/atoms/BaseFormBox';
import { InputForm } from '@/components/atoms/InputForm';
import { SubmitButton } from '@/components/molecules/SubmitButton';
import { NAVIGATION_LIST } from '@/constants/navigation';
import { postSignIn } from '@/apis/authApi';

const INITIAL_VALIDATION_ERRORS = {
  errors: [],
};

export default function SignInForm() {
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [validationErrors, setValidationErrors] =
    useState<SignInResponseDto>(INITIAL_VALIDATION_ERRORS);

  const handleChangeInputEmail = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInputEmail(e.target.value);
  const handleChangeInputPassword = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInputPassword(e.target.value);

  const navigate = useNavigate();

  const handleSignIn = async () => {
    setValidationErrors(INITIAL_VALIDATION_ERRORS);

    try {
      const response = await postSignIn({
        email: inputEmail,
        password: inputPassword,
      });

      if (response?.errors.length) {
        setValidationErrors(response);
        setInputPassword('');
      } else {
        console.log('signed');
        navigate(NAVIGATION_LIST.readingRecords.list);
      }
    } catch (error) {
      // TODO: エラーハンドリング
      console.log(error);
    }
  };

  return (
    <>
      <BaseLayout>
        <p className='text-center md:text-3xl mb-16'>ログイン</p>

        {!!validationErrors.errors.length && (
          <ValidationErrors messages={validationErrors.errors} />
        )}
        <BaseFormBox>
          <InputForm
            labelId='email'
            labelText='メールアドレス'
            value={inputEmail}
            onChange={handleChangeInputEmail}
          />
        </BaseFormBox>

        <BaseFormBox>
          <InputForm
            labelId='password'
            labelText='パスワード'
            type='password'
            value={inputPassword}
            onChange={handleChangeInputPassword}
          />
        </BaseFormBox>

        <SubmitButton labelText='ログインする' color='green' onClick={handleSignIn} />
      </BaseLayout>
    </>
  );
}
