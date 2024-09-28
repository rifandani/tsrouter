import { Document } from '@tiptap/extension-document';

export const DocumentExtended = Document.extend({
  content: '(block|columns)+',
});
