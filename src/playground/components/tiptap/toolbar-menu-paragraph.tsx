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

export function ToolbarMenuParagraph({ editor }: { editor: Editor }) {
  return (
    <MenuTrigger>
      <ToolbarMenuButton
        tooltip="Hierarchy"
        isSelected={editor.isActive('paragraph') || editor.isActive('heading')}
        isDisabled={editor.isActive('code') || editor.isActive('codeBlock')}
      >
        <Icon icon="lucide:pilcrow" className="size-5" />
        <Icon icon="lucide:chevron-down" className="size-3" />
      </ToolbarMenuButton>

      <MenuPopover placement="bottom start">
        <Menu className="w-56">
          <MenuSection>
            <MenuHeader separator>Hierarchy</MenuHeader>
            <MenuItem
              aria-label="Paragraph"
              className={twMerge(
                menuItemClasses,
                editor.isActive('paragraph') && menuItemActiveClasses,
              )}
              onAction={() => editor.chain().setParagraph().run()}
            >
              <span className="flex gap-2 items-center">
                <Icon icon="lucide:pilcrow" className="size-4" />
                <p>Paragraph</p>
              </span>
              <ShortcutKey keys={['mod', 'alt', '0']} />
            </MenuItem>
            <MenuItem
              aria-label="Heading 1"
              className={twMerge(
                menuItemClasses,
                editor.isActive('heading', { level: 1 }) &&
                  menuItemActiveClasses,
              )}
              onAction={() => editor.chain().setHeading({ level: 1 }).run()}
            >
              <span className="flex gap-2 items-center">
                <Icon icon="lucide:heading-1" className="size-4" />
                <h1 className="m-0">Heading 1</h1>
              </span>
              <ShortcutKey keys={['mod', 'alt', '1']} />
            </MenuItem>
            <MenuItem
              aria-label="Heading 2"
              className={twMerge(
                menuItemClasses,
                editor.isActive('heading', { level: 2 }) &&
                  menuItemActiveClasses,
              )}
              onAction={() => editor.chain().setHeading({ level: 2 }).run()}
            >
              <span className="flex gap-2 items-center">
                <Icon icon="lucide:heading-2" className="size-4" />
                <h2 className="m-0">Heading 2</h2>
              </span>
              <ShortcutKey keys={['mod', 'alt', '2']} />
            </MenuItem>
            <MenuItem
              aria-label="Heading 3"
              className={twMerge(
                menuItemClasses,
                editor.isActive('heading', { level: 3 }) &&
                  menuItemActiveClasses,
              )}
              onAction={() => editor.chain().setHeading({ level: 3 }).run()}
            >
              <span className="flex gap-2 items-center">
                <Icon icon="lucide:heading-3" className="size-4" />
                <h3 className="m-0">Heading 3</h3>
              </span>
              <ShortcutKey keys={['mod', 'alt', '3']} />
            </MenuItem>
            <MenuItem
              aria-label="Heading 4"
              className={twMerge(
                menuItemClasses,
                editor.isActive('heading', { level: 4 }) &&
                  menuItemActiveClasses,
              )}
              onAction={() => editor.chain().setHeading({ level: 4 }).run()}
            >
              <span className="flex gap-2 items-center">
                <Icon icon="lucide:heading-4" className="size-4" />
                <h4 className="m-0">Heading 4</h4>
              </span>
              <ShortcutKey keys={['mod', 'alt', '4']} />
            </MenuItem>
            <MenuItem
              aria-label="Heading 5"
              className={twMerge(
                menuItemClasses,
                editor.isActive('heading', { level: 5 }) &&
                  menuItemActiveClasses,
              )}
              onAction={() => editor.chain().setHeading({ level: 5 }).run()}
            >
              <span className="flex gap-2 items-center">
                <Icon icon="lucide:heading-5" className="size-4" />
                <h5 className="m-0">Heading 5</h5>
              </span>
              <ShortcutKey keys={['mod', 'alt', '5']} />
            </MenuItem>
            <MenuItem
              aria-label="Heading 6"
              className={twMerge(
                menuItemClasses,
                editor.isActive('heading', { level: 6 }) &&
                  menuItemActiveClasses,
              )}
              onAction={() => editor.chain().setHeading({ level: 6 }).run()}
            >
              <span className="flex gap-2 items-center">
                <Icon icon="lucide:heading-6" className="size-4" />
                <h6 className="m-0">Heading 6</h6>
              </span>
              <ShortcutKey keys={['mod', 'alt', '6']} />
            </MenuItem>
          </MenuSection>
        </Menu>
      </MenuPopover>
    </MenuTrigger>
  );
}
