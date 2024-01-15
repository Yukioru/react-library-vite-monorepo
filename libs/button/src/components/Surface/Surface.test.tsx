import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';

import { Surface } from './Surface';

describe('Surface', () => {
  it('should render with content', () => {
    const { getByRole } = render(<Surface>Content</Surface>);
    const button = getByRole('div');

    expect(button.textContent).toBe('Content');
  });
});
