// phpcs:ignoreFile
import Component from './fieldset.twig';

const meta = {
  title: 'Atoms/Form Controls/Fieldset',
  component: Component,
  argTypes: {
    theme: {
      control: { type: 'radio' },
      options: ['light', 'dark'],
    },
    legend: {
      control: { type: 'text' },
    },
    description: {
      control: { type: 'text' },
    },
    description_display: {
      control: { type: 'radio' },
      options: ['before', 'after', 'invisible'],
    },
    message: {
      control: { type: 'text' },
    },
    message_type: {
      control: { type: 'radio' },
      options: ['error', 'information', 'warning', 'success'],
    },
    prefix: {
      control: { type: 'text' },
    },
    suffix: {
      control: { type: 'text' },
    },
    is_required: {
      control: { type: 'boolean' },
    },
    modifier_class: {
      control: { type: 'text' },
    },
    attributes: {
      control: { type: 'text' },
    },
  },
};

export default meta;

export const Fieldset = {
  parameters: {
    layout: 'centered',
  },
  args: {
    theme: 'light',
    legend: 'Fieldset legend',
    description: 'Fieldset example description',
    description_display: 'before',
    message: 'Example message',
    message_type: 'error',
    prefix: '',
    suffix: '',
    is_required: true,
    modifier_class: '',
    attributes: '',
  },
};