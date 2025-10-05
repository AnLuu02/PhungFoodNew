'use client';

import { Box } from '@mantine/core';

export const TiptapViewer = ({ descriptionDetailHtml }: any) => {
  // const editor = useEditor({
  //   extensions: [
  //     StarterKit,
  //     Underline,
  //     Link,
  //     Superscript,
  //     SubScript,
  //     Highlight,
  //     TextAlign.configure({ types: ['heading', 'paragraph'] })
  //   ],
  //   content: descriptionDetailJson || '<p>Đang cập nhật</p>',
  //   editable: false,
  //   immediatelyRender: false
  // });

  // if (!editor) {
  //   return null;
  // }

  // return <EditorContent editor={editor} />;
  return <Box dangerouslySetInnerHTML={{ __html: descriptionDetailHtml || '<p>Đang cập nhật</p>' }} />;
};
