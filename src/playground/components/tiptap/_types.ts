import type { Editor as CoreEditor } from '@tiptap/core';
import type { EditorState } from '@tiptap/pm/state';
import type { EditorView } from '@tiptap/pm/view';
import type { Editor } from '@tiptap/react';
import type React from 'react';

export interface EditorProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  outputValue?: 'html' | 'json' | 'text';
  disabled?: boolean;
  contentClass?: string;
  onValueChange: React.Dispatch<React.SetStateAction<string>>;
}

export interface MenuProps {
  editor: Editor;
  // biome-ignore lint/suspicious/noExplicitAny: intentional
  appendTo?: React.RefObject<any>;
  shouldHide?: boolean;
}

export interface ShouldShowProps {
  editor?: CoreEditor;
  view: EditorView;
  state?: EditorState;
  oldState?: EditorState;
  from?: number;
  to?: number;
}
