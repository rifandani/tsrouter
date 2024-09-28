import { getShortcutKeys } from '#app/utils/platform.util';
import { twMerge } from 'tailwind-merge';

interface ShortcutKeyProps extends React.HTMLAttributes<HTMLSpanElement> {
  keys: string[];
  withBg?: boolean;
}

export const ShortcutKey = ({
  className,
  keys,
  withBg,
  ...props
}: ShortcutKeyProps) => {
  return (
    <span
      className={twMerge('text-xs tracking-widest opacity-60', className)}
      {...props}
    >
      <span
        className={twMerge(
          'ml-4',
          withBg && 'self-end rounded bg-accent p-1 leading-3',
        )}
      >
        {getShortcutKeys(keys)}
      </span>
    </span>
  );
};
