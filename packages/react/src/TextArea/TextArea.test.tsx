import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TextArea } from './TextArea';

describe('TextArea', () => {
  it('renders a multi-line text field named by its label', () => {
    render(<TextArea label="Message" rows={3} />);
    const textArea = screen.getByRole('textbox', { name: 'Message' });
    expect(textArea.tagName).toBe('TEXTAREA');
    expect(textArea).toHaveAttribute('rows', '3');
  });

  it('shares hint, error and aria-invalid behavior with Input', () => {
    render(<TextArea label="Message" hint="Max 500 characters" error="Write a message" />);
    const textArea = screen.getByRole('textbox', { name: 'Message' });
    expect(textArea).toHaveAttribute('aria-invalid', 'true');
    expect(textArea).toHaveAccessibleDescription('Max 500 characters Write a message');
  });

  it('accepts multi-line typing', async () => {
    render(<TextArea label="Message" />);
    const textArea = screen.getByRole('textbox', { name: 'Message' });
    await userEvent.click(textArea);
    await userEvent.keyboard('One{Enter}Two');
    expect(textArea).toHaveValue('One\nTwo');
  });

  it('is natively disabled', () => {
    render(<TextArea label="Message" disabled />);
    expect(screen.getByRole('textbox', { name: 'Message' })).toBeDisabled();
  });

  it('passes the autoGrow row limit to CSS and keeps the caller style', () => {
    render(<TextArea label="Message" rows={1} autoGrow={6} style={{ color: 'inherit' }} />);
    const textArea = screen.getByRole('textbox', { name: 'Message' });
    expect(textArea.style.getPropertyValue('--textarea-max-rows')).toBe('6');
    expect(textArea.style.color).toBe('inherit');
  });

  it('puts className on the wrapper and ref on the textarea', () => {
    const ref = vi.fn();
    const { container } = render(<TextArea label="Notes" className="extra" ref={ref} />);
    expect(container.firstElementChild).toHaveClass('extra');
    expect(ref).toHaveBeenCalledWith(screen.getByRole('textbox', { name: 'Notes' }));
  });
});
