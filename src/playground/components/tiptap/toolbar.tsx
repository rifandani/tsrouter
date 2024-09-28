import { Separator } from '#app/components/ui/separator';
import { Icon } from '@iconify/react';
import type { Editor } from '@tiptap/react';
import { useTextmenuStates } from './hooks/use-textmenu-states';
import { ToolbarMenuAlign } from './toolbar-menu-align';
import { ToolbarMenuButton } from './toolbar-menu-button';
import { ToolbarMenuFontFamily } from './toolbar-menu-font-family';
import { ToolbarMenuFontSize } from './toolbar-menu-font-size';
import { ToolbarMenuFormatter } from './toolbar-menu-formatter';
import { ToolbarMenuHighlighter } from './toolbar-menu-highlighter';
import { ToolbarMenuLink } from './toolbar-menu-link';
import { ToolbarMenuList } from './toolbar-menu-list';
import { ToolbarMenuOthers } from './toolbar-menu-others';
import { ToolbarMenuParagraph } from './toolbar-menu-paragraph';
import { ToolbarMenuYoutube } from './toolbar-menu-youtube';

export function Toolbar({ editor }: { editor: Editor }) {
  const states = useTextmenuStates(editor);

  return (
    <div className="border-b border-border p-2">
      <div className="flex w-full flex-wrap items-center gap-1">
        {/* PARAGRAPH, HEADING 1-6 */}
        <ToolbarMenuParagraph editor={editor} />

        {/* '' defaults to Lato */}
        <ToolbarMenuFontFamily
          editor={editor}
          font={states.currentFont || ''}
        />

        {/* '' defaults to 16px */}
        <ToolbarMenuFontSize editor={editor} size={states.currentSize || ''} />

        {/* ALIGN */}
        <ToolbarMenuAlign editor={editor} />

        <Separator orientation="vertical" className="mx-2 h-7" />

        {/* BOLD, ITALIC, UNDERLINE, STRIKETHROUGH, CODE, CODEBLOCK */}
        <ToolbarMenuFormatter editor={editor} />

        {/* TEXT COLOR */}
        <ToolbarMenuHighlighter
          color={states.currentColor || '#fff'}
          onChange={(_color) => {
            editor.chain().setColor(_color.toString('hex')).run();
          }}
          onReset={() => {
            editor.chain().unsetColor().run();
          }}
        >
          <ToolbarMenuButton
            tooltip="Text Color"
            aria-label="Text Color"
            isSelected={!!states.currentColor}
          >
            <Icon icon="lucide:baseline" className="size-5" />
          </ToolbarMenuButton>
        </ToolbarMenuHighlighter>

        {/* HIGHLIGHT */}
        <ToolbarMenuHighlighter
          color={states.currentHighlight || '#000'}
          onChange={(_color) => {
            editor
              .chain()
              .setHighlight({ color: _color.toString('hex') })
              .run();
          }}
          onReset={() => {
            editor.chain().unsetHighlight().run();
          }}
        >
          <ToolbarMenuButton
            tooltip="Highlight"
            aria-label="Highlight"
            isSelected={!!states.currentHighlight}
          >
            <Icon icon="lucide:paint-bucket" className="size-5" />
          </ToolbarMenuButton>
        </ToolbarMenuHighlighter>

        {/* BULLET LIST, ORDERED LIST, TASK LIST */}
        <ToolbarMenuList editor={editor} />

        <ToolbarMenuButton
          tooltip="Table"
          aria-label="Table"
          isSelected={states.isTable}
          isDisabled={editor.isActive('columns')}
          onChange={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: false })
              .run()
          }
        >
          <Icon icon="lucide:table" className="size-5" />
        </ToolbarMenuButton>

        <ToolbarMenuLink
          onSetLink={(url, openInNewTab) => {
            editor
              .chain()
              .focus()
              .setLink({ href: url, target: openInNewTab ? '_blank' : '' })
              .run();
          }}
        />

        <ToolbarMenuYoutube
          onSetYoutube={(_url) => {
            editor.chain().focus().setYoutubeVideo({ src: _url }).run();
          }}
        />

        {/* SUBSCRIPT, SUPERSCRIPT, BLOCKQUOTE */}
        <ToolbarMenuOthers editor={editor} />
      </div>
    </div>
  );
}
