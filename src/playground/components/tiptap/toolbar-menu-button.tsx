import { Toggle } from '#app/components/ui/toggle';
import { Tooltip, TooltipTrigger } from '#app/components/ui/tooltip';
import type React from 'react';

interface ToolbarMenuButtonProps
  extends React.ComponentPropsWithRef<typeof Toggle> {
  tooltip: string;
  tooltipOptions?: React.ComponentPropsWithoutRef<typeof Tooltip>;
}

export function ToolbarMenuButton({
  children,
  tooltip,
  tooltipOptions,
  ...props
}: ToolbarMenuButtonProps) {
  return (
    <TooltipTrigger delay={500}>
      <Toggle aria-label="Toggle menu" size="sm" {...props}>
        {children}
      </Toggle>

      <Tooltip {...tooltipOptions}>
        <div className="flex flex-col items-center text-center">{tooltip}</div>
      </Tooltip>
    </TooltipTrigger>
  );
}
