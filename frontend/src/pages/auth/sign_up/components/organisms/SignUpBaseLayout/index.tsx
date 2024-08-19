import { BaseLayout } from '../BaseLayout';

type Props = {
  phase: 'form' | 'confirm' | 'thanks';
  children: React.ReactNode;
};

export const SignUpBaseLayout = ({ phase, children }: Props) => {
  return (
    <>
      <BaseLayout>
        <div className='flex justify-between mb-16'>
          <div>
            <span className={phase === 'form' ? 'text-blue-300' : 'text-gray-300'}>
              登録情報の入力
            </span>
          </div>
          <div className='text-gray-300'>&gt;&gt;</div>

          <div>
            <span className={phase === 'confirm' ? 'text-blue-300' : 'text-gray-300'}>
              登録情報の確認
            </span>
          </div>
          <div className='text-gray-300'>&gt;&gt;</div>

          <div>
            <span className={phase === 'thanks' ? 'text-blue-300' : 'text-gray-300'}>登録完了</span>
          </div>
        </div>
        {children}
      </BaseLayout>
    </>
  );
};
