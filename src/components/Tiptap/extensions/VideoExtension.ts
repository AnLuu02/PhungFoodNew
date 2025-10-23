import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { VideoView } from './VideoView';

export const Video = Node.create({
  name: 'video',
  group: 'block',
  draggable: true,
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      controls: { default: true },
      autoplay: { default: false },
      loop: { default: false },
      muted: { default: false },
      style: { default: 'max-width:200px; border-radius:8px; display:block' }
    };
  },

  parseHTML() {
    return [{ tag: 'video' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['video', mergeAttributes(HTMLAttributes)];
  },

  addCommands() {
    return {
      setVideo:
        (attrs: Record<string, any>) =>
        ({ chain }) => {
          return chain()
            .insertContent({
              type: this.name,
              attrs
            })
            .run();
        }
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(VideoView);
  }
});
