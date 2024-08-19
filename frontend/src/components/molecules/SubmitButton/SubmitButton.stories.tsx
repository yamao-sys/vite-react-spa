import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { SubmitButton } from '.';

type Props = {
  labelText: string;
  color: 'green' | 'gray' | 'red';
  additionalStyle?: string;
} & JSX.IntrinsicElements['button'];
export default {
  title: 'molecules/SubmitButton/SubmitButton',
  component: SubmitButton,
  tags: ['autodocs'],
  args: {} as Props,
  // Add your own control here
} as Meta;

type Story = StoryObj<typeof SubmitButton>;

export const SuccessSubmitButton: Story = {
  args: {
    labelText: '保存する',
    color: 'green',
    onClick: fn(),
  },
};

export const DefaultSubmitButton: Story = {
  args: {
    labelText: '戻る',
    color: 'gray',
    onClick: fn(),
  },
};

export const DangerSubmitButton: Story = {
  args: {
    labelText: '削除する',
    color: 'red',
    onClick: fn(),
  },
};
