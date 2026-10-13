import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { SegmentedControl, type SegmentedControlProps } from './SegmentedControl';

const options = [
  { value: 'todo', label: 'Not started' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'done', label: 'Done' },
];

function Controlled(props: Partial<SegmentedControlProps>) {
  const [value, setValue] = useState('todo');
  return <SegmentedControl legend="Status" options={options} value={value} onChange={setValue} {...props} />;
}

describe('SegmentedControl', () => {
  it('is a named group of radio buttons with the value checked', () => {
    render(<SegmentedControl legend="Status" options={options} value="in_progress" onChange={() => undefined} />);
    expect(screen.getByRole('group', { name: 'Status' })).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
    expect(screen.getByRole('radio', { name: 'In progress' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Done' })).not.toBeChecked();
  });

  it('reports a click on a segment', async () => {
    const onChange = vi.fn();
    render(<SegmentedControl legend="Status" options={options} value="todo" onChange={onChange} />);
    await userEvent.click(screen.getByText('Done'));
    expect(onChange).toHaveBeenCalledWith('done');
  });

  it('moves and selects with the arrow keys after one Tab', async () => {
    render(<Controlled />);
    await userEvent.tab();
    expect(screen.getByRole('radio', { name: 'Not started' })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: 'In progress' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'In progress' })).toHaveFocus();
  });

  it('keeps a hidden legend as the accessible name', () => {
    render(<Controlled legend="Passport renewal" legendDisplay="hidden" />);
    expect(screen.getByRole('group', { name: 'Passport renewal' })).toBeInTheDocument();
  });

  it('disables one option or the whole group', async () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <SegmentedControl
        legend="Status"
        options={[...options.slice(0, 2), { value: 'done', label: 'Done', disabled: true }]}
        value="todo"
        onChange={onChange}
      />,
    );
    expect(screen.getByRole('radio', { name: 'Done' })).toBeDisabled();
    await userEvent.click(screen.getByText('Done'));
    expect(onChange).not.toHaveBeenCalled();

    rerender(<SegmentedControl legend="Status" options={options} value="todo" onChange={onChange} disabled />);
    for (const radio of screen.getAllByRole('radio')) expect(radio).toBeDisabled();
  });

  it('shares one name between its radios', () => {
    render(<Controlled name="status-1" />);
    for (const radio of screen.getAllByRole('radio')) expect(radio).toHaveAttribute('name', 'status-1');
  });

  it('passes through className, ref and aria attributes to the fieldset', () => {
    const ref = vi.fn();
    render(<Controlled className="extra" ref={ref} aria-describedby="hint" />);
    const group = screen.getByRole('group');
    expect(group).toHaveClass('extra');
    expect(group).toHaveAttribute('aria-describedby', 'hint');
    expect(ref).toHaveBeenCalledWith(group);
  });
});
