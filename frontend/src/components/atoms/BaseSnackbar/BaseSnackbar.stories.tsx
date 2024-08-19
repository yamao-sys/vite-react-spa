import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { BaseSnackbar } from '.';

type Props = {
  open: boolean;
  onClose: () => void;
  message: string;
};

export default {
  title: 'atoms/BaseSnackbar/BaseSnackbar',
  component: BaseSnackbar,
  tags: ['autodocs'],
  args: {} as Props,
  // Add your own control here
} as Meta;

type Story = StoryObj<typeof BaseSnackbar>;

export const DefaultFormBox: Story = {
  args: {
    open: true,
    onClose: fn(),
    message: 'default',
  },
};
