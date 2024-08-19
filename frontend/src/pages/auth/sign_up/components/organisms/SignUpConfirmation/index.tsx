import { postSignUp } from '@/apis/authApi';
import { useSignUpContext } from '../../../contexts/SignUpContext';
import { PhaseType } from '../../../types';
import { SignUpBaseLayout } from '../SignUpBaseLayout';
import { BaseButton } from '@/components/atoms/BaseButton';

type Props = {
  togglePhase: (newPhase: PhaseType) => void;
};

export const SignUpConfirmation = ({ togglePhase }: Props) => {
  const { signUpInput } = useSignUpContext();

  const handleBackPage = () => togglePhase('input');

  const handleSignUp = async () => {
    try {
      await postSignUp(signUpInput);
      togglePhase('thanks');
    } catch (error) {
      // TODO: エラーハンドリング
      console.log(error);
    }
  };

  return (
    <>
      <SignUpBaseLayout phase='confirm'>
        <div className='flex w-full justify-around'>
          <div className='w-1/2 align-middle'>ユーザ名: </div>
          <div className='w-1/2 align-middle'>{signUpInput.name}</div>
        </div>
        <div className='flex w-full justify-around mt-8'>
          <div className='w-1/2 align-middle'>メールアドレス: </div>
          <div className='w-1/2 align-middle'>{signUpInput.email}</div>
        </div>
        <div className='flex w-full justify-around mt-8'>
          <div className='w-1/2 align-middle'>パスワード: </div>
          <div className='w-1/2 align-middle'>{'*'.repeat(signUpInput.password.length)}</div>
        </div>
        <div className='flex w-full justify-around mt-16'>
          <BaseButton labelText='入力へ戻る' color='gray' onClick={handleBackPage} />
          <BaseButton labelText='登録する' color='green' onClick={handleSignUp} />
        </div>
      </SignUpBaseLayout>
    </>
  );
};
