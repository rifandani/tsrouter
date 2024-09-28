import type { Editor } from '@tiptap/react';
import React from 'react';

export const useTextmenuCommands = (editor: Editor) => {
  const onBold = React.useCallback(
    () => editor.chain().focus().toggleBold().run(),
    [editor],
  );
  const onItalic = React.useCallback(
    () => editor.chain().focus().toggleItalic().run(),
    [editor],
  );
  const onStrike = React.useCallback(
    () => editor.chain().focus().toggleStrike().run(),
    [editor],
  );
  const onUnderline = React.useCallback(
    () => editor.chain().focus().toggleUnderline().run(),
    [editor],
  );
  const onCode = React.useCallback(
    () => editor.chain().focus().toggleCode().run(),
    [editor],
  );
  const onCodeBlock = React.useCallback(
    () => editor.chain().focus().toggleCodeBlock().run(),
    [editor],
  );

  const onSubscript = React.useCallback(
    () => editor.chain().focus().toggleSubscript().run(),
    [editor],
  );
  const onSuperscript = React.useCallback(
    () => editor.chain().focus().toggleSuperscript().run(),
    [editor],
  );
  const onAlignLeft = React.useCallback(
    () => editor.chain().focus().setTextAlign('left').run(),
    [editor],
  );
  const onAlignCenter = React.useCallback(
    () => editor.chain().focus().setTextAlign('center').run(),
    [editor],
  );
  const onAlignRight = React.useCallback(
    () => editor.chain().focus().setTextAlign('right').run(),
    [editor],
  );
  const onAlignJustify = React.useCallback(
    () => editor.chain().focus().setTextAlign('justify').run(),
    [editor],
  );

  const onChangeColor = React.useCallback(
    (color: string) => editor.chain().setColor(color).run(),
    [editor],
  );
  const onClearColor = React.useCallback(
    () => editor.chain().focus().unsetColor().run(),
    [editor],
  );

  const onChangeHighlight = React.useCallback(
    (color: string) => editor.chain().setHighlight({ color }).run(),
    [editor],
  );
  const onClearHighlight = React.useCallback(
    () => editor.chain().focus().unsetHighlight().run(),
    [editor],
  );

  const onLink = React.useCallback(
    (url: string, inNewTab?: boolean) =>
      editor
        .chain()
        .focus()
        .setLink({ href: url, target: inNewTab ? '_blank' : '' })
        .run(),
    [editor],
  );

  const onSetFont = React.useCallback(
    (font: string) => {
      if (!font || font.length === 0) {
        return editor.chain().focus().unsetFontFamily().run();
      }
      return editor.chain().focus().setFontFamily(font).run();
    },
    [editor],
  );

  const onSetFontSize = React.useCallback(
    (fontSize: string) => {
      if (!fontSize || fontSize.length === 0) {
        return editor.chain().focus().unsetFontSize().run();
      }
      return editor.chain().focus().setFontSize(fontSize).run();
    },
    [editor],
  );

  return {
    onBold,
    onItalic,
    onStrike,
    onUnderline,
    onCode,
    onCodeBlock,
    onSubscript,
    onSuperscript,
    onAlignLeft,
    onAlignCenter,
    onAlignRight,
    onAlignJustify,
    onChangeColor,
    onClearColor,
    onChangeHighlight,
    onClearHighlight,
    onSetFont,
    onSetFontSize,
    onLink,
  };
};
