import { Button } from '#app/components/ui/button';
import { Input } from '#app/components/ui/input';
import { Popover, PopoverTrigger } from '#app/components/ui/popover';
import { Icon } from '@iconify/react';
import React from 'react';
import { ToolbarMenuButton } from './toolbar-menu-button';

type Props = {
  onSetYoutube: (url: string) => void;
  initialUrl?: string;
};

export function MenuYoutubeContent({ onSetYoutube, initialUrl = '' }: Props) {
  const [url, setUrl] = React.useState(initialUrl);

  const isValidUrl = /^(\S+):(\/\/)?\S+$/.test(url);

  return (
    <>
      <form
        onSubmit={(evt) => {
          evt.preventDefault();

          if (isValidUrl) {
            onSetYoutube(url);
          }
        }}
        className="flex items-center gap-2"
      >
        <label className="flex items-center gap-2 rounded-lg cursor-text">
          <Icon icon="lucide:film" className="flex-none" />
          <Input
            type="url"
            className="flex-1 bg-transparent outline-none min-w-[12rem] text-sm"
            placeholder="Enter Youtube URL"
            value={url}
            onChange={(evt) => setUrl(evt.target.value)}
          />
        </label>
        <Button size="sm" type="submit" isDisabled={!isValidUrl}>
          Set Link
        </Button>
      </form>
    </>
  );
}

export function ToolbarMenuYoutube({ onSetYoutube, initialUrl = '' }: Props) {
  return (
    <PopoverTrigger>
      <ToolbarMenuButton tooltip="Youtube">
        <Icon icon="lucide:film" className="size-5" />
      </ToolbarMenuButton>

      <Popover placement="bottom start" className="w-fit">
        <MenuYoutubeContent
          onSetYoutube={onSetYoutube}
          initialUrl={initialUrl}
        />
      </Popover>
    </PopoverTrigger>
  );
}
