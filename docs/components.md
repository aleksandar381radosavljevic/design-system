# Components

Usage examples for `@aleksandar381radosavljevic/osnova-react`. The API is described and justified in [`component-api-proposal.md`](component-api-proposal.md) (approved 2026-10-06) and [ADR 0004](decisions/0004-component-api-conventions.md). Every component renders a native element and passes through `className`, `ref`, `aria-*`, `data-*` and event props. Osnova renders no text of its own: every label below is the app's.

## Setup: OsnovaProvider and icons

Register the icons the app uses in one file, and render the provider once from a client component. In the Next.js App Router the provider must live in a `'use client'` file, because a server layout cannot pass components (icons, `Link`) as props.

```tsx
// app/icons.ts: every icon the app renders by name. One line per icon.
import { ChevronRight, Inbox, Plus, Search } from 'lucide-react';
import type { IconRegistry } from '@aleksandar381radosavljevic/osnova-react';

export const icons: IconRegistry = {
  'chevron-right': ChevronRight,
  inbox: Inbox,
  plus: Plus,
  search: Search,
};
```

```tsx
// app/providers.tsx
'use client';
import Link from 'next/link';
import { OsnovaProvider } from '@aleksandar381radosavljevic/osnova-react';
import { icons } from './icons';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <OsnovaProvider linkComponent={Link} icons={icons}>
      {children}
    </OsnovaProvider>
  );
}
```

```tsx
// app/layout.tsx
import '@aleksandar381radosavljevic/osnova-tokens/tokens.css';
import '@aleksandar381radosavljevic/osnova-react/styles.css';
import './theme.css';
import { Providers } from './providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sr">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

Osnova always includes the icons it renders itself: `check`, `x`, `info`, `triangle-alert`, `loader-circle` and `circle-help`. Without a provider, links render as `<a>` and only those icons are available.

## Icon

```tsx
<Icon name="chevron-right" />                       {/* decorative: aria-hidden */}
<Icon name="search" size={24} label="Pretraga" />   {/* meaningful: role="img" */}
<Icon name={task.iconName as IconName} />           {/* from data; unknown names render circle-help */}
```

## Button

```tsx
<Button onClick={save}>Sačuvaj</Button>
<Button type="submit" loading={isSaving}>Pošalji</Button>
<Button variant="secondary" iconStart="plus" href="/zadaci/novi">Novi zadatak</Button>
<Button variant="ghost" iconStart="x" aria-label="Zatvori" onClick={close} />
<Button variant="danger" size="lg" disabled>Obriši</Button>
```

`type` defaults to `"button"`. `href` renders the provider's link component; a link cannot be `disabled` (type error).

## Badge

```tsx
<Badge>Nacrt</Badge>
<Badge tone="success" icon="check">Završeno</Badge>
<Badge tone={statusTone[task.status]}>{statusLabel[task.status]}</Badge>
```

## Card and CardLink

```tsx
<ul>
  {tasks.map((task) => (
    <Card as="li" key={task.id}>
      <h3>
        <CardLink href={`/zadaci/${task.id}`}>{task.title}</CardLink>
      </h3>
      <p>{task.due}</p>
      <Button variant="ghost" onClick={() => archive(task.id)}>Arhiviraj</Button>
    </Card>
  ))}
</ul>
```

The whole card is clickable through `CardLink`, which keeps the link name short; the `Button` stays separately clickable and focusable.

## Input

```tsx
<Input label="Email" type="email" autoComplete="email" required />
<Input
  label="Telefon"
  hint="Sa pozivnim brojem, npr. +381"
  error={errors.phone}
  inputMode="tel"
/>
<Input label="Pretraga" hideLabel type="search" iconStart="search" />
```

`className` goes on the outer wrapper; `ref` and all other props go on the `<input>`.

## TextArea

```tsx
<TextArea label="Poruka" hideLabel rows={1} autoGrow={6} value={draft} onChange={(e) => setDraft(e.target.value)} />
<TextArea label="Napomena" hint="Najviše 500 znakova" maxLength={500} error={errors.note} />
```

## Banner

```tsx
<Banner tone="warning" title="Rok ističe sutra">Pasoš treba predati do petka.</Banner>

{/* Appears after a user action, so it is announced. */}
<Banner tone="success" live="polite" onDismiss={hide} dismissLabel="Zatvori obaveštenje">
  Sačuvano.
</Banner>

<Banner
  tone="error"
  live="assertive"
  title="Slanje nije uspelo"
  action={<Button variant="ghost" onClick={retry}>Pokušaj ponovo</Button>}
>
  Proverite internet vezu.
</Banner>
```

## Skeleton and SkeletonGroup

```tsx
<SkeletonGroup label="Učitavanje zadataka…">
  <Skeleton shape="circle" width="2.5rem" />
  <Skeleton width="60%" />
  <Skeleton />
  <Skeleton shape="block" height="6rem" />
</SkeletonGroup>
```

Each Skeleton is hidden from assistive technology; the group's label is announced once.

## EmptyState

```tsx
<EmptyState
  icon="inbox"
  title="Još nema zadataka"
  description="Zadaci koje dodate pojaviće se ovde."
  action={<Button variant="secondary" iconStart="plus" href="/zadaci/novi">Dodaj zadatak</Button>}
/>
<EmptyState headingLevel={3} title="Nema rezultata" action={<a href="/zadaci">Prikaži sve</a>} />
```
