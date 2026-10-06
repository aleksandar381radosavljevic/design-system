import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders its text inline, with no role and not focusable', () => {
    render(<Badge tone="success">Done</Badge>);
    const badge = screen.getByText('Done');
    expect(badge.tagName).toBe('SPAN');
    expect(badge).not.toHaveAttribute('role');
    expect(badge).not.toHaveAttribute('tabindex');
  });

  it('renders a decorative icon that does not change the text', () => {
    render(
      <Badge icon="check" tone="success">
        Done
      </Badge>,
    );
    const badge = screen.getByText('Done');
    expect(badge.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    expect(badge).toHaveTextContent(/^Done$/);
  });

  it('gives each tone its own class', () => {
    render(
      <>
        <Badge>Neutral</Badge>
        <Badge tone="danger">Danger</Badge>
      </>,
    );
    expect(screen.getByText('Neutral').className).not.toBe(screen.getByText('Danger').className);
  });

  it('passes through className, ref and data attributes', () => {
    const ref = vi.fn();
    render(
      <Badge className="extra" ref={ref} data-status="todo">
        To do
      </Badge>,
    );
    const badge = screen.getByText('To do');
    expect(badge).toHaveClass('extra');
    expect(badge).toHaveAttribute('data-status', 'todo');
    expect(ref).toHaveBeenCalledWith(badge);
  });
});
