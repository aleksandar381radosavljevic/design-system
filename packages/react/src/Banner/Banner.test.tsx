import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Banner } from './Banner';

describe('Banner', () => {
  it('is not a live region by default, so it is silent on page load', () => {
    render(<Banner tone="error">Saving failed.</Banner>);
    expect(screen.getByText('Saving failed.')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('is a status region with live="polite"', () => {
    render(
      <Banner tone="success" live="polite">
        Saved.
      </Banner>,
    );
    expect(screen.getByRole('status')).toHaveTextContent('Saved.');
  });

  it('is an alert with live="assertive"', () => {
    render(
      <Banner tone="error" live="assertive" title="Not sent">
        Check your connection.
      </Banner>,
    );
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Not sent');
    expect(alert).toHaveTextContent('Check your connection.');
  });

  it('renders a decorative tone icon that adds no text', () => {
    const { container } = render(<Banner tone="warning">Careful.</Banner>);
    const icon = container.querySelector('svg');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon).toHaveClass('lucide-triangle-alert');
  });

  it('uses the icon prop over the tone default', () => {
    const { container } = render(
      <Banner tone="info" icon="check">
        Done.
      </Banner>,
    );
    expect(container.querySelector('svg')).toHaveClass('lucide-check');
  });

  it('renders an action', () => {
    render(<Banner action={<a href="/retry">Try again</a>}>Upload failed.</Banner>);
    expect(screen.getByRole('link', { name: 'Try again' })).toBeInTheDocument();
  });

  it('has a named dismiss button that works by keyboard', async () => {
    const onDismiss = vi.fn();
    render(
      <Banner onDismiss={onDismiss} dismissLabel="Zatvori">
        Message
      </Banner>,
    );
    const dismiss = screen.getByRole('button', { name: 'Zatvori' });
    expect(dismiss).toHaveAttribute('type', 'button');
    await userEvent.tab();
    expect(dismiss).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('has no dismiss button without onDismiss', () => {
    render(<Banner>Message</Banner>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('requires dismissLabel with onDismiss in the types', () => {
    // @ts-expect-error The dismiss button needs an accessible name.
    const invalid = <Banner onDismiss={() => undefined}>Message</Banner>;
    expect(invalid).toBeDefined();
  });

  it('passes through className, ref and aria attributes', () => {
    const ref = vi.fn();
    render(
      <Banner className="extra" ref={ref} aria-label="Sync status" role="region">
        Synced.
      </Banner>,
    );
    const region = screen.getByRole('region', { name: 'Sync status' });
    expect(region).toHaveClass('extra');
    expect(ref).toHaveBeenCalledWith(region);
  });
});
