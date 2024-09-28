import type { Editor } from '@tiptap/react';
import { useCallback } from 'react';
import type { ShouldShowProps } from '../_types';
import { isCustomNodeSelected, isTextSelected } from '../_util';

export const useTextmenuStates = (editor: Editor) => {
  const shouldShow = useCallback(
    ({ view, from }: ShouldShowProps) => {
      if (!view) {
        return false;
      }

      const domAtPos = view.domAtPos(from || 0).node as HTMLElement;
      const nodeDOM = view.nodeDOM(from || 0) as HTMLElement;
      const node = nodeDOM || domAtPos;

      if (isCustomNodeSelected(editor, node)) {
        return false;
      }

      return isTextSelected({ editor });
    },
    [editor],
  );

  return {
    isBold: editor.isActive('bold'),
    isItalic: editor.isActive('italic'),
    isStrike: editor.isActive('strike'),
    isUnderline: editor.isActive('underline'),
    isCode: editor.isActive('code'),
    isSubscript: editor.isActive('subscript'),
    isSuperscript: editor.isActive('superscript'),
    isBlockquote: editor.isActive('blockquote'),
    isHorizontalRule: editor.isActive('horizontalRule'),
    isTable: editor.isActive('table'),
    isAlignLeft: editor.isActive({ textAlign: 'left' }),
    isAlignCenter: editor.isActive({ textAlign: 'center' }),
    isAlignRight: editor.isActive({ textAlign: 'right' }),
    isAlignJustify: editor.isActive({ textAlign: 'justify' }),
    currentColor:
      (editor.getAttributes('textStyle')?.color as string) || undefined,
    currentHighlight:
      (editor.getAttributes('highlight')?.color as string) || undefined,
    currentFont:
      (editor.getAttributes('textStyle')?.fontFamily as string) || undefined,
    currentSize:
      (editor.getAttributes('textStyle')?.fontSize as string) || undefined,
    shouldShow,
  };
};
