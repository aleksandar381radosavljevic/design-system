import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ProgressBar } from './ProgressBar';

describe('ProgressBar', () => {
  it('is a progress bar named by its visible label', () => {
    render(<ProgressBar value={1} max={4} label="1 / 4 completed" />);
    const bar = screen.getByRole('progressbar', { name: '1 / 4 completed' });
    expect(bar).toHaveAttribute('value', '1');
    expect(bar).toHaveAttribute('max', '4');
    expect(screen.getByText('1 / 4 completed')).toBeVisible();
  });

  it('clamps the value to the range', () => {
    const { rerender } = render(<ProgressBar value={7} max={4} label="Done" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('value', '4');
    rerender(<ProgressBar value={-2} max={4} label="Done" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('value', '0');
  });

  it('is not a live region, so changes are not announced twice', () => {
    render(<ProgressBar value={1} max={2} label="Half" />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('passes through className, ref and data attributes to the wrapper', () => {
    const ref = vi.fn();
    const { container } = render(
      <ProgressBar value={1} max={2} label="Half" className="extra" ref={ref} data-testid="wrapper" />,
    );
    const wrapper = container.firstElementChild;
    expect(wrapper).toHaveClass('extra');
    expect(wrapper).toHaveAttribute('data-testid', 'wrapper');
    expect(ref).toHaveBeenCalledWith(wrapper);
  });
});
