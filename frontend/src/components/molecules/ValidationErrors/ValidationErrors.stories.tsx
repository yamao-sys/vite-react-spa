import { Meta, StoryObj } from '@storybook/react';
import { ValidationErrors } from '.';

type Props = {
  messages: string[];
};
export default {
  title: 'molecules/ValidationErrors/ValidationErrors',
  component: ValidationErrors,
  tags: ['autodocs'],
  args: {} as Props,
  // Add your own control here
} as Meta;

type Story = StoryObj<typeof ValidationErrors>;

export const ValidationErrorMessages: Story = {
  args: {
    messages: ['xxは必須項目です。', 'xxは8文字以上20文字以内での入力をお願いします。'],
  },
};
