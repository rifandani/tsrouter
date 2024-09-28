import {
  Menu,
  MenuHeader,
  MenuItem,
  MenuPopover,
  MenuSection,
  MenuTrigger,
} from '#app/components/ui/menu';
import { Icon } from '@iconify/react';
import type { Editor } from '@tiptap/core';
import { twMerge } from 'tailwind-merge';
import { menuItemActiveClasses, menuItemClasses } from './_util';
import { ShortcutKey } from './shortcut-key';
import { ToolbarMenuButton } from './toolbar-menu-button';

export function ToolbarMenuAlign({ editor }: { editor: Editor }) {
  return (
    <MenuTrigger>
      <ToolbarMenuButton
        tooltip="Align"
        isSelected={editor.isActive('textAlign')}
      >
        <Icon icon="lucide:align-left" className="size-5 mr-1" />
        <Icon icon="lucide:chevron-down" className="size-3" />
      </ToolbarMenuButton>

      <MenuPopover placement="bottom start">
        <Menu className="w-56">
          <MenuSection>
            <MenuHeader separator>Align</MenuHeader>
            <MenuItem
              aria-label="Align Left ⌘ ⇧ L"
              className={twMerge(
                menuItemClasses,
                editor.isActive({ textAlign: 'left' }) && menuItemActiveClasses,
              )}
              onAction={() => editor.chain().setTextAlign('left').run()}
            >
              <span className="flex gap-2 items-center">
                <Icon icon="lucide:align-left" className="size-4" />
                <p>Left</p>
              </span>
              <ShortcutKey keys={['mod', 'shift', 'L']} />
            </MenuItem>

            <MenuItem
              aria-label="Align Center ⌘ ⇧ E"
              className={twMerge(
                menuItemClasses,
                editor.isActive({ textAlign: 'center' }) &&
                  menuItemActiveClasses,
              )}
              onAction={() => {
                editor.chain().setTextAlign('center').run();
              }}
            >
              <span className="flex gap-2 items-center">
                <Icon icon="lucide:align-center" className="size-4" />
                <p>Center</p>
              </span>
              <ShortcutKey keys={['mod', 'shift', 'E']} />
            </MenuItem>

            <MenuItem
              aria-label="Align Right ⌘ ⇧ E"
              className={twMerge(
                menuItemClasses,
                editor.isActive({ textAlign: 'right' }) &&
                  menuItemActiveClasses,
              )}
              onAction={() => editor.chain().setTextAlign('right').run()}
            >
              <span className="flex gap-2 items-center">
                <Icon icon="lucide:align-right" className="size-4" />
                <p>Right</p>
              </span>
              <ShortcutKey keys={['mod', 'shift', 'R']} />
            </MenuItem>

            <MenuItem
              aria-label="Align Justify ⌘ ⇧ E"
              className={twMerge(
                menuItemClasses,
                editor.isActive({ textAlign: 'justify' }) &&
                  menuItemActiveClasses,
              )}
              onAction={() => editor.chain().setTextAlign('justify').run()}
            >
              <span className="flex gap-2 items-center">
                <Icon icon="lucide:align-justify" className="size-4" />
                <p>Justify</p>
              </span>
              <ShortcutKey keys={['mod', 'shift', 'J']} />
            </MenuItem>
          </MenuSection>
        </Menu>
      </MenuPopover>
    </MenuTrigger>
  );
}
