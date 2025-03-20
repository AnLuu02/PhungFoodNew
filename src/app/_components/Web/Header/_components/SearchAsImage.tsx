'use client';

import { ActionIcon, Button, Group, Image, Modal, Stack, Text, Title } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { IconLighter, IconPhoto, IconScan, IconUpload, IconX } from '@tabler/icons-react';
import { useState } from 'react';

interface FileWithPreview extends File {
  preview?: string;
}

export default function ImageSearchModal() {
  const [opened, setOpened] = useState(false);
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  const handleDrop = (droppedFiles: File[]) => {
    const newFiles: any = droppedFiles.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file)
      })
    );
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles?.[index]?.preview || '');
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  return (
    <>
      <ActionIcon variant='subtle' color='gray' onClick={() => setOpened(true)}>
        <IconScan size={18} fontWeight={500} />
      </ActionIcon>

      <Modal
        radius={'lg'}
        centered
        opened={opened}
        onClose={() => setOpened(false)}
        title={<Title order={3}>Tìm kiếm với hình ảnh</Title>}
        size='md'
        padding='lg'
      >
        <Stack gap='md'>
          <div className='space-y-2 rounded-lg bg-amber-50 p-2'>
            <Group>
              <IconLighter size={24} className='text-amber-500' />
              <Text fw={500}>Mẹo để tìm kiếm hình ảnh chính xác nhất</Text>
            </Group>
            <ul className='list-disc space-y-1 pl-5'>
              <li>
                <Text size='sm'>Hình ảnh phải là sản phẩm hoặc hóa đơn</Text>
              </li>
              <li>
                <Text size='sm'>Ảnh chụp hoặc ảnh tải lên phải rõ nét và rõ tên sản phẩm</Text>
              </li>
              <li>
                <Text size='sm'>Sử dụng góc chụp phù hợp, không bị mờ, chói lóa</Text>
              </li>
            </ul>
          </div>

          <Dropzone
            onDrop={handleDrop}
            maxFiles={5}
            accept={['image/png', 'image/jpeg', 'image/jpg', 'image/webp']}
            className='rounded-lg border-2 border-dashed p-8'
          >
            <Group justify='center' gap='xl' style={{ minHeight: 100, pointerEvents: 'none' }}>
              <Dropzone.Accept>
                <IconUpload size={50} stroke={1.5} />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX size={50} stroke={1.5} />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IconPhoto size={50} stroke={1.5} />
              </Dropzone.Idle>

              <div className='text-center'>
                <Text size='md' inline>
                  Kéo thả hình ảnh vào đây hoặc <span className='text-blue-500'>tải ảnh lên</span>
                </Text>
                <Text size='sm' c='dimmed' inline mt={7}>
                  (Tối đa 5 hình ảnh)
                </Text>
              </div>
            </Group>
          </Dropzone>

          {files.length > 0 && (
            <div className='flex flex-wrap gap-4'>
              {files.map((file, index) => (
                <div key={index} className='relative'>
                  <Button
                    variant='filled'
                    color='red'
                    size='xs'
                    className='absolute -right-2 -top-2 z-10 h-6 w-6 min-w-0 rounded-full p-0'
                    onClick={() => removeFile(index)}
                  >
                    <IconX size={14} />
                  </Button>
                  <Image
                    src={file.preview || '/placeholder.svg'}
                    alt={`Preview ${index + 1}`}
                    width={100}
                    height={100}
                    className='rounded-lg border object-cover'
                  />
                </div>
              ))}
            </div>
          )}

          <Button fullWidth size='md' className='bg-blue-500 hover:bg-blue-600' onClick={() => {}}>
            Tìm kiếm
          </Button>
        </Stack>
      </Modal>
    </>
  );
}
