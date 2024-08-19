import { BaseButton } from '@/components/atoms/BaseButton';

type Props = {
  labelText: string;
  color: 'green' | 'gray' | 'red';
  additionalStyle?: string;
} & JSX.IntrinsicElements['button'];

export const SubmitButton = ({ labelText, color, additionalStyle = '', onClick }: Props) => {
  return (
    <>
      <div className='w-full flex justify-center'>
        <div className='mt-16'>
          <BaseButton
            labelText={labelText}
            color={color}
            additionalStyle={additionalStyle}
            onClick={onClick}
          />
        </div>
      </div>
    </>
  );
};
