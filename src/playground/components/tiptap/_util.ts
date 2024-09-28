import { CodeBlock } from '@tiptap/extension-code-block';
import { HorizontalRule } from '@tiptap/extension-horizontal-rule';
import Table from '@tiptap/extension-table';
import type { Node, ResolvedPos } from '@tiptap/pm/model';
import type { EditorState, Selection, Transaction } from '@tiptap/pm/state';
import { CellSelection, TableMap, type Rect } from '@tiptap/pm/tables';
import type { EditorView } from '@tiptap/pm/view';
import { findParentNode, isTextSelection, type Editor } from '@tiptap/react';

export const menuItemClasses =
  'flex flex-row items-center justify-between gap-4';
export const menuItemActiveClasses =
  'bg-primary/10 hover:bg-primary/10 focus:bg-primary/10';

export const isRowGripSelected = ({
  editor,
  view,
  state,
  from,
}: {
  editor: Editor;
  view: EditorView;
  state: EditorState;
  from: number;
}) => {
  const domAtPos = view.domAtPos(from).node as HTMLElement;
  const nodeDOM = view.nodeDOM(from) as HTMLElement;
  const node = nodeDOM || domAtPos;

  if (
    !editor.isActive(Table.name) ||
    !node ||
    isTableSelected(state.selection)
  ) {
    return false;
  }

  let container = node;

  while (container && !['TD', 'TH'].includes(container.tagName)) {
    container = container.parentElement as HTMLElement;
  }

  const gripRow = container?.querySelector?.('a.grip-row.selected');

  return !!gripRow;
};

export const isColumnGripSelected = ({
  editor,
  view,
  state,
  from,
}: {
  editor: Editor;
  view: EditorView;
  state: EditorState;
  from: number;
}) => {
  const domAtPos = view.domAtPos(from).node as HTMLElement;
  const nodeDOM = view.nodeDOM(from) as HTMLElement;
  const node = nodeDOM || domAtPos;

  if (
    !editor.isActive(Table.name) ||
    !node ||
    isTableSelected(state.selection)
  ) {
    return false;
  }

  let container = node;

  while (container && !['TD', 'TH'].includes(container.tagName)) {
    container = container.parentElement as HTMLElement;
  }

  const gripColumn = container?.querySelector?.('a.grip-column.selected');

  return !!gripColumn;
};

export const isTextSelected = ({ editor }: { editor: Editor }) => {
  const {
    state: {
      doc,
      selection,
      selection: { empty, from, to },
    },
  } = editor;

  // Sometime check for `empty` is not enough.
  // Doubleclick an empty paragraph returns a node size of 2.
  // So we check also for an empty text size.
  const isEmptyTextBlock =
    !doc.textBetween(from, to).length && isTextSelection(selection);

  if (empty || isEmptyTextBlock || !editor.isEditable) {
    return false;
  }

  return true;
};

export const isTableGripSelected = (node: HTMLElement) => {
  let container = node;

  while (container && !['TD', 'TH'].includes(container.tagName)) {
    container = container.parentElement as HTMLElement;
  }

  const gripColumn = container?.querySelector?.('a.grip-column.selected');
  const gripRow = container?.querySelector?.('a.grip-row.selected');

  return gripColumn || gripRow;
};

export const isCustomNodeSelected = (editor: Editor, node: HTMLElement) => {
  const customNodes = [
    CodeBlock.name,
    HorizontalRule.name,
    // ImageBlock.name,
    // ImageUpload.name,
    // ImageBlock.name,
    // Link.name,
    // Figcaption.name,
    // TableOfContentsNode.name,
  ];

  const someCustomNodesSelected = customNodes.some((type) =>
    editor.isActive(type),
  );
  const _isTableGripSelected = isTableGripSelected(node);

  return someCustomNodesSelected || _isTableGripSelected;
};

export const getRenderContainer = (editor: Editor, nodeType: string) => {
  const {
    view,
    state: {
      selection: { from },
    },
  } = editor;

  const elements = document.querySelectorAll('.has-focus');
  const elementCount = elements.length;
  const innermostNode = elements[elementCount - 1];
  const element = innermostNode;

  if (
    element?.getAttribute?.('data-type') === nodeType ||
    element?.classList?.contains?.(nodeType)
  ) {
    return element;
  }

  const node = view.domAtPos(from).node as HTMLElement;
  let container = node;

  if (!container.tagName) {
    container = node.parentElement as HTMLElement;
  }

  while (
    container &&
    !(
      container.getAttribute('data-type') &&
      container.getAttribute('data-type') === nodeType
    ) &&
    !container.classList.contains(nodeType)
  ) {
    container = container.parentElement as HTMLElement;
  }

  return container;
};

export const isRectSelected = (rect: Rect) => (selection: CellSelection) => {
  const map = TableMap.get(selection.$anchorCell.node(-1));
  const start = selection.$anchorCell.start(-1);
  const cells = map.cellsInRect(rect);
  const selectedCells = map.cellsInRect(
    map.rectBetween(
      selection.$anchorCell.pos - start,
      selection.$headCell.pos - start,
    ),
  );

  for (let i = 0, count = cells.length; i < count; i += 1) {
    if (selectedCells.indexOf(cells[i]) === -1) {
      return false;
    }
  }

  return true;
};

export const findTable = (selection: Selection) =>
  findParentNode(
    (node) => node.type.spec.tableRole && node.type.spec.tableRole === 'table',
  )(selection);

// biome-ignore lint/suspicious/noExplicitAny: intentional
export const isCellSelection = (selection: any): selection is CellSelection =>
  selection instanceof CellSelection;

// biome-ignore lint/suspicious/noExplicitAny: intentional
export const isColumnSelected = (columnIndex: number) => (selection: any) => {
  if (isCellSelection(selection)) {
    const map = TableMap.get(selection.$anchorCell.node(-1));

    return isRectSelected({
      left: columnIndex,
      right: columnIndex + 1,
      top: 0,
      bottom: map.height,
    })(selection);
  }

  return false;
};

// biome-ignore lint/suspicious/noExplicitAny: intentional
export const isRowSelected = (rowIndex: number) => (selection: any) => {
  if (isCellSelection(selection)) {
    const map = TableMap.get(selection.$anchorCell.node(-1));

    return isRectSelected({
      left: 0,
      right: map.width,
      top: rowIndex,
      bottom: rowIndex + 1,
    })(selection);
  }

  return false;
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const isTableSelected = (selection: any) => {
  if (isCellSelection(selection)) {
    const map = TableMap.get(selection.$anchorCell.node(-1));

    return isRectSelected({
      left: 0,
      right: map.width,
      top: 0,
      bottom: map.height,
    })(selection);
  }

  return false;
};

export const getCellsInColumn =
  (columnIndex: number | number[]) => (selection: Selection) => {
    const table = findTable(selection);
    if (table) {
      const map = TableMap.get(table.node);
      const indexes = Array.isArray(columnIndex)
        ? columnIndex
        : Array.from([columnIndex]);

      return indexes.reduce(
        (acc, index) => {
          if (index >= 0 && index <= map.width - 1) {
            const cells = map.cellsInRect({
              left: index,
              right: index + 1,
              top: 0,
              bottom: map.height,
            });

            return acc.concat(
              cells.map((nodePos) => {
                const node = table.node.nodeAt(nodePos);
                const pos = nodePos + table.start;

                return { pos, start: pos + 1, node };
              }),
            );
          }

          return acc;
        },
        [] as { pos: number; start: number; node: Node | null | undefined }[],
      );
    }
    return null;
  };

export const getCellsInRow =
  (rowIndex: number | number[]) => (selection: Selection) => {
    const table = findTable(selection);

    if (table) {
      const map = TableMap.get(table.node);
      const indexes = Array.isArray(rowIndex)
        ? rowIndex
        : Array.from([rowIndex]);

      return indexes.reduce(
        (acc, index) => {
          if (index >= 0 && index <= map.height - 1) {
            const cells = map.cellsInRect({
              left: 0,
              right: map.width,
              top: index,
              bottom: index + 1,
            });

            return acc.concat(
              cells.map((nodePos) => {
                const node = table.node.nodeAt(nodePos);
                const pos = nodePos + table.start;
                return { pos, start: pos + 1, node };
              }),
            );
          }

          return acc;
        },
        [] as { pos: number; start: number; node: Node | null | undefined }[],
      );
    }

    return null;
  };

export const getCellsInTable = (selection: Selection) => {
  const table = findTable(selection);

  if (table) {
    const map = TableMap.get(table.node);
    const cells = map.cellsInRect({
      left: 0,
      right: map.width,
      top: 0,
      bottom: map.height,
    });

    return cells.map((nodePos) => {
      const node = table.node.nodeAt(nodePos);
      const pos = nodePos + table.start;

      return { pos, start: pos + 1, node };
    });
  }

  return null;
};

export const findParentNodeClosestToPos = (
  $pos: ResolvedPos,
  predicate: (node: Node) => boolean,
) => {
  for (let i = $pos.depth; i > 0; i -= 1) {
    const node = $pos.node(i);

    if (predicate(node)) {
      return {
        pos: i > 0 ? $pos.before(i) : 0,
        start: $pos.start(i),
        depth: i,
        node,
      };
    }
  }

  return null;
};

export const findCellClosestToPos = ($pos: ResolvedPos) => {
  const predicate = (node: Node) =>
    node.type.spec.tableRole && /cell/i.test(node.type.spec.tableRole);

  return findParentNodeClosestToPos($pos, predicate);
};

const select =
  (type: 'row' | 'column') => (index: number) => (tr: Transaction) => {
    const table = findTable(tr.selection);
    const isRowSelection = type === 'row';

    if (table) {
      const map = TableMap.get(table.node);

      // Check if the index is valid
      if (index >= 0 && index < (isRowSelection ? map.height : map.width)) {
        const left = isRowSelection ? 0 : index;
        const top = isRowSelection ? index : 0;
        const right = isRowSelection ? map.width : index + 1;
        const bottom = isRowSelection ? index + 1 : map.height;

        const cellsInFirstRow = map.cellsInRect({
          left,
          top,
          right: isRowSelection ? right : left + 1,
          bottom: isRowSelection ? top + 1 : bottom,
        });

        const cellsInLastRow =
          bottom - top === 1
            ? cellsInFirstRow
            : map.cellsInRect({
                left: isRowSelection ? left : right - 1,
                top: isRowSelection ? bottom - 1 : top,
                right,
                bottom,
              });

        const head = table.start + cellsInFirstRow[0];
        const anchor = table.start + cellsInLastRow[cellsInLastRow.length - 1];
        const $head = tr.doc.resolve(head);
        const $anchor = tr.doc.resolve(anchor);

        // @ts-ignore
        return tr.setSelection(new CellSelection($anchor, $head));
      }
    }
    return tr;
  };

export const selectColumn = select('column');

export const selectRow = select('row');

export const selectTable = (tr: Transaction) => {
  const table = findTable(tr.selection);

  if (table) {
    const { map } = TableMap.get(table.node);

    if (map?.length) {
      const head = table.start + map[0];
      const anchor = table.start + map[map.length - 1];
      const $head = tr.doc.resolve(head);
      const $anchor = tr.doc.resolve(anchor);

      // @ts-ignore
      return tr.setSelection(new CellSelection($anchor, $head));
    }
  }

  return tr;
};
