'use client';

import { ActionIcon, Box, Button, Flex, Group, List, Modal, Stack, Text, Title } from '@mantine/core';
import { IconDots, IconLighter, IconMicrophone, IconSquare, IconTrash, IconVolume } from '@tabler/icons-react';
import Link from 'next/link';
import { useEffect, useReducer, useRef, useState } from 'react';
import { NotifyError } from '~/lib/func-handler/toast';

const initialState: any = {
  searchState: 'initial',
  transcript: '',
  recordingTime: 0,
  audioUrl: null
};

function reducer(state: any, action: any) {
  switch (action.type) {
    case 'START_RECORDING':
      return { ...state, searchState: 'recording', transcript: '', recordingTime: 0, audioUrl: null };
    case 'STOP_RECORDING':
      return { ...state, searchState: 'completed' };
    case 'RESET':
      return initialState;
    case 'SET_TRANSCRIPT':
      return { ...state, transcript: action.payload };
    case 'SET_AUDIO_URL':
      return { ...state, audioUrl: action.payload };
    case 'INCREMENT_TIME':
      return { ...state, recordingTime: state.recordingTime + 1 };
    default:
      return state;
  }
}

export default function VoiceSearchModal() {
  const [opened, setOpened] = useState<any>(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<any>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (state.searchState === 'recording') {
      timerRef.current = setInterval(() => dispatch({ type: 'INCREMENT_TIME' }), 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [state.searchState]);

  const startRecording = async () => {
    if (!('webkitSpeechRecognition' in window) || !navigator.mediaDevices) {
      alert('Trình duyệt không hỗ trợ chức năng này!');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event: any) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data as Blob);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        if (state.audioUrl) {
          URL.revokeObjectURL(state.audioUrl);
        }
        dispatch({ type: 'SET_AUDIO_URL', payload: URL.createObjectURL(audioBlob) });
      };

      dispatch({ type: 'START_RECORDING' });
      recognitionRef.current = new (window as any).webkitSpeechRecognition();
      recognitionRef.current.lang = 'vi-VN';
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        dispatch({ type: 'SET_TRANSCRIPT', payload: event.results[0][0].transcript });
      };
      recognitionRef.current.start();
      mediaRecorderRef.current.start();
    } catch {
      NotifyError('Không có quyền truy cập microphone');
      dispatch({ type: 'RESET' });
    }
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();

    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }

    if (mediaRecorderRef.current?.stream) {
      mediaRecorderRef.current.stream.getTracks().forEach((track: any) => track.stop());
    }

    dispatch({ type: 'STOP_RECORDING' });
  };

  const resetRecording = () => {
    if (state.audioUrl) {
      URL.revokeObjectURL(state.audioUrl);
    }

    if (mediaRecorderRef.current?.stream) {
      mediaRecorderRef.current.stream.getTracks().forEach((track: any) => track.stop());
    }

    audioChunksRef.current = [];
    dispatch({ type: 'RESET' });
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
        onClose={() => {
          setOpened(false);
          resetRecording();
          audioChunksRef.current = [];
        }}
        title={
          <Title order={3} className='font-quicksand'>
            Tìm kiếm bằng giọng nói
          </Title>
        }
        size='md'
        radius={'lg'}
        padding='lg'
      >
        <Stack>
          <Box className='space-y-2 rounded-lg bg-amber-50 p-2'>
            <Group>
              <IconLighter size={24} className='text-amber-500' />
              <Text fw={500}>Mẹo để tìm kiếm chính xác hơn</Text>
            </Group>
            <List size='sm' mt={8} spacing='xs' p={2}>
              <List.Item>Nói to, rõ ràng, không bị nhiễu âm.</List.Item>
              <List.Item>Đọc đúng tên sản phẩm hoặc thành phần chính.</List.Item>
            </List>
          </Box>

          <Stack align='center' gap='lg' py={'md'}>
            {state.searchState === 'initial' && (
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

            {state.searchState === 'recording' && (
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
                        w={4}
                        h={Math.random() * 20 + 10}
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
                <Text c='dimmed'>{formatTime(state.recordingTime)}</Text>
              </>
            )}

            {state.searchState === 'completed' && (
              <>
                <Text c='dimmed'>Bạn đã nói:</Text>
                <Text fw={600} size='lg' color='blue'>
                  "{state.transcript}"
                </Text>
                <Text c='dimmed'>Nghe lại</Text>
                <Flex justify='space-between' align='center' w='100%' maw={300}>
                  <ActionIcon
                    size='xl'
                    radius='xl'
                    color='blue'
                    variant='light'
                    onClick={() => {
                      if (state.audioUrl) {
                        new Audio(state.audioUrl).play();
                      }
                    }}
                  >
                    <IconVolume size={20} />
                  </ActionIcon>
                  {state.audioUrl && (
                    <audio controls hidden>
                      <source src={state.audioUrl} type='audio/wav' />
                      Trình duyệt của bạn không hỗ trợ nghe lại.
                    </audio>
                  )}

                  <IconDots size={24} color='var(--mantine-color-blue-6)' />

                  <ActionIcon size='xl' radius='xl' color='gray' variant='light' onClick={resetRecording}>
                    <IconTrash size={20} />
                  </ActionIcon>
                </Flex>
                <Text c='dimmed'>{formatTime(state.recordingTime)}</Text>
              </>
            )}
          </Stack>

          <Link href={`/thuc-don?s=${state.transcript}`}>
            <Button
              fullWidth
              size='md'
              color={state.searchState === 'completed' ? 'blue' : 'gray'}
              disabled={state.searchState !== 'completed'}
              onClick={() => {
                setOpened(false);
                resetRecording();
              }}
            >
              Tìm kiếm
            </Button>
          </Link>
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
