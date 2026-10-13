import { useEffect, useId, useRef, type ComponentPropsWithRef, type MouseEvent, type ReactNode, type SyntheticEvent } from 'react';
import { cx } from '../internal/cx';
import styles from './Dialog.module.css';

export interface DialogProps extends Omit<ComponentPropsWithRef<'dialog'>, 'open' | 'title' | 'children' | 'onClose'> {
  /** Whether the dialog is shown. The app owns this state. */
  open: boolean;
  /** Called on Escape, on a backdrop click (with `closeOnBackdrop`) and on any other close request. */
  onClose: () => void;
  /** Heading, and the dialog's accessible name. */
  title: string;
  /** Text under the title, linked with `aria-describedby`. */
  description?: ReactNode;
  /** Footer content, usually Osnova Buttons. Put `autoFocus` on the safe choice. */
  actions?: ReactNode;
  /** Extra body content between the description and the actions. */
  children?: ReactNode;
  /** Close when the backdrop is clicked. Off by default, so a stray tap is never an answer. @default false */
  closeOnBackdrop?: boolean;
}

/**
 * Modal dialog on the native `<dialog>` element. `showModal()` gives the
 * focus trap, Escape, the inert page behind it and focus return on close.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  actions,
  children,
  closeOnBackdrop = false,
  className,
  ref,
  onCancel,
  onClick,
  ...rest
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();
  const hasDescription = description !== undefined && description !== null && description !== false;

  // Syncing `open` with showModal()/close() is syncing with a DOM API.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Escape: keep the dialog open until the app changes `open`, so state stays in one place.
  function handleCancel(event: SyntheticEvent<HTMLDialogElement>) {
    onCancel?.(event);
    event.preventDefault();
    onClose();
  }

  // A click whose target is the <dialog> itself landed on the backdrop, because the content fills the box.
  function handleClick(event: MouseEvent<HTMLDialogElement>) {
    onClick?.(event);
    if (closeOnBackdrop && event.target === event.currentTarget) onClose();
  }

  function setRefs(node: HTMLDialogElement | null) {
    dialogRef.current = node;
    if (typeof ref === 'function') return ref(node);
    if (ref) ref.current = node;
  }

  return (
    <dialog
      {...rest}
      ref={setRefs}
      aria-labelledby={titleId}
      aria-describedby={hasDescription ? descriptionId : undefined}
      className={cx(styles.dialog, className)}
      onCancel={handleCancel}
      onClick={handleClick}
      onClose={() => {
        if (open) onClose();
      }}
    >
      <div className={styles.content}>
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
        {hasDescription && (
          <div id={descriptionId} className={styles.description}>
            {description}
          </div>
        )}
        {children}
        {actions !== undefined && <div className={styles.actions}>{actions}</div>}
      </div>
    </dialog>
  );
}
