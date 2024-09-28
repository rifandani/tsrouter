import { mergeAttributes } from '@tiptap/core';
import HorizontalRule from '@tiptap/extension-horizontal-rule';

export const HorizontalRuleExtended = HorizontalRule.extend({
  renderHTML() {
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, {
        'data-type': this.name,
      }),
      ['hr'],
    ];
  },
});
