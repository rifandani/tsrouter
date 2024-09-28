import {
  Menu,
  MenuHeader,
  MenuItem,
  MenuPopover,
  MenuSection,
  MenuTrigger,
} from '#app/components/ui/menu';
import { Icon } from '@iconify/react';
import type { Editor } from '@tiptap/react';
import { twMerge } from 'tailwind-merge';
import { menuItemActiveClasses, menuItemClasses } from './_util';
import { ToolbarMenuButton } from './toolbar-menu-button';

const fontSizes = [
  { label: 'Smaller', value: '12px' },
  { label: 'Small', value: '14px' },
  { label: 'Medium', value: '' },
  { label: 'Large', value: '18px' },
  { label: 'Extra Large', value: '24px' },
];

export function ToolbarMenuFontSize({
  editor,
  size,
}: { editor: Editor; size: string }) {
  const currentSize = fontSizes.find((_size) => _size.value === size);
  const currentSizeLabel = currentSize?.label.split(' ')[0] || 'Medium';

  return (
    <MenuTrigger>
      <ToolbarMenuButton tooltip="Font Size" isSelected={!!currentSize?.value}>
        <p className="text-base mr-1">{currentSizeLabel}</p>
        <Icon icon="lucide:chevron-down" className="size-3" />
      </ToolbarMenuButton>

      <MenuPopover placement="bottom start">
        <Menu className="w-56">
          <MenuSection>
            <MenuHeader separator>Font Size</MenuHeader>
            {fontSizes.map((_size) => (
              <MenuItem
                key={_size.label}
                className={twMerge(
                  menuItemClasses,
                  size === _size.value && menuItemActiveClasses,
                )}
                aria-label={_size.label}
                onAction={() => {
                  if (_size.value === '') {
                    editor.chain().focus().unsetFontSize().run();
                    return;
                  }
                  editor.chain().focus().setFontSize(_size.value).run();
                }}
              >
                <p style={{ fontFamily: _size.value }}>{_size.label}</p>
              </MenuItem>
            ))}
          </MenuSection>
        </Menu>
      </MenuPopover>
    </MenuTrigger>
  );
}
