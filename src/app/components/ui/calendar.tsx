import { buttonVariants } from '#app/components/ui/button';
import { Icon } from '@iconify/react';
import { getLocalTimeZone, today } from '@internationalized/date';
import * as React from 'react';
import {
  Button,
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  Heading,
  RangeCalendar,
  RangeCalendarStateContext,
  type CalendarCellProps,
  type CalendarGridBodyProps,
  type CalendarGridHeaderProps,
  type CalendarGridProps,
  type CalendarHeaderCellProps,
} from 'react-aria-components';
import { twMerge } from 'tailwind-merge';

const _Calendar = Calendar;

const _RangeCalendar = RangeCalendar;

const _CalendarHeading = ({
  ...props
}: React.HTMLAttributes<HTMLHeadElement>) => (
  <header className="relative flex items-center justify-center pt-1" {...props}>
    <Heading className="text-sm font-medium" />
    <div className="flex items-center">
      <Button
        slot="next"
        className={twMerge(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 data-[hovered]:opacity-100',
          'absolute right-1 text-popover-foreground',
        )}
      >
        <Icon icon="lucide:chevron-right" className="h-4 w-4" />
      </Button>
      <Button
        slot="previous"
        className={twMerge(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 data-[hovered]:opacity-100',
          'absolute left-1 text-popover-foreground',
        )}
      >
        <Icon icon="lucide:chevron-left" className="h-4 w-4" />
      </Button>
    </div>
  </header>
);

const _CalendarGrid = ({ className, ...props }: CalendarGridProps) => (
  <CalendarGrid
    className={twMerge('mt-4 w-full border-collapse space-y-1', className)}
    {...props}
  />
);

const _CalendarGridHeader = ({
  className,
  ...props
}: CalendarGridHeaderProps) => (
  <CalendarGridHeader
    className={twMerge('[&>tr]:flex', className)}
    {...props}
  />
);

const _CalendarHeaderCell = ({
  className,
  ...props
}: CalendarHeaderCellProps) => (
  <CalendarHeaderCell
    className={twMerge(
      'w-9 rounded-md text-[0.8rem] font-normal text-muted-foreground',
      className,
    )}
    {...props}
  />
);

const _CalendarGridBody = ({ className, ...props }: CalendarGridBodyProps) => (
  <CalendarGridBody
    className={twMerge(
      '[&>tr>td]:p-0 [&>tr]:mt-2 [&>tr]:flex [&>tr]:w-full',
      '[&>tr>td:first-child>div]:rounded-l-md [&>tr>td:last-child>div]:rounded-r-md',
      className,
    )}
    {...props}
  />
);

const _CalendarCell = ({ className, date, ...props }: CalendarCellProps) => {
  const isRange = Boolean(React.useContext(RangeCalendarStateContext));
  return (
    <CalendarCell
      className={(values) =>
        twMerge(
          'inline-flex h-9 w-9 items-center justify-center whitespace-nowrap rounded-md  p-0 text-sm font-normal ring-offset-background transition-colors data-[disabled]:pointer-events-none data-[hovered]:bg-accent data-[hovered]:text-accent-foreground data-[disabled]:opacity-50 data-[selected]:opacity-100',
          date.compare(today(getLocalTimeZone())) === 0 &&
            'bg-accent text-accent-foreground',
          values.isDisabled && 'text-muted-foreground opacity-50',
          values.isFocusVisible &&
            values.isFocused &&
            'outline-none ring-2 ring-ring ring-offset-2',
          values.isSelected &&
            isRange &&
            'rounded-none bg-accent text-accent-foreground',
          ((values.isSelected && !isRange) ||
            values.isSelectionStart ||
            values.isSelectionEnd) &&
            'rounded-md bg-primary text-primary-foreground data-[focused]:bg-primary data-[hovered]:bg-primary data-[focused]:text-primary-foreground data-[hovered]:text-primary-foreground',
          values.isOutsideMonth &&
            'text-muted-foreground opacity-50 data-[selected]:bg-accent/50 data-[selected]:text-muted-foreground data-[selected]:opacity-30',
          typeof className === 'function' ? className(values) : className,
        )
      }
      date={date}
      {...props}
    />
  );
};

export {
  _Calendar as Calendar,
  _CalendarCell as CalendarCell,
  _CalendarGrid as CalendarGrid,
  _CalendarGridBody as CalendarGridBody,
  _CalendarGridHeader as CalendarGridHeader,
  _CalendarHeaderCell as CalendarHeaderCell,
  _CalendarHeading as CalendarHeading,
  _RangeCalendar as RangeCalendar,
};
