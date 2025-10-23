import { Mark, mergeAttributes } from '@tiptap/core';

export const FontFamily = Mark.create({
  name: 'fontFamily',

  addOptions() {
    return {
      fontFamilies: [
        'sans-serif',
        'serif',
        'monospace',
        'Arial Black, Gadget, sans-serif',
        'Arial Narrow, sans-serif',
        '"Comic Sans MS", cursive, sans-serif',
        'Garamond, serif',
        'Georgia, serif',
        'Tahoma, sans-serif',
        '"Trebuchet MS", sans-serif',
        'Verdana, sans-serif'
      ]
    };
  },

  addAttributes() {
    return {
      fontFamily: {
        default: null,
        parseHTML: element => element.style.fontFamily || null,
        renderHTML: attributes => {
          if (!attributes.fontFamily) return {};
          return { style: `font-family:${attributes.fontFamily}` };
        }
      }
    };
  },

  parseHTML() {
    return [
      {
        style: 'font-family'
      }
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes), 0];
  },

  addCommands() {
    return {
      setFontFamily:
        (fontFamily: string) =>
        ({ chain }) => {
          return chain().setMark(this.name, { fontFamily }).run();
        },
      unsetFontFamily:
        () =>
        ({ chain }) => {
          return chain().unsetMark(this.name).run();
        }
    };
  }
});
