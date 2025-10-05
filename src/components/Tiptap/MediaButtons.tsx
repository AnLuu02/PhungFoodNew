import { Button, Group } from '@mantine/core';

export function MediaButtons({ editor }: { editor: any }) {
  if (!editor) return null;

  const insertImage = () => {
    const url = prompt('Nhập URL ảnh:');
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const insertYoutube = () => {
    const url = prompt('Nhập link YouTube:');
    if (url) editor.chain().focus().setYoutubeVideo({ src: url }).run();
  };

  return (
    <Group gap='xs'>
      <Button size='xs' variant='light' onClick={insertImage}>
        🖼️ Ảnh
      </Button>
      <Button size='xs' variant='light' onClick={insertYoutube}>
        ▶️ Video
      </Button>
    </Group>
  );
}
