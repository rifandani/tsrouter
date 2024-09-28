import { Button } from '#app/components/ui/button';
import { Input } from '#app/components/ui/input';
import { Popover, PopoverTrigger } from '#app/components/ui/popover';
import { Switch } from '#app/components/ui/switch';
import { Icon } from '@iconify/react';
import React from 'react';
import { ToolbarMenuButton } from './toolbar-menu-button';

type Props = {
  onSetLink: (url: string, openInNewTab?: boolean) => void;
  initialUrl?: string;
  initialOpenInNewTab?: boolean;
};

export function MenuLinkContent({
  onSetLink,
  initialUrl = '',
  initialOpenInNewTab = false,
}: Props) {
  const [url, setUrl] = React.useState(initialUrl);
  const [openInNewTab, setOpenInNewTab] = React.useState(initialOpenInNewTab);

  const isValidUrl = /^(\S+):(\/\/)?\S+$/.test(url);

  return (
    <>
      <form
        onSubmit={(evt) => {
          evt.preventDefault();

          if (isValidUrl) {
            onSetLink(url, openInNewTab);
          }
        }}
        className="flex items-center gap-2"
      >
        <label className="flex items-center gap-2 rounded-lg cursor-text">
          <Icon icon="lucide:link" className="flex-none" />
          <Input
            type="url"
            className="flex-1 bg-transparent outline-none min-w-[12rem] text-sm"
            placeholder="Enter URL"
            value={url}
            onChange={(evt) => setUrl(evt.target.value)}
          />
        </label>
        <Button size="sm" type="submit" isDisabled={!isValidUrl}>
          Set Link
        </Button>
      </form>
      <div className="mt-3">
        <label className="flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer select-none text-neutral-500 dark:text-neutral-400">
          Open in new tab
          <Switch isSelected={openInNewTab} onChange={setOpenInNewTab} />
        </label>
      </div>
    </>
  );
}

export function ToolbarMenuLink({
  onSetLink,
  initialUrl = '',
  initialOpenInNewTab = false,
}: Props) {
  return (
    <PopoverTrigger>
      <ToolbarMenuButton tooltip="Link">
        <Icon icon="lucide:link" className="size-5" />
      </ToolbarMenuButton>

      <Popover placement="bottom start" className="w-fit">
        <MenuLinkContent
          onSetLink={onSetLink}
          initialUrl={initialUrl}
          initialOpenInNewTab={initialOpenInNewTab}
        />
      </Popover>
    </PopoverTrigger>
  );
}
