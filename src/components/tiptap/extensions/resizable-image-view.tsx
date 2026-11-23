import { Accordion } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import {
  ResizableImage,
  ResizableImageComponent,
  ResizableImageNodeViewRendererProps
} from 'tiptap-extension-resizable-image';

const NodeView = (props: ResizableImageNodeViewRendererProps) => {
  const { deleteNode } = props.node.attrs;
  const deleteNodeFromProps = (props as any).deleteNode as (() => void) | undefined;
  const fallbackDelete = () => {
    try {
      const anyProps = props as any;
      const view = anyProps.editor?.view ?? anyProps.view;
      const getPos = anyProps.getPos;
      if (!view || typeof getPos !== 'function') return;
      const from = getPos();
      const to = from + (props.node?.nodeSize ?? 1);
      const tr = view.state.tr.delete(from, to);
      view.dispatch(tr);
      view.focus();
    } catch (e) {}
  };
  const handleDelete = () => {
    if (typeof deleteNodeFromProps === 'function') {
      deleteNodeFromProps();
      return;
    }
    fallbackDelete();
  };
  return (
    <NodeViewWrapper className='image-component group relative w-[max-content]' data-drag-handle>
      <div style={{ display: 'inline-flex' }}>
        <ResizableImageComponent {...props} />
      </div>
      <Accordion
        bg={'red'}
        onClick={handleDelete}
        className='absolute right-1 top-1 rounded p-1 opacity-0 transition group-hover:opacity-100'
        title='Xóa video'
      >
        <IconTrash size={14} />
      </Accordion>
    </NodeViewWrapper>
  );
};

export const ResizableImageExtension = ResizableImage.extend({
  addNodeView() {
    return ReactNodeViewRenderer(props => NodeView(props as unknown as ResizableImageNodeViewRendererProps));
  }
});
