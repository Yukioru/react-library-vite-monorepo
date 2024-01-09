import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';

import { Button } from './Button';

describe('Button', () => {
  it('should render with type and content', () => {
    const { getByRole } = render(<Button type="button">Content</Button>);
    const button = getByRole('button');

    expect(button.getAttribute('type')).toBe('button');
    expect(button.textContent).toBe('Content');
  });
});
