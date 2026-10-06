import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from '../Button/Button';
import { Card, CardLink } from '../Card/Card';
import { OsnovaProvider } from './OsnovaProvider';
import type { LinkComponentProps } from './OsnovaContext';

function RouterLink({ href, ...rest }: LinkComponentProps) {
  return <a href={href} data-router-link="" {...rest} />;
}

describe('OsnovaProvider', () => {
  it('renders plain <a> links without a provider', () => {
    render(<Button href="/tasks">Tasks</Button>);
    const link = screen.getByRole('link', { name: 'Tasks' });
    expect(link).toHaveAttribute('href', '/tasks');
    expect(link).not.toHaveAttribute('data-router-link');
  });

  it('renders Button and CardLink links through linkComponent', () => {
    render(
      <OsnovaProvider linkComponent={RouterLink}>
        <Button href="/tasks">Tasks</Button>
        <Card>
          <CardLink href="/tasks/1">Passport renewal</CardLink>
        </Card>
      </OsnovaProvider>,
    );
    expect(screen.getByRole('link', { name: 'Tasks' })).toHaveAttribute('data-router-link');
    expect(screen.getByRole('link', { name: 'Passport renewal' })).toHaveAttribute('data-router-link');
  });

  it('keeps Osnova icons available when the app registers its own', () => {
    render(
      <OsnovaProvider icons={{}}>
        <Button loading>Save</Button>
      </OsnovaProvider>,
    );
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button.querySelector('.lucide-loader-circle')).toBeInTheDocument();
  });
});
