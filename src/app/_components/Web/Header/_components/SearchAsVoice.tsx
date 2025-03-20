'use client';

import { ActionIcon, Box, Button, Flex, Group, List, Modal, Stack, Text, Title, rem } from '@mantine/core';
import { IconDots, IconLighter, IconMicrophone, IconPlayerPlay, IconSquare, IconTrash } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';

export default function VoiceSearchModal() {
  const [opened, setOpened] = useState(false);
  const [searchState, setSearchState] = useState<'initial' | 'recording' | 'completed'>('initial');
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (searchState === 'recording') {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [searchState]);

  const startRecording = () => {
    setSearchState('recording');
    setRecordingTime(0);
  };

  const stopRecording = () => {
    setSearchState('completed');
  };

  const resetRecording = () => {
    setSearchState('initial');
    setRecordingTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <ActionIcon variant='subtle' color='gray' onClick={() => setOpened(true)}>
        <IconMicrophone size={18} />
      </ActionIcon>

      <Modal
        opened={opened}
        centered
        onClose={() => setOpened(false)}
        title={<Title order={3}>Tìm kiếm với giọng nói</Title>}
        size='md'
        radius={'lg'}
        padding='lg'
      >
        <Stack>
          {/* Tips section */}

          <Box className='space-y-2 rounded-lg bg-amber-50 p-2'>
            <Group>
              <IconLighter size={24} className='text-amber-500' />
              <Text fw={500}>Mẹo để tìm kiếm sản phẩm chính xác nhất</Text>
            </Group>
            <List size='sm' mt={8} spacing='xs' p={2}>
              <List.Item>Nói to, rõ ràng, không tạp âm.</List.Item>
              <List.Item>Đọc đúng tên sản phẩm hoặc thành phần, tránh từ ngữ mơ hồ.</List.Item>
            </List>
          </Box>

          <Stack align='center' gap='lg' py={'md'}>
            {searchState === 'initial' && (
              <>
                <Text c='dimmed'>Ví dụ: "Vitamin C"</Text>
                <ActionIcon size='xl' radius='xl' variant='light' color='blue' onClick={startRecording}>
                  <IconMicrophone size={28} />
                </ActionIcon>
                <Text c='dimmed' size='sm'>
                  Nhấn để bắt đầu ghi âm
                </Text>
              </>
            )}

            {searchState === 'recording' && (
              <>
                <Text c='dimmed'>Đang ghi âm giọng nói của bạn</Text>
                <Flex justify='space-between' align='center' w='100%' maw={300}>
                  <ActionIcon size='xl' radius='xl' color='red' variant='filled' onClick={stopRecording}>
                    <IconSquare size={20} />
                  </ActionIcon>

                  <Flex gap={4} h={40} align='flex-end'>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Box
                        key={i}
                        w={rem(4)}
                        h={rem(Math.random() * 20 + 10)}
                        bg='var(--mantine-color-blue-6)'
                        style={{
                          animation: 'pulse 1s infinite',
                          animationDelay: `${i * 0.15}s`
                        }}
                      />
                    ))}
                  </Flex>

                  <ActionIcon size='xl' radius='xl' color='gray' variant='light' onClick={resetRecording}>
                    <IconTrash size={20} />
                  </ActionIcon>
                </Flex>
                <Text c='dimmed'>{formatTime(recordingTime)}</Text>
              </>
            )}

            {searchState === 'completed' && (
              <>
                <Text c='dimmed'>Nghe lại</Text>
                <Flex justify='space-between' align='center' w='100%' maw={300}>
                  <ActionIcon size='xl' radius='xl' color='blue' variant='light' onClick={() => {}}>
                    <IconPlayerPlay size={20} />
                  </ActionIcon>

                  <IconDots size={24} color='var(--mantine-color-blue-6)' />

                  <ActionIcon size='xl' radius='xl' color='gray' variant='light' onClick={resetRecording}>
                    <IconTrash size={20} />
                  </ActionIcon>
                </Flex>
                <Text c='dimmed'>{formatTime(recordingTime)}</Text>
              </>
            )}
          </Stack>

          <Button
            fullWidth
            size='md'
            onClick={
              searchState === 'initial' ? startRecording : searchState === 'recording' ? stopRecording : () => {}
            }
            color={searchState === 'completed' ? 'blue' : 'gray'}
            disabled={searchState !== 'completed'}
          >
            Tìm kiếm
          </Button>
        </Stack>

        <style jsx global>{`
          @keyframes pulse {
            0%,
            100% {
              transform: scaleY(1);
            }
            50% {
              transform: scaleY(1.5);
            }
          }
        `}</style>
      </Modal>
    </>
  );
}
