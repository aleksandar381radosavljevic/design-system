import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Skeleton, SkeletonGroup } from './Skeleton';

describe('Skeleton', () => {
  it('is hidden from assistive technology', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('passes width and height to CSS as custom properties', () => {
    const { container } = render(<Skeleton shape="block" width="12rem" height="4rem" />);
    const skeleton = container.firstElementChild as HTMLElement;
    expect(skeleton.style.getPropertyValue('--skeleton-width')).toBe('12rem');
    expect(skeleton.style.getPropertyValue('--skeleton-height')).toBe('4rem');
  });

  it('sets no sizing when width and height are left to the defaults', () => {
    const { container } = render(<Skeleton className="extra" />);
    const skeleton = container.firstElementChild as HTMLElement;
    expect(skeleton.style.getPropertyValue('--skeleton-width')).toBe('');
    expect(skeleton).toHaveClass('extra');
  });
});

describe('SkeletonGroup', () => {
  it('is busy and announces its label once, while each bar stays hidden', () => {
    render(
      <SkeletonGroup label="Loading tasks…" data-testid="group">
        <Skeleton />
        <Skeleton />
        <Skeleton width="60%" />
      </SkeletonGroup>,
    );
    const group = screen.getByTestId('group');
    expect(group).toHaveAttribute('aria-busy', 'true');
    expect(screen.getAllByText('Loading tasks…')).toHaveLength(1);
    const bars = group.querySelectorAll('[aria-hidden="true"]');
    expect(bars).toHaveLength(3);
    expect(group).toHaveTextContent(/^Loading tasks…$/);
  });
});
