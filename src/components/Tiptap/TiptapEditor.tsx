import { Group } from '@mantine/core';
import { Link, RichTextEditor } from '@mantine/tiptap';
import Highlight from '@tiptap/extension-highlight';
import SubScript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import { FontSize, TextStyle } from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import Youtube from '@tiptap/extension-youtube';
import { Editor, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { EmojiPickerButton } from './EmojiPickerButton';
import { FontFamily } from './extensions/FontFamilyExtension';
import { ResizableImageExtension } from './extensions/ResizableImageView';
import { Video } from './extensions/VideoExtension';
import { MediaButtons } from './MediaButtons';
import { TiptapControl } from './TiptapControl';
interface RichTextEditorProps {
  value: any;
  onChange: ({ json, html }: { json: any; html: any }) => void;
}
const content =
  '<h2 style="text-align: center;">Welcome to Mantine rich text editor</h2><p><code>RichTextEditor</code> component focuses on usability and is designed to be as simple as possible to bring a familiar editing experience to regular users. <code>RichTextEditor</code> is based on <a href="https://tiptap.dev/" rel="noopener noreferrer" target="_blank">Tiptap.dev</a> and supports all of its features:</p><ul><li>General text formatting: <strong>bold</strong>, <em>italic</em>, <u>underline</u>, <s>strike-through</s> </li><li>Headings (h1-h6)</li><li>Sub and super scripts (<sup>&lt;sup /&gt;</sup> and <sub>&lt;sub /&gt;</sub> tags)</li><li>Ordered and bullet lists</li><li>Text align&nbsp;</li><li>And all <a href="https://tiptap.dev/extensions" target="_blank" rel="noopener noreferrer">other extensions</a></li></ul>';

export const TiptapEditor = ({ value, onChange }: RichTextEditorProps) => {
  const editor: Editor | null = useEditor({
    extensions: [
      StarterKit,
      ResizableImageExtension.configure({
        defaultWidth: 200,
        defaultHeight: 200,
        allowBase64: true
      }),
      Youtube.configure({
        width: 640,
        height: 360,
        autoplay: false
      }),
      Video,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      FontSize,
      FontFamily
    ],
    content: value || content,
    onUpdate: ({ editor }) => {
      onChange({ json: editor.getJSON(), html: editor.getHTML() });
    },
    immediatelyRender: false
  });

  if (!editor) {
    return null;
  }

  return (
    <RichTextEditor editor={editor}>
      <RichTextEditor.Toolbar sticky stickyOffset={60}>
        <TiptapControl editor={editor} />
        <Group gap='xs'>
          <MediaButtons editor={editor} />
          <EmojiPickerButton editor={editor} />
        </Group>
      </RichTextEditor.Toolbar>
      <RichTextEditor.Content />
    </RichTextEditor>
  );
};
