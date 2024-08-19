import { useState } from 'react';
import { SignUpBaseLayout } from '../SignUpBaseLayout';
import { BaseFormBox } from '@/components/atoms/BaseFormBox';
import { InputForm } from '@/components/atoms/InputForm';
import { SubmitButton } from '@/components/molecules/SubmitButton';
import { ValidationErrors } from '@/components/molecules/ValidationErrors';
import { useSignUpContext } from '../../../contexts/SignUpContext';
import { PhaseType } from '../../../types';
import { ValidateSignUpResponseDto } from '@/generated/auth/@types';
import { postValidateSignUp } from '@/apis/authApi';

type Props = {
  togglePhase: (newPhase: PhaseType) => void;
};

const INITIAL_VALIDATION_ERRORS = {
  errors: {
    name: [],
    email: [],
    password: [],
    passwordConfirm: [],
  },
};

export const SignUpInput = ({ togglePhase }: Props) => {
  const { signUpInput, updateSignUpInput } = useSignUpContext();

  const [validationErrors, setValidationErrors] =
    useState<ValidateSignUpResponseDto>(INITIAL_VALIDATION_ERRORS);

  const handleMoveToConfirm = () => togglePhase('confirmation');

  const handleValidateSignUp = async () => {
    setValidationErrors(INITIAL_VALIDATION_ERRORS);

    try {
      const response = await postValidateSignUp(signUpInput);

      // バリデーションエラーがなければ、確認画面へ遷移
      if (Object.keys(response.errors).length === 0) {
        handleMoveToConfirm();
        return;
      }

      // NOTE: バリデーションエラーの格納と入力パスワードのリセット
      setValidationErrors(response);
      updateSignUpInput({ password: '', passwordConfirm: '' });
    } catch (error) {
      // TODO: エラーハンドリング
      console.log(error);
    }
  };

  return (
    <>
      <SignUpBaseLayout phase='form'>
        <BaseFormBox needsMargin={false}>
          <InputForm
            labelId='name'
            labelText='ユーザ名'
            value={signUpInput.name}
            onChange={(e) => updateSignUpInput({ name: e.target.value })}
          />
          {!!validationErrors.errors?.name?.length && (
            <ValidationErrors messages={validationErrors.errors.name} />
          )}
        </BaseFormBox>

        <BaseFormBox>
          <InputForm
            labelId='email'
            labelText='メールアドレス'
            value={signUpInput.email}
            onChange={(e) => updateSignUpInput({ email: e.target.value })}
          />
          {!!validationErrors.errors?.email?.length && (
            <ValidationErrors messages={validationErrors.errors.email} />
          )}
        </BaseFormBox>

        <BaseFormBox>
          <InputForm
            labelId='password'
            labelText='パスワード'
            type='password'
            value={signUpInput.password}
            onChange={(e) => updateSignUpInput({ password: e.target.value })}
          />
          {!!validationErrors.errors?.password?.length && (
            <ValidationErrors messages={validationErrors.errors.password} />
          )}
        </BaseFormBox>

        <BaseFormBox>
          <InputForm
            labelId='password-confirm'
            labelText='パスワード確認用'
            type='password'
            value={signUpInput.passwordConfirm}
            onChange={(e) => updateSignUpInput({ passwordConfirm: e.target.value })}
          />
          {!!validationErrors.errors?.passwordConfirm?.length && (
            <ValidationErrors messages={validationErrors.errors.passwordConfirm} />
          )}
        </BaseFormBox>

        <SubmitButton labelText='確認画面へ' color='green' onClick={handleValidateSignUp} />
      </SignUpBaseLayout>
    </>
  );
};
