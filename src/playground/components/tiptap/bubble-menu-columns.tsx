import { Separator } from '#app/components/ui/separator';
import { Toggle } from '#app/components/ui/toggle';
import { Tooltip, TooltipTrigger } from '#app/components/ui/tooltip';
import { Icon } from '@iconify/react';
import { BubbleMenu as BaseBubbleMenu } from '@tiptap/react';
import { useId } from 'react-aria';
import type { MenuProps } from './_types';
import { getRenderContainer } from './_util';
import { ColumnLayout } from './extensions/columns';

export const BubbleMenuColumns = ({ editor, appendTo }: MenuProps) => {
  const id = useId();

  const getReferenceClientRect = () => {
    const renderContainer = getRenderContainer(editor, 'columns');
    const rect =
      renderContainer?.getBoundingClientRect() ||
      new DOMRect(-1000, -1000, 0, 0);

    return rect;
  };

  const onColumnLeft = () => {
    editor.chain().focus().setLayout(ColumnLayout.SidebarLeft).run();
  };

  const onColumnRight = () => {
    editor.chain().focus().setLayout(ColumnLayout.SidebarRight).run();
  };

  const onColumnTwo = () => {
    editor.chain().focus().setLayout(ColumnLayout.TwoColumn).run();
  };

  const onRemoveColumns = () => {
    editor.chain().unsetColumns().run();
  };

  return (
    <BaseBubbleMenu
      pluginKey={`columnsMenu-${id}`}
      updateDelay={0}
      editor={editor}
      shouldShow={() => editor.isActive('columns')}
      tippyOptions={{
        offset: [0, 8],
        popperOptions: {
          modifiers: [{ name: 'flip', enabled: false }],
        },
        getReferenceClientRect,
        appendTo: () => {
          return appendTo?.current;
        },
        // plugins: [sticky], // from tippy.js library
        sticky: 'popper',
      }}
    >
      <div className="box-content flex h-9 items-center gap-1 overflow-y-auto rounded-md border bg-popover p-2 text-popover-foreground shadow-md outline-none">
        <TooltipTrigger delay={500}>
          <Toggle
            aria-label="Sidebar Left"
            size="sm"
            isSelected={editor.isActive('columns', {
              layout: ColumnLayout.SidebarLeft,
            })}
            onChange={onColumnLeft}
          >
            <Icon
              icon="fluent:layout-column-one-third-left-24-regular"
              className="size-4"
            />
          </Toggle>

          <Tooltip>
            <div className="flex flex-col items-center text-center">
              Sidebar Left
            </div>
          </Tooltip>
        </TooltipTrigger>

        <TooltipTrigger delay={500}>
          <Toggle
            aria-label="Two Columns"
            size="sm"
            isSelected={editor.isActive('columns', {
              layout: ColumnLayout.TwoColumn,
            })}
            onChange={onColumnTwo}
          >
            <Icon
              icon="fluent:layout-column-two-16-regular"
              className="size-4"
            />
          </Toggle>

          <Tooltip>
            <div className="flex flex-col items-center text-center">
              Two Columns
            </div>
          </Tooltip>
        </TooltipTrigger>

        <TooltipTrigger delay={500}>
          <Toggle
            aria-label="Sidebar Right"
            size="sm"
            isSelected={editor.isActive('columns', {
              layout: ColumnLayout.SidebarRight,
            })}
            onChange={onColumnRight}
          >
            <Icon
              icon="fluent:layout-column-one-third-right-16-regular"
              className="size-4"
            />
          </Toggle>

          <Tooltip>
            <div className="flex flex-col items-center text-center">
              Sidebar Right
            </div>
          </Tooltip>
        </TooltipTrigger>

        <Separator orientation="vertical" className="mx-2 h-7" />

        <TooltipTrigger delay={500}>
          <Toggle
            aria-label="Remove Columns"
            size="sm"
            onChange={onRemoveColumns}
          >
            <Icon icon="lucide:trash" className="size-4" />
          </Toggle>

          <Tooltip>
            <div className="flex flex-col items-center text-center">
              Remove Columns
            </div>
          </Tooltip>
        </TooltipTrigger>
      </div>
    </BaseBubbleMenu>
  );
};
