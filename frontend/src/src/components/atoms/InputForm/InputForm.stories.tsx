import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { InputForm } from '.';

type Props = { labelText: string; labelId: string } & JSX.IntrinsicElements['input'];
export default {
  title: 'atoms/InputForm/InputForm',
  component: InputForm,
  tags: ['autodocs'],
  args: {} as Props,
  // Add your own control here
} as Meta;

type Story = StoryObj<typeof InputForm>;

export const EmailInputForm: Story = {
  args: {
    labelId: 'email',
    labelText: 'メールアドレス',
    value: 'test@example.com',
    onChange: fn(),
  },
};

export const PasswordInputForm: Story = {
  args: {
    labelId: 'password',
    labelText: 'パスワード',
    type: 'password',
    value: 'password',
    onChange: fn(),
  },
};

export const TextInputForm: Story = {
  args: {
    labelId: 'title',
    labelText: 'タイトル',
    value: 'title',
    onChange: fn(),
  },
};
