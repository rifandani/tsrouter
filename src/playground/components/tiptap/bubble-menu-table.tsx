import { Button } from '#app/components/ui/button';
import { Tooltip, TooltipTrigger } from '#app/components/ui/tooltip';
import { Icon } from '@iconify/react';
import { BubbleMenu as BaseBubbleMenu } from '@tiptap/react';
import type { MenuProps, ShouldShowProps } from './_types';
import { isColumnGripSelected, isRowGripSelected } from './_util';

export const BubbleMenuTableRow = ({ editor, appendTo }: MenuProps) => {
  const shouldShow = ({ view, state, from }: ShouldShowProps) => {
    if (!state || !from) {
      return false;
    }

    return isRowGripSelected({ editor, view, state, from });
  };

  const onAddRowBefore = () => {
    editor.chain().focus().addRowBefore().run();
  };

  const onAddRowAfter = () => {
    editor.chain().focus().addRowAfter().run();
  };

  const onDeleteRow = () => {
    editor.chain().focus().deleteRow().run();
  };

  return (
    <BaseBubbleMenu
      pluginKey="tableRowMenu"
      updateDelay={0}
      editor={editor}
      shouldShow={shouldShow}
      tippyOptions={{
        placement: 'auto-start',
        offset: [0, 15],
        popperOptions: {
          modifiers: [{ name: 'flip', enabled: false }],
        },
        appendTo: () => {
          return appendTo?.current;
        },
      }}
    >
      <div className="box-content flex h-9 items-center gap-1 rounded-md border bg-popover p-2 text-popover-foreground shadow-md outline-none">
        <TooltipTrigger delay={500}>
          <Button size="sm" variant="ghost" onPress={onAddRowBefore}>
            <Icon icon="lucide:arrow-up-to-line" className="size-4" />
          </Button>

          <Tooltip>
            <div className="flex flex-col items-center text-center">
              Add row before
            </div>
          </Tooltip>
        </TooltipTrigger>

        <TooltipTrigger delay={500}>
          <Button size="sm" variant="ghost" onPress={onAddRowAfter}>
            <Icon icon="lucide:arrow-down-to-line" className="size-4" />
          </Button>

          <Tooltip>
            <div className="flex flex-col items-center text-center">
              Add row after
            </div>
          </Tooltip>
        </TooltipTrigger>

        <TooltipTrigger delay={500}>
          <Button size="sm" variant="ghost" onPress={onDeleteRow}>
            <Icon icon="lucide:trash-2" className="size-4" />
          </Button>

          <Tooltip>
            <div className="flex flex-col items-center text-center">
              Delete row
            </div>
          </Tooltip>
        </TooltipTrigger>
      </div>
    </BaseBubbleMenu>
  );
};

export const BubbleMenuTableColumn = ({ editor, appendTo }: MenuProps) => {
  const shouldShow = ({ view, state, from }: ShouldShowProps) => {
    if (!state) {
      return false;
    }

    return isColumnGripSelected({ editor, view, state, from: from || 0 });
  };

  const onAddColumnBefore = () => {
    editor.chain().focus().addColumnBefore().run();
  };

  const onAddColumnAfter = () => {
    editor.chain().focus().addColumnAfter().run();
  };

  const onDeleteColumn = () => {
    editor.chain().focus().deleteColumn().run();
  };

  return (
    <BaseBubbleMenu
      pluginKey="tableRowMenu"
      updateDelay={0}
      editor={editor}
      shouldShow={shouldShow}
      tippyOptions={{
        placement: 'top',
        offset: [0, 15],
        popperOptions: {
          modifiers: [{ name: 'flip', enabled: false }],
        },
        appendTo: () => {
          return appendTo?.current;
        },
      }}
    >
      <div className="box-content flex h-9 items-center gap-1 rounded-md border bg-popover p-2 text-popover-foreground shadow-md outline-none">
        <TooltipTrigger delay={500}>
          <Button size="sm" variant="ghost" onPress={onAddColumnBefore}>
            <Icon icon="lucide:arrow-left-to-line" className="size-4" />
          </Button>

          <Tooltip>
            <div className="flex flex-col items-center text-center">
              Add column before
            </div>
          </Tooltip>
        </TooltipTrigger>

        <TooltipTrigger delay={500}>
          <Button size="sm" variant="ghost" onPress={onAddColumnAfter}>
            <Icon icon="lucide:arrow-right-to-line" className="size-4" />
          </Button>

          <Tooltip>
            <div className="flex flex-col items-center text-center">
              Add column after
            </div>
          </Tooltip>
        </TooltipTrigger>

        <TooltipTrigger delay={500}>
          <Button size="sm" variant="ghost" onPress={onDeleteColumn}>
            <Icon icon="lucide:trash-2" className="size-4" />
          </Button>

          <Tooltip>
            <div className="flex flex-col items-center text-center">
              Delete column
            </div>
          </Tooltip>
        </TooltipTrigger>
      </div>
    </BaseBubbleMenu>
  );
};
