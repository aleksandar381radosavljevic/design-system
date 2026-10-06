import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../Button/Button';
import { Card, CardLink } from './Card';

describe('Card', () => {
  it('renders a div by default and the requested element with as', () => {
    render(
      <>
        <Card data-testid="plain">Plain</Card>
        <Card as="article" aria-label="Task">
          Task
        </Card>
      </>,
    );
    expect(screen.getByTestId('plain').tagName).toBe('DIV');
    expect(screen.getByRole('article', { name: 'Task' })).toBeInTheDocument();
  });

  it('renders as a list item inside a list', () => {
    render(
      <ul>
        <Card as="li">One</Card>
      </ul>,
    );
    expect(screen.getByRole('listitem')).toHaveTextContent('One');
  });

  it('names its CardLink by the link text only, not the whole card', () => {
    render(
      <Card as="article">
        <h3>
          <CardLink href="/tasks/1">Passport renewal</CardLink>
        </h3>
        <p>Due Friday</p>
      </Card>,
    );
    const link = screen.getByRole('link', { name: 'Passport renewal' });
    expect(link).toHaveAttribute('href', '/tasks/1');
  });

  it('keeps other controls in the card separately reachable by keyboard', async () => {
    const onArchive = vi.fn();
    render(
      <Card>
        <CardLink href="/tasks/1">Passport renewal</CardLink>
        <Button variant="ghost" onClick={onArchive}>
          Archive
        </Button>
      </Card>,
    );
    await userEvent.tab();
    expect(screen.getByRole('link', { name: 'Passport renewal' })).toHaveFocus();
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'Archive' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(onArchive).toHaveBeenCalledOnce();
  });

  it('is not focusable itself', async () => {
    render(<Card>Static content</Card>);
    await userEvent.tab();
    expect(document.body).toHaveFocus();
  });

  it('passes through className and ref on Card and CardLink', () => {
    const cardRef = vi.fn();
    const linkRef = vi.fn();
    render(
      <Card as="section" aria-label="Summary" className="card-extra" ref={cardRef}>
        <CardLink href="/x" className="link-extra" ref={linkRef}>
          Open
        </CardLink>
      </Card>,
    );
    const card = screen.getByRole('region', { name: 'Summary' });
    const link = screen.getByRole('link', { name: 'Open' });
    expect(card).toHaveClass('card-extra');
    expect(link).toHaveClass('link-extra');
    expect(cardRef).toHaveBeenCalledWith(card);
    expect(linkRef).toHaveBeenCalledWith(link);
  });
});
