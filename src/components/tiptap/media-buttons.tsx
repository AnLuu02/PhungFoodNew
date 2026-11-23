'use client';

import { Button, FileButton, Group, Modal, Stack, TextInput } from '@mantine/core';
import { Editor } from '@tiptap/react';
import { useState } from 'react';

export function MediaButtons({ editor }: { editor: Editor | null }) {
  const [opened, setOpened] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [videoOpened, setVideoOpened] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  if (!editor) return null;

  const handleInsertImage = (url: string) => {
    if (!url) return;
    editor.commands.setResizableImage({
      src: url,
      alt: '',
      title: '',
      'data-keep-ratio': true
    });
    setImageUrl('');
    setOpened(false);
  };

  const handleInsertVideo = (url: string) => {
    if (!url) return;

    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
    } else {
      editor.chain().focus().setVideo({ src: url }).run();
    }

    setVideoUrl('');
    setVideoOpened(false);
  };

  return (
    <>
      <Group gap='xs'>
        <Button
          size='xs'
          variant='subtle'
          onClick={() => setOpened(true)}
          classNames={{
            root: `!border-gray-300 !font-bold text-black hover:bg-mainColor/10 hover:text-black data-[active=true]:!border-mainColor data-[active=true]:!bg-mainColor data-[active=true]:!text-white dark:!border-dark-dimmed dark:text-dark-text`
          }}
        >
          🖼️ Ảnh
        </Button>

        <Button
          size='xs'
          variant='subtle'
          onClick={() => setVideoOpened(true)}
          classNames={{
            root: `!border-gray-300 !font-bold text-black hover:bg-mainColor/10 hover:text-black data-[active=true]:!border-mainColor data-[active=true]:!bg-mainColor data-[active=true]:!text-white dark:!border-dark-dimmed dark:text-dark-text`
          }}
        >
          🎥 Video
        </Button>
      </Group>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title='Chèn hình ảnh'
        classNames={{
          title: 'font-bold'
        }}
        centered
      >
        <Stack>
          <TextInput
            label='URL ảnh online'
            placeholder='https://example.com/image.jpg'
            value={imageUrl}
            onChange={e => setImageUrl(e.currentTarget.value)}
          />
          <FileButton
            onChange={file => {
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => handleInsertImage(reader.result as string);
              reader.readAsDataURL(file);
            }}
            accept='image/*'
          >
            {props => <Button {...props}>Chọn ảnh từ máy</Button>}
          </FileButton>

          <Button onClick={() => handleInsertImage(imageUrl)} disabled={!imageUrl}>
            Chèn ảnh từ URL
          </Button>
        </Stack>
      </Modal>

      <Modal
        opened={videoOpened}
        onClose={() => setVideoOpened(false)}
        classNames={{
          title: 'font-bold'
        }}
        title='Chèn video'
        centered
      >
        <Stack>
          <TextInput
            label='URL video online (YouTube hoặc MP4)'
            placeholder='https://example.com/video.mp4 hoặc https://youtu.be/...'
            value={videoUrl}
            onChange={e => setVideoUrl(e.currentTarget.value)}
          />
          <FileButton
            onChange={file => {
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => handleInsertVideo(reader.result as string);
              reader.readAsDataURL(file);
            }}
            accept='video/*'
          >
            {props => (
              <Button {...props} disabled={!!videoUrl}>
                Chọn video từ máy
              </Button>
            )}
          </FileButton>

          <Button onClick={() => handleInsertVideo(videoUrl)} disabled={!videoUrl}>
            Chèn video từ URL
          </Button>
        </Stack>
      </Modal>
    </>
  );
}
