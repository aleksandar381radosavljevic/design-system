import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { OsnovaProvider } from '../OsnovaProvider/OsnovaProvider';
import type { LinkComponentProps } from '../OsnovaProvider/OsnovaContext';
import { IllustratedCard } from './IllustratedCard';

const art = <svg data-testid="art" />;

describe('IllustratedCard', () => {
  it('is a link named by its title, inside a heading', () => {
    render(<IllustratedCard href="/moving" title="Moving house" illustration={art} />);
    const link = screen.getByRole('link', { name: 'Moving house' });
    expect(link).toHaveAttribute('href', '/moving');
    expect(screen.getByRole('heading', { level: 3, name: 'Moving house' })).toContainElement(link);
  });

  it('uses the requested heading level', () => {
    render(<IllustratedCard href="/x" title="Passport" illustration={art} headingLevel={2} />);
    expect(screen.getByRole('heading', { level: 2, name: 'Passport' })).toBeInTheDocument();
  });

  it('hides the illustration and the sticker tape from screen readers', () => {
    const { container } = render(
      <IllustratedCard href="/x" title="Passport" illustration={art} variant="sticker" />,
    );
    expect(screen.getByTestId('art').closest('[aria-hidden="true"]')).not.toBeNull();
    const hidden = container.querySelectorAll('[aria-hidden="true"]');
    expect(hidden).toHaveLength(2);
  });

  it('shows the meta line as text after the title', () => {
    render(<IllustratedCard href="/x" title="Passport" illustration={art} meta="1 to 4 weeks" />);
    expect(screen.getByText('1 to 4 weeks')).toBeVisible();
    expect(screen.getByRole('link', { name: 'Passport' })).not.toHaveTextContent('1 to 4 weeks');
  });

  it('tilts a sticker within -8..8 degrees and never tilts a tile', () => {
    render(
      <>
        <IllustratedCard data-testid="steep" href="/a" title="A" illustration={art} variant="sticker" tilt={-20} />
        <IllustratedCard data-testid="slight" href="/b" title="B" illustration={art} variant="sticker" tilt={5} />
        <IllustratedCard data-testid="tile" href="/c" title="C" illustration={art} tilt={5} />
      </>,
    );
    expect(screen.getByTestId('steep').style.getPropertyValue('--osnova-tilt')).toBe('-8deg');
    expect(screen.getByTestId('slight').style.getPropertyValue('--osnova-tilt')).toBe('5deg');
    expect(screen.getByTestId('tile').style.getPropertyValue('--osnova-tilt')).toBe('0deg');
  });

  it('renders the provider link component', () => {
    function RouterLink({ children, ...props }: LinkComponentProps & { children?: ReactNode }) {
      return (
        <a {...props} data-router="yes">
          {children}
        </a>
      );
    }
    render(
      <OsnovaProvider linkComponent={RouterLink}>
        <IllustratedCard href="/x" title="Passport" illustration={art} />
      </OsnovaProvider>,
    );
    expect(screen.getByRole('link', { name: 'Passport' })).toHaveAttribute('data-router', 'yes');
  });

  it('reports focus on the card, so an app can react to the focused card', async () => {
    const onFocus = vi.fn();
    render(<IllustratedCard href="/x" title="Passport" illustration={art} onFocus={onFocus} />);
    await userEvent.tab();
    expect(screen.getByRole('link', { name: 'Passport' })).toHaveFocus();
    expect(onFocus).toHaveBeenCalledOnce();
  });

  it('passes through className, style and ref', () => {
    const ref = vi.fn();
    render(
      <IllustratedCard
        data-testid="card"
        href="/x"
        title="Passport"
        illustration={art}
        className="extra"
        style={{ gridColumn: '1' }}
        ref={ref}
      />,
    );
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('extra');
    expect(card.style.gridColumn).toBe('1');
    expect(ref).toHaveBeenCalledWith(card);
  });
});
