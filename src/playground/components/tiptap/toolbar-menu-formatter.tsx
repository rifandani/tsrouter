import { Icon } from '@iconify/react';
import type { Editor } from '@tiptap/react';
import { ToolbarMenuButton } from './toolbar-menu-button';

export function ToolbarMenuFormatter({ editor }: { editor: Editor }) {
  return (
    <>
      {/* BOLD */}
      <ToolbarMenuButton
        tooltip="Bold ⌘ B"
        aria-label="Bold"
        isDisabled={
          !editor.can().chain().focus().toggleBold().run() ||
          editor.isActive('bold')
        }
        isSelected={editor.isActive('bold')}
        onChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Icon icon="lucide:bold" className="size-5" />
      </ToolbarMenuButton>

      {/* ITALIC */}
      <ToolbarMenuButton
        tooltip="Italic ⌘ I"
        aria-label="Italic"
        isDisabled={
          !editor.can().chain().focus().toggleItalic().run() ||
          editor.isActive('italic')
        }
        isSelected={editor.isActive('italic')}
        onChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Icon icon="lucide:italic" className="size-5" />
      </ToolbarMenuButton>

      {/* UNDERLINE */}
      <ToolbarMenuButton
        tooltip="Underline ⌘ U"
        aria-label="Underline"
        isDisabled={
          !editor.can().chain().focus().toggleUnderline().run() ||
          editor.isActive('underline')
        }
        isSelected={editor.isActive('underline')}
        onChange={() => editor.chain().focus().toggleUnderline().run()}
      >
        <Icon icon="lucide:underline" className="size-5" />
      </ToolbarMenuButton>

      {/* STRIKETHROUGH */}
      <ToolbarMenuButton
        tooltip="Strikethrough ⌘ ⇧ S"
        aria-label="Strikethrough"
        isDisabled={
          !editor.can().chain().focus().toggleStrike().run() ||
          editor.isActive('strike')
        }
        isSelected={editor.isActive('strike')}
        onChange={() => editor.chain().focus().toggleStrike().run()}
      >
        <Icon icon="lucide:strikethrough" className="size-5" />
      </ToolbarMenuButton>

      {/* CODE */}
      <ToolbarMenuButton
        tooltip="Code ⌘ E"
        aria-label="Code"
        isDisabled={
          !editor.can().chain().focus().toggleCode().run() ||
          editor.isActive('code')
        }
        isSelected={editor.isActive('code')}
        onChange={() => editor.chain().focus().toggleCode().run()}
      >
        <Icon icon="lucide:code" className="size-5" />
      </ToolbarMenuButton>

      {/* CODEBLOCK */}
      <ToolbarMenuButton
        tooltip="Code Block ⌘ ⌥ C"
        aria-label="Code Block"
        isDisabled={
          !editor.can().chain().focus().toggleCodeBlock().run() ||
          editor.isActive('codeBlock')
        }
        isSelected={editor.isActive('codeBlock')}
        onChange={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <Icon icon="lucide:code-xml" className="size-5" />
      </ToolbarMenuButton>
    </>
  );
}
