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

export function ToolbarMenuList({ editor }: { editor: Editor }) {
  return (
    <MenuTrigger>
      <ToolbarMenuButton
        tooltip="List"
        isSelected={
          editor.isActive('bulletList') || editor.isActive('orderedList')
        }
      >
        <Icon icon="lucide:list" className="size-5" />
      </ToolbarMenuButton>

      <MenuPopover placement="bottom start">
        <Menu className="w-56">
          <MenuSection>
            <MenuHeader separator>List</MenuHeader>
            <MenuItem
              aria-label="Ordered list"
              className={twMerge(menuItemClasses)}
              isDisabled={
                !editor.can().chain().toggleOrderedList().run() ||
                editor.isActive('orderedList')
              }
              onAction={() => editor.chain().toggleOrderedList().run()}
            >
              <span className="grow">Ordered list</span>
              <ShortcutKey keys={['mod', 'shift', '7']} />
            </MenuItem>

            <MenuItem
              aria-label="Bullet list"
              className={twMerge(
                menuItemClasses,
                editor.isActive('bulletList') && menuItemActiveClasses,
              )}
              isDisabled={
                !editor.can().chain().focus().toggleBulletList().run() ||
                editor.isActive('bulletList')
              }
              onAction={() => editor.chain().focus().toggleBulletList().run()}
            >
              <span className="grow">Bullet list</span>
              <ShortcutKey keys={['mod', 'shift', '8']} />
            </MenuItem>

            <MenuItem
              aria-label="Task list"
              className={twMerge(menuItemClasses)}
              isDisabled={
                !editor.can().chain().focus().toggleTaskList().run() ||
                editor.isActive('taskList')
              }
              onAction={() => editor.chain().focus().toggleTaskList().run()}
            >
              <span className="grow">Task list</span>
              <ShortcutKey keys={['mod', 'shift', '9']} />
            </MenuItem>
          </MenuSection>
        </Menu>
      </MenuPopover>
    </MenuTrigger>
  );
}
