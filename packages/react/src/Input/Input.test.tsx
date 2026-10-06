import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Input } from './Input';

describe('Input', () => {
  it('is named by its label', () => {
    render(<Input label="Email" type="email" />);
    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(input).toHaveAttribute('type', 'email');
    expect(input).not.toHaveAttribute('aria-invalid');
    expect(input).not.toHaveAttribute('aria-describedby');
  });

  it('keeps a hidden label as the accessible name', () => {
    render(<Input label="Search" hideLabel type="search" />);
    expect(screen.getByRole('searchbox', { name: 'Search' })).toBeInTheDocument();
    // Still in the DOM, so screen readers announce it.
    expect(screen.getByText('Search').tagName).toBe('LABEL');
  });

  it('describes the input with its hint', () => {
    render(<Input label="Phone" hint="Include the country code" />);
    expect(screen.getByRole('textbox', { name: 'Phone' })).toHaveAccessibleDescription(
      'Include the country code',
    );
  });

  it('marks the input invalid and describes it with hint, then error', () => {
    render(<Input label="Phone" hint="Include the country code" error="Enter a phone number" />);
    const input = screen.getByRole('textbox', { name: 'Phone' });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Include the country code Enter a phone number');
    expect(screen.getByText('Enter a phone number').querySelector('svg')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  it("keeps the caller's aria-describedby after its own", () => {
    render(
      <>
        <p id="extra">Shown on the receipt</p>
        <Input label="Name" error="Required" aria-describedby="extra" />
      </>,
    );
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveAccessibleDescription(
      'Required Shown on the receipt',
    );
  });

  it('uses the caller id when given, so external labels still work', () => {
    render(<Input label="City" id="city" />);
    expect(screen.getByRole('textbox', { name: 'City' })).toHaveAttribute('id', 'city');
  });

  it('gives each instance unique ids', () => {
    render(
      <>
        <Input label="First" hint="a" />
        <Input label="Second" hint="b" />
      </>,
    );
    expect(screen.getByRole('textbox', { name: 'First' }).id).not.toBe(
      screen.getByRole('textbox', { name: 'Second' }).id,
    );
    expect(screen.getByRole('textbox', { name: 'Second' })).toHaveAccessibleDescription('b');
  });

  it('accepts typing and focus by clicking the label', async () => {
    const onChange = vi.fn();
    render(<Input label="Title" onChange={onChange} />);
    await userEvent.click(screen.getByText('Title'));
    const input = screen.getByRole('textbox', { name: 'Title' });
    expect(input).toHaveFocus();
    await userEvent.keyboard('Hi');
    expect(input).toHaveValue('Hi');
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('is natively disabled', async () => {
    render(<Input label="Title" disabled />);
    const input = screen.getByRole('textbox', { name: 'Title' });
    expect(input).toBeDisabled();
    await userEvent.tab();
    expect(input).not.toHaveFocus();
  });

  it('renders a decorative start icon', () => {
    render(<Input label="Search" iconStart="info" />);
    const svg = screen.getByRole('textbox', { name: 'Search' }).parentElement?.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  it('puts className on the wrapper and ref, data and native props on the input', () => {
    const ref = vi.fn();
    const { container } = render(
      <Input label="Code" className="extra" ref={ref} data-testid="code" required inputMode="numeric" />,
    );
    const input = screen.getByRole('textbox', { name: 'Code' });
    expect(container.firstElementChild).toHaveClass('extra');
    expect(input).not.toHaveClass('extra');
    expect(input).toHaveAttribute('data-testid', 'code');
    expect(input).toBeRequired();
    expect(input).toHaveAttribute('inputmode', 'numeric');
    expect(ref).toHaveBeenCalledWith(input);
  });
});
