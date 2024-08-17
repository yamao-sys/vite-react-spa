import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { BaseButton } from '.';

type Props = {
  labelText: string;
  color: 'green' | 'gray' | 'red';
  additionalStyle?: string;
} & JSX.IntrinsicElements['button'];

export default {
  title: 'atoms/BaseButton/BaseButton',
  component: BaseButton,
  tags: ['autodocs'],
  args: {} as Props,
  // Add your own control here
} as Meta;

type Story = StoryObj<typeof BaseButton>;

export const DefaultButton: Story = {
  args: {
    labelText: 'default',
    color: 'gray',
    onClick: fn(),
  },
};

export const SuccessButton: Story = {
  args: {
    labelText: 'success',
    color: 'green',
    onClick: fn(),
  },
};

export const DangerButton: Story = {
  args: {
    labelText: 'danger',
    color: 'red',
    onClick: fn(),
  },
};

export const AdditionalStyleButton: Story = {
  args: {
    labelText: 'success',
    color: 'green',
    additionalStyle: 'text-xs lg:text-sm',
    onClick: fn(),
  },
};
