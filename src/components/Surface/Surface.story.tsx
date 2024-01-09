import type { Meta, StoryObj } from '@storybook/react';

import { Surface } from './Surface';

const meta = {
  title: 'Example/Surface',
  component: Surface,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Surface>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Surface content',
  },
};
