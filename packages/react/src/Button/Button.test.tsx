import { render, screen } from '@testing-library/react';
import type { MouseEvent, SyntheticEvent } from 'react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders a button named by its label, with type="button" by default', () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveAttribute('type', 'button');
  });

  it('does not submit a form unless type="submit" is passed', async () => {
    const onSubmit = vi.fn((event: SyntheticEvent) => {
      event.preventDefault();
    });
    render(
      <form onSubmit={onSubmit}>
        <Button>Cancel</Button>
        <Button type="submit">Send</Button>
      </form>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onSubmit).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Send' }));
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it('activates with Enter and Space', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'Save' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('is natively disabled: not focusable and not clickable', async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toBeDisabled();
    await userEvent.click(button);
    await userEvent.tab();
    expect(button).not.toHaveFocus();
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders a link when href is given', async () => {
    const onClick = vi.fn((event: MouseEvent) => {
      event.preventDefault();
    });
    render(
      <Button href="/tasks/new" variant="secondary" onClick={onClick}>
        New task
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'New task' });
    expect(link).toHaveAttribute('href', '/tasks/new');
    expect(link).not.toHaveAttribute('type');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    link.focus();
    await userEvent.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('while loading: busy, keeps its name and focus, and ignores clicks', async () => {
    const onClick = vi.fn();
    render(
      <Button loading iconStart="check" onClick={onClick}>
        Save
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toBeEnabled();
    // The spinner replaces iconStart.
    expect(button.querySelector('.lucide-loader-circle')).toBeInTheDocument();
    expect(button.querySelector('.lucide-check')).not.toBeInTheDocument();

    await userEvent.tab();
    expect(button).toHaveFocus();
    await userEvent.click(button);
    await userEvent.keyboard('{Enter}');
    expect(onClick).not.toHaveBeenCalled();
  });

  it('does not submit a form while loading', async () => {
    const onSubmit = vi.fn();
    render(
      <form onSubmit={onSubmit}>
        <Button type="submit" loading>
          Send
        </Button>
      </form>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Send' }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('renders decorative icons that do not change the accessible name', () => {
    render(
      <Button iconStart="check" iconEnd="info">
        Save
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Save' });
    const icons = button.querySelectorAll('svg');
    expect(icons).toHaveLength(2);
    icons.forEach((icon) => {
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  it('names an icon-only button with aria-label', () => {
    render(<Button iconStart="x" aria-label="Close" variant="ghost" />);
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('passes through className, ref, aria and data attributes', () => {
    const ref = vi.fn();
    render(
      <Button className="extra" ref={ref} aria-describedby="help" data-testid="save">
        Save
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveClass('extra');
    expect(button.className.split(' ').length).toBeGreaterThan(1);
    expect(button).toHaveAttribute('aria-describedby', 'help');
    expect(button).toHaveAttribute('data-testid', 'save');
    expect(ref).toHaveBeenCalledWith(button);
  });

  it('enforces its accessibility rules in the types', () => {
    // These lines are checked by `npm run typecheck`; rendering them is incidental.
    const invalid = (
      <>
        {/* @ts-expect-error An icon-only button needs aria-label. */}
        <Button iconStart="x" />
        {/* @ts-expect-error A link cannot be disabled. */}
        <Button href="/tasks" disabled>
          Tasks
        </Button>
        {/* @ts-expect-error Icon names are checked: "chevron-rihgt" is a typo. */}
        <Button iconStart="chevron-rihgt">Next</Button>
        {/* @ts-expect-error Variants are a closed set. */}
        <Button variant="link">Save</Button>
      </>
    );
    expect(invalid).toBeDefined();
  });
});
