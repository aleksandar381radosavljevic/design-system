// Proves the test toolchain (jsdom, Testing Library, jest-dom, user-event) works
// before the first component lands. Delete once real component tests exist.
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';

it('renders, queries by role and handles keyboard input', async () => {
  const onClick = vi.fn();
  render(
    <button type="button" onClick={onClick}>
      Save
    </button>,
  );

  const button = screen.getByRole('button', { name: 'Save' });
  await userEvent.tab();
  expect(button).toHaveFocus();
  await userEvent.keyboard('{Enter}');
  expect(onClick).toHaveBeenCalledOnce();
});
