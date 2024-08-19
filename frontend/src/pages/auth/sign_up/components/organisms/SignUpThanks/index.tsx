import { SignUpBaseLayout } from '../SignUpBaseLayout';

export const SignUpThanks = () => {
  return (
    <>
      <SignUpBaseLayout phase='thanks'>
        <div className='flex justify-center'>
          <div>会員登録が完了しました。</div>
          <div>ご登録いただきありがとうございます。</div>
        </div>
      </SignUpBaseLayout>
    </>
  );
};
