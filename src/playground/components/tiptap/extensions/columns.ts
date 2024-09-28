import { Node } from '@tiptap/core';

export enum ColumnLayout {
  SidebarLeft = 'sidebar-left',
  SidebarRight = 'sidebar-right',
  TwoColumn = 'two-column',
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    columns: {
      setColumns: () => ReturnType;
      setLayout: (layout: ColumnLayout) => ReturnType;
      unsetColumns: () => ReturnType;
    };
  }
}

export const Columns = Node.create({
  name: 'columns',

  group: 'columns',

  content: 'column column',

  defining: true,

  isolating: true,

  addAttributes() {
    return {
      layout: {
        default: ColumnLayout.TwoColumn,
      },
    };
  },

  addCommands() {
    return {
      setColumns:
        () =>
        ({ commands }) =>
          commands.insertContent(
            `<div data-type="columns"><div data-type="column" data-position="left"><p></p></div><div data-type="column" data-position="right"><p></p></div></div>`,
          ),
      setLayout:
        (layout: ColumnLayout) =>
        ({ commands }) =>
          commands.updateAttributes('columns', { layout }),
      unsetColumns:
        () =>
        ({ commands }) =>
          commands.deleteNode('columns'),
    };
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      { 'data-type': 'columns', class: `layout-${HTMLAttributes.layout}` },
      0,
    ];
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="columns"]',
      },
    ];
  },
});
