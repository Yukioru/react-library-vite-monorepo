import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';

import { Surface } from './Surface';

describe('Surface', () => {
  it('should render with content', () => {
    const { container } = render(<Surface>Content</Surface>);
    const button = container.querySelector('[data-ui="Surface"]');

    expect(button?.textContent).toBe('Content');
  });
});
