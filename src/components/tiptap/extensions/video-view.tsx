import { Accordion } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { NodeViewWrapper } from '@tiptap/react';

export const VideoView = ({ node, deleteNode, selected }: any) => {
  const { src, controls = true } = node.attrs;

  return (
    <NodeViewWrapper className='group relative w-[max-content]'>
      <video
        src={src}
        controls={controls}
        style={{ maxWidth: '200px', borderRadius: '8px' }}
        className={`transition-all ${selected ? 'ring-2 ring-blue-400' : ''}`}
      />

      <Accordion
        bg={'red'}
        onClick={deleteNode}
        className='absolute right-1 top-1 rounded p-1 opacity-0 transition group-hover:opacity-100'
        title='Xóa video'
      >
        <IconTrash size={14} />
      </Accordion>
    </NodeViewWrapper>
  );
};
