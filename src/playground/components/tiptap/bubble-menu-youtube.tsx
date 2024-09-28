import { Button } from '#app/components/ui/button';
import { Separator } from '#app/components/ui/separator';
import { Tooltip, TooltipTrigger } from '#app/components/ui/tooltip';
import { Icon } from '@iconify/react';
import { BubbleMenu as BaseBubbleMenu } from '@tiptap/react';
import React from 'react';
import type { MenuProps } from './_types';
import { MenuYoutubeContent } from './toolbar-menu-youtube';

type SetYoutubeVideoOptions = {
  src: string;
  width?: number;
  height?: number;
  start?: number;
};

export const BubbleMenuYoutube = ({ editor, appendTo }: MenuProps) => {
  const [showEdit, setShowEdit] = React.useState(false);

  const { src: link } = editor.getAttributes('youtube');

  const onSetYoutube = (opts: SetYoutubeVideoOptions) => {
    editor.chain().setYoutubeVideo(opts).run();
    setShowEdit(false);
  };

  const onUnsetYoutube = () => {
    editor.commands.deleteSelection();
    setShowEdit(false);
  };

  const onShowEdit = () => {
    setShowEdit(true);
  };

  return (
    <BaseBubbleMenu
      pluginKey="youtubeMenu"
      updateDelay={0}
      editor={editor}
      shouldShow={() => editor.isActive('youtube')}
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
          <MenuYoutubeContent
            initialUrl={link}
            onSetYoutube={(_url) => onSetYoutube({ src: _url })}
          />
        </div>
      ) : (
        <div className="box-content flex h-9 items-center gap-1 rounded-md border bg-popover p-2 text-popover-foreground shadow-md outline-none">
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
            <Button size="sm" variant="ghost" onPress={onUnsetYoutube}>
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
