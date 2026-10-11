import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { Button } from '../Button/Button';
import { Dialog } from './Dialog';

// jsdom has no showModal()/close(). This stand-in covers what the component
// relies on: the `open` attribute and the `close` event. The browser's focus
// trap and top layer are not simulated.
beforeAll(() => {
  Object.assign(HTMLDialogElement.prototype, {
    showModal(this: HTMLDialogElement) {
      this.setAttribute('open', '');
    },
    close(this: HTMLDialogElement) {
      if (!this.hasAttribute('open')) return;
      this.removeAttribute('open');
      this.dispatchEvent(new Event('close'));
    },
  });
});

function ConfirmReset({ onConfirm = () => undefined }: { onConfirm?: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="ghost" onClick={() => { setOpen(true); }}>
        Reset progress
      </Button>
      <Dialog
        open={open}
        onClose={() => { setOpen(false); }}
        title="Reset progress?"
        description="Every step goes back to not started."
        actions={
          <>
            <Button variant="secondary" autoFocus onClick={() => { setOpen(false); }}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                onConfirm();
                setOpen(false);
              }}
            >
              Reset
            </Button>
          </>
        }
      />
    </>
  );
}

describe('Dialog', () => {
  it('is hidden until opened', () => {
    render(<ConfirmReset />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens as a dialog named by its title and described by its description', async () => {
    render(<ConfirmReset />);
    await userEvent.click(screen.getByRole('button', { name: 'Reset progress' }));
    const dialog = screen.getByRole('dialog', { name: 'Reset progress?' });
    expect(dialog).toHaveAccessibleDescription('Every step goes back to not started.');
    expect(screen.getByRole('heading', { name: 'Reset progress?' })).toBeInTheDocument();
  });

  it('closes through an action and runs it', async () => {
    const onConfirm = vi.fn();
    render(<ConfirmReset onConfirm={onConfirm} />);
    await userEvent.click(screen.getByRole('button', { name: 'Reset progress' }));
    await userEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(onConfirm).toHaveBeenCalledOnce();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('asks the app to close on Escape instead of closing itself', () => {
    const onClose = vi.fn();
    render(<Dialog open onClose={onClose} title="Details" />);
    const dialog = screen.getByRole('dialog');
    const cancel = new Event('cancel', { cancelable: true });
    fireEvent(dialog, cancel);
    expect(onClose).toHaveBeenCalledOnce();
    expect(cancel.defaultPrevented).toBe(true);
    expect(dialog).toHaveAttribute('open');
  });

  it('ignores backdrop clicks unless closeOnBackdrop is set', () => {
    const onClose = vi.fn();
    const { rerender } = render(<Dialog open onClose={onClose} title="Details" />);
    fireEvent.click(screen.getByRole('dialog'));
    expect(onClose).not.toHaveBeenCalled();

    rerender(<Dialog open onClose={onClose} title="Details" closeOnBackdrop />);
    fireEvent.click(screen.getByRole('heading'));
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('dialog'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('reports a close the browser started, such as a form with method="dialog"', () => {
    const onClose = vi.fn();
    render(<Dialog open onClose={onClose} title="Details" />);
    screen.getByRole<HTMLDialogElement>('dialog').close();
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('passes through className, ref and data attributes', () => {
    const ref = vi.fn();
    render(<Dialog open onClose={() => undefined} title="Details" className="extra" ref={ref} data-testid="d" />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('extra');
    expect(dialog).toHaveAttribute('data-testid', 'd');
    expect(ref).toHaveBeenCalledWith(dialog);
  });
});
