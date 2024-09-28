import { Button } from '#app/components/ui/button';
import { Separator } from '#app/components/ui/separator';
import { Tooltip, TooltipTrigger } from '#app/components/ui/tooltip';
import { Icon } from '@iconify/react';
import { BubbleMenu as BaseBubbleMenu } from '@tiptap/react';
import React from 'react';
import type { MenuProps } from './_types';
import { MenuLinkContent } from './toolbar-menu-link';

export const BubbleMenuLink = ({ editor, appendTo }: MenuProps) => {
  const [showEdit, setShowEdit] = React.useState(false);

  const { href: link, target } = editor.getAttributes('link');

  const onSetLink = (url: string, openInNewTab?: boolean) => {
    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url, target: openInNewTab ? '_blank' : '' })
      .run();
    setShowEdit(false);
  };

  const onUnsetLink = () => {
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
    setShowEdit(false);
  };

  const onShowEdit = () => {
    setShowEdit(true);
  };

  return (
    <BaseBubbleMenu
      pluginKey="linkMenu"
      updateDelay={0}
      editor={editor}
      shouldShow={() => editor.isActive('link')}
      tippyOptions={{
        popperOptions: {
          modifiers: [{ name: 'flip', enabled: false }],
        },
        appendTo: () => {
          return appendTo?.current;
        },
        onHidden: () => {
          setShowEdit(false);
        },
      }}
    >
      {showEdit ? (
        <div className="box-content rounded-md border bg-popover p-2 text-popover-foreground shadow-md outline-none">
          <MenuLinkContent
            initialUrl={link}
            initialOpenInNewTab={target === '_blank'}
            onSetLink={onSetLink}
          />
        </div>
      ) : (
        <div className="box-content flex h-9 items-center gap-1 overflow-y-auto rounded-md border bg-popover p-2 text-popover-foreground shadow-md outline-none">
          <a
            className="text-sm underline break-all"
            target="_blank"
            rel="noopener noreferrer"
            href={link}
          >
            {link}
          </a>

          <Separator orientation="vertical" className="mx-2 h-7" />

          <TooltipTrigger delay={500}>
            <Button size="sm" variant="ghost" onPress={onShowEdit}>
              <Icon icon="lucide:pen" className="size-4" />
            </Button>

            <Tooltip>
              <div className="flex flex-col items-center text-center">
                Edit link
              </div>
            </Tooltip>
          </TooltipTrigger>

          <TooltipTrigger delay={500}>
            <Button size="sm" variant="ghost" onPress={onUnsetLink}>
              <Icon icon="lucide:trash-2" className="size-4" />
            </Button>

            <Tooltip>
              <div className="flex flex-col items-center text-center">
                Remove link
              </div>
            </Tooltip>
          </TooltipTrigger>
        </div>
      )}
    </BaseBubbleMenu>
  );
};
