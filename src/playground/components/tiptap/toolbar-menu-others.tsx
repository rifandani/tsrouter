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

export function ToolbarMenuOthers({ editor }: { editor: Editor }) {
  return (
    <MenuTrigger>
      <ToolbarMenuButton
        tooltip="Others"
        isSelected={
          editor.isActive('subscript') ||
          editor.isActive('superscript') ||
          editor.isActive('blockquote') ||
          editor.isActive('horizontalRule')
        }
      >
        <Icon icon="lucide:more-horizontal" className="size-5" />
      </ToolbarMenuButton>

      <MenuPopover placement="bottom start">
        <Menu className="w-56">
          <MenuSection>
            <MenuHeader>Others</MenuHeader>
            <MenuItem
              aria-label="Subscript ⌘ ."
              className={twMerge(
                menuItemClasses,
                editor.isActive('subscript') && menuItemActiveClasses,
              )}
              onAction={() => editor.chain().toggleSubscript().run()}
            >
              <span className="flex gap-2 items-center">
                <Icon icon="lucide:subscript" className="size-4" />
                <p>Subscript</p>
              </span>
              <ShortcutKey keys={['mod', '.']} />
            </MenuItem>

            <MenuItem
              aria-label="Superscript ⌘ ,"
              className={twMerge(
                menuItemClasses,
                editor.isActive('superscript') && menuItemActiveClasses,
              )}
              onAction={() => editor.chain().toggleSuperscript().run()}
            >
              <span className="flex gap-2 items-center">
                <Icon icon="lucide:superscript" className="size-4" />
                <h1 className="m-0">Superscript</h1>
              </span>
              <ShortcutKey keys={['mod', ',']} />
            </MenuItem>

            <MenuItem
              aria-label="Blockquote"
              className={twMerge(
                menuItemClasses,
                editor.isActive('blockquoteFigure') && menuItemActiveClasses,
              )}
              onAction={() => editor.chain().toggleBlockquote().run()}
            >
              <span className="flex gap-2 items-center">
                <Icon icon="lucide:quote" className="size-4" />
                <h3 className="m-0">Blockquote</h3>
              </span>
              <ShortcutKey keys={['mod', 'shift', 'B']} />
            </MenuItem>

            <MenuItem
              aria-label="Divider"
              className={twMerge(
                menuItemClasses,
                editor.isActive('horizontalRule') && menuItemActiveClasses,
              )}
              onAction={() => editor.chain().setHorizontalRule().run()}
            >
              <span className="flex gap-2 items-center">
                <Icon icon="lucide:minus" className="size-4" />
                <h3 className="m-0">Divider</h3>
              </span>
            </MenuItem>

            <MenuItem
              aria-label="Columns"
              className={twMerge(
                menuItemClasses,
                editor.isActive('columns') && menuItemActiveClasses,
              )}
              onAction={() =>
                editor
                  .chain()
                  .setColumns()
                  .focus(editor.state.selection.head - 1)
                  .run()
              }
            >
              <span className="flex gap-2 items-center">
                <Icon icon="lucide:columns-2" className="size-4" />
                <h3 className="m-0">Columns</h3>
              </span>
            </MenuItem>
          </MenuSection>
        </Menu>
      </MenuPopover>
    </MenuTrigger>
  );
}
