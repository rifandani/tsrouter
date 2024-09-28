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

const fontFamilyGroups = [
  {
    label: 'Sans Serif',
    options: [
      { label: 'Lato', value: '' },
      { label: 'Arial', value: 'Arial' },
      { label: 'Helvetica', value: 'Helvetica' },
    ],
  },
  {
    label: 'Serif',
    options: [
      { label: 'Times New Roman', value: 'Times' },
      { label: 'Garamond', value: 'Garamond' },
      { label: 'Georgia', value: 'Georgia' },
    ],
  },
  {
    label: 'Monospace',
    options: [
      { label: 'Courier', value: 'Courier' },
      { label: 'Courier New', value: 'Courier New' },
    ],
  },
];

const fontFamilies = fontFamilyGroups
  .flatMap((group) => [group.options])
  .flat();

export function ToolbarMenuFontFamily({
  editor,
  font,
}: { editor: Editor; font: string }) {
  const currentFont = fontFamilies.find((size) => size.value === font);
  const currentFontLabel = currentFont?.label.split(' ')[0] || 'Lato';

  return (
    <MenuTrigger>
      <ToolbarMenuButton
        tooltip="Font Family"
        isSelected={!!currentFont?.value}
      >
        <p className="text-base mr-1">{currentFontLabel}</p>
        <Icon icon="lucide:chevron-down" className="size-3" />
      </ToolbarMenuButton>

      <MenuPopover placement="bottom start">
        <Menu className="w-56">
          {fontFamilyGroups.map((group) => (
            <MenuSection key={group.label}>
              <MenuHeader separator>{group.label}</MenuHeader>
              {group.options.map((option) => (
                <MenuItem
                  key={option.label}
                  className={twMerge(
                    menuItemClasses,
                    font === option.value && menuItemActiveClasses,
                  )}
                  aria-label={option.label}
                  onAction={() => {
                    if (option.value === '') {
                      editor.chain().focus().unsetFontFamily().run();
                      return;
                    }
                    editor.chain().focus().setFontFamily(option.value).run();
                  }}
                >
                  <p style={{ fontFamily: option.value }}>{option.label}</p>
                </MenuItem>
              ))}
            </MenuSection>
          ))}
        </Menu>
      </MenuPopover>
    </MenuTrigger>
  );
}
