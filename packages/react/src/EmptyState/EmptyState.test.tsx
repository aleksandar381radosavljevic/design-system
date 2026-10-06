import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../Button/Button';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders a level-2 heading by default', () => {
    render(<EmptyState title="No tasks yet" />);
    expect(screen.getByRole('heading', { level: 2, name: 'No tasks yet' })).toBeInTheDocument();
  });

  it('renders the requested heading level', () => {
    render(<EmptyState title="No results" headingLevel={3} />);
    expect(screen.getByRole('heading', { level: 3, name: 'No results' })).toBeInTheDocument();
  });

  it('reads heading, description, then action in order, with a reachable action', async () => {
    const onCreate = vi.fn();
    const { container } = render(
      <EmptyState
        title="No tasks yet"
        description="Tasks you add show up here."
        icon="info"
        action={
          <Button variant="secondary" onClick={onCreate}>
            Add a task
          </Button>
        }
      />,
    );
    expect(container).toHaveTextContent(/^No tasks yetTasks you add show up here\.Add a task$/);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'Add a task' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(onCreate).toHaveBeenCalledOnce();
  });

  it('is not a live region', () => {
    render(<EmptyState title="Nothing here" />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('passes through className, ref and data attributes', () => {
    const ref = vi.fn();
    const { container } = render(
      <EmptyState title="Nothing" className="extra" ref={ref} data-testid="empty" />,
    );
    expect(container.firstElementChild).toHaveClass('extra');
    expect(screen.getByTestId('empty')).toBe(container.firstElementChild);
    expect(ref).toHaveBeenCalledWith(container.firstElementChild);
  });

  it('only accepts heading levels 2 to 4', () => {
    // @ts-expect-error h1 belongs to the page title.
    const invalid = <EmptyState title="Nothing" headingLevel={1} />;
    expect(invalid).toBeDefined();
  });
});
