import { render, screen } from '@testing-library/react';
import { ChevronRight } from 'lucide-react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { OsnovaProvider } from '../OsnovaProvider/OsnovaProvider';
import { Icon } from './Icon';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Icon', () => {
  it('is decorative without a label: hidden from assistive technology', () => {
    const { container } = render(<Icon name="check" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).not.toHaveAttribute('role');
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('is an image with an accessible name when labelled', () => {
    render(<Icon name="check" label="Done" />);
    const img = screen.getByRole('img', { name: 'Done' });
    expect(img).not.toHaveAttribute('aria-hidden');
  });

  it('renders at 20px by default and at the requested size', () => {
    render(
      <>
        <Icon name="check" label="default" />
        <Icon name="check" label="small" size={16} />
      </>,
    );
    expect(screen.getByRole('img', { name: 'default' })).toHaveAttribute('width', '20');
    expect(screen.getByRole('img', { name: 'small' })).toHaveAttribute('height', '16');
  });

  it('renders icons registered in the provider', () => {
    render(
      <OsnovaProvider icons={{ 'chevron-right': ChevronRight }}>
        <Icon name="chevron-right" label="Next" />
      </OsnovaProvider>,
    );
    expect(screen.getByRole('img', { name: 'Next' })).toHaveClass('lucide-chevron-right');
  });

  it('falls back to circle-help and warns in development for an unknown name', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    // A valid Lucide name (for example from data) that the app never registered.
    render(<Icon name="chevron-left" label="Back" />);
    const img = screen.getByRole('img', { name: 'Back' });
    expect(img).toHaveClass('lucide-circle-question-mark');
    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0]?.[0]).toContain('"chevron-left" is not registered');
  });

  it('warns only once per unknown name', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(
      <>
        <Icon name="arrow-up" />
        <Icon name="arrow-up" />
      </>,
    );
    expect(warn).toHaveBeenCalledOnce();
  });

  it('passes through className, ref and data attributes', () => {
    const ref = vi.fn();
    render(<Icon name="info" label="Info" className="extra" data-testid="icon" ref={ref} />);
    const img = screen.getByRole('img', { name: 'Info' });
    expect(img).toHaveClass('extra');
    expect(img).toHaveAttribute('data-testid', 'icon');
    expect(ref).toHaveBeenCalledWith(img);
  });
});
