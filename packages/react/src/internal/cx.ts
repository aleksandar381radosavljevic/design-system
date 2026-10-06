/** Joins class names, skipping empty values. The caller's `className` always goes last. */
export function cx(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
