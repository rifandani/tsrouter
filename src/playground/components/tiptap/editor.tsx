import { CharacterCount } from '@tiptap/extension-character-count';
import { Highlight } from '@tiptap/extension-highlight';
// import { Image } from '@tiptap/extension-image';
import { Color } from '@tiptap/extension-color';
import { FontFamily } from '@tiptap/extension-font-family';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TaskItem } from '@tiptap/extension-task-item';
import { TaskList } from '@tiptap/extension-task-list';
import { TextAlign } from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Underline } from '@tiptap/extension-underline';
import { Youtube } from '@tiptap/extension-youtube';
import {
  EditorContent,
  useEditor,
  type Editor as TEditor,
} from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import React, { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import type { EditorProps } from './_types';
// import { ImageBubbleMenu } from './bubble-menu/image-bubble-menu';
// import { ImageViewBlock } from './image/image-view-block';
import { BubbleMenuColumns } from './bubble-menu-columns';
import { BubbleMenuLink } from './bubble-menu-link';
import { BubbleMenuTableColumn, BubbleMenuTableRow } from './bubble-menu-table';
import { BubbleMenuYoutube } from './bubble-menu-youtube';
import './editor.css';
import { Column } from './extensions/column';
import { Columns } from './extensions/columns';
import { DocumentExtended } from './extensions/document';
import { FontSize } from './extensions/font-size';
import { HorizontalRuleExtended } from './extensions/horizontal-rule';
import { LinkExtended } from './extensions/link';
import { TableCell } from './extensions/table-cell';
import { TableHeaderExtended } from './extensions/table-header';
import { Toolbar } from './toolbar';

declare global {
  interface Window {
    /**
     * Tiptap editor instance
     */
    editor: TEditor | null;
  }
}

export const Editor = forwardRef<HTMLDivElement, EditorProps>(
  (
    {
      value,
      outputValue = 'html',
      disabled,
      contentClass,
      onValueChange,
      className,
      ...props
    },
    ref,
  ) => {
    const editor = useEditor({
      extensions: [
        /**
         * includes:
         *
         * - extension-blockquote
         * - extension-bold
         * - extension-bullet-list
         * - extension-code
         * - extension-code-block (installed)
         * - extension-document (installed and overriden)
         * - extension-dropcursor
         * - extension-gapcursor
         * - extension-hard-break
         * - extension-heading
         * - extension-history
         * - extension-horizontal-rule (installed and overriden)
         * - extension-italic
         * - extension-list-item
         * - extension-ordered-list
         * - extension-paragraph
         * - extension-strike
         * - extension-text
         */
        StarterKit.configure({
          // blockquote: false,
          document: false,
          horizontalRule: false,
        }),
        // BlockquoteFigure,
        CharacterCount.configure({
          limit: 10_000,
        }),
        Color,
        Columns,
        Column,
        DocumentExtended,
        FontFamily,
        FontSize,
        Highlight.configure({ multicolor: true }),
        HorizontalRuleExtended,
        // Image.extend({
        //   addNodeView() {
        //     return ReactNodeViewRenderer(ImageViewBlock);
        //   },
        // }),
        LinkExtended,
        Placeholder.configure({
          includeChildren: true,
          showOnlyCurrent: false,
          placeholder: () => '',
        }),
        Subscript,
        Superscript,
        Table.configure({ resizable: true, lastColumnResizable: false }),
        TableHeaderExtended,
        TableRow.extend({
          allowGapCursor: false,
          content: 'tableCell*',
        }),
        TableCell,
        TaskList,
        TaskItem.configure({
          nested: true,
        }),
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
        TextStyle,
        Underline,
        Youtube,
      ],
      editorProps: {
        attributes: {
          class:
            'prose mx-auto focus:outline-none max-w-none prose-stone dark:prose-invert',
        },
      },
      onUpdate: (props) => {
        let value = '';

        if (outputValue === 'json') {
          value = JSON.stringify(props.editor.getJSON());
        } else if (outputValue === 'html') {
          value = props.editor.getText() ? props.editor.getHTML() : '';
        } else {
          value = props.editor.getText();
        }

        onValueChange(value);
      },
      content: value,
      editable: !disabled,
    });
    const menuContainerRef = React.useRef(null);

    React.useEffect(() => {
      if (!window.editor) {
        window.editor = editor;
      }

      return () => {
        window.editor = null;
      };
    }, [editor]);

    return (
      <div
        className={twMerge(
          'flex h-auto min-h-72 w-full flex-col rounded-md border border-input shadow-sm focus-within:border-primary',
          className,
        )}
        {...props}
        ref={ref}
      >
        {editor && (
          <>
            {/* <LinkBubbleMenu editor={editor} />
            <ImageBubbleMenu editor={editor} /> */}
            <Toolbar editor={editor} />
            <BubbleMenuColumns editor={editor} appendTo={menuContainerRef} />
            <BubbleMenuTableRow editor={editor} appendTo={menuContainerRef} />
            <BubbleMenuTableColumn
              editor={editor}
              appendTo={menuContainerRef}
            />
            <BubbleMenuLink editor={editor} appendTo={menuContainerRef} />
            <BubbleMenuYoutube editor={editor} appendTo={menuContainerRef} />
          </>
        )}

        {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
        <div
          className="h-full grow"
          ref={menuContainerRef}
          onClick={() => editor?.chain().focus().run()}
        >
          <EditorContent
            editor={editor}
            className={twMerge('p-5', contentClass)}
          />
        </div>
      </div>
    );
  },
);

Editor.displayName = 'Editor';
