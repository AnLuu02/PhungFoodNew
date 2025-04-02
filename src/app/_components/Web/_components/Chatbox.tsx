'use client';

import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  Group,
  Paper,
  rem,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  UnstyledButton
} from '@mantine/core';
import { IconMicrophone, IconSend, IconSquareFilled } from '@tabler/icons-react';
import parse from 'html-react-parser';
import { useSession } from 'next-auth/react';
import { useEffect, useReducer, useRef, useState } from 'react';
import { NotifyError } from '~/app/lib/utils/func-handler/toast';

const initialState: any = {
  searchState: 'initial',
  transcript: ''
};

function reducer(state: any, action: any) {
  switch (action.type) {
    case 'START_RECORDING':
      return { ...state, searchState: 'recording', transcript: '' };
    case 'STOP_RECORDING':
      return { ...state, searchState: 'completed' };
    case 'SET_TRANSCRIPT':
      return { ...state, transcript: action.payload };
    default:
      return state;
  }
}

export default function Chatbox() {
  const { data: user } = useSession();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([
    { sender: 'Bot', text: 'Tôi là chatbox của PhungFood. Tôi có thể giúp gì cho bạn?' }
  ]);
  const [loading, setLoading] = useState(false);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const [stateRecord, dispatch] = useReducer(reducer, initialState);
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<any>(null);
  const audioChunksRef = useRef<Blob[]>([]);

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
    } catch (error) {
      NotifyError('Không có quyền truy cập microphone');
      dispatch({ type: 'RESET' });
    }
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();

    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }

    // Dừng tất cả tracks của microphone
    if (mediaRecorderRef.current?.stream) {
      mediaRecorderRef.current.stream.getTracks().forEach((track: any) => track.stop());
    }

    dispatch({ type: 'STOP_RECORDING' });
  };
  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
          top: scrollAreaRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    });
  };

  useEffect(() => {
    if (stateRecord.transcript) {
      setMessage(stateRecord.transcript);
    }
  }, [stateRecord.transcript]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    stopRecording();
    if (!message.trim()) return;
    setMessages(prev => [...prev, { sender: 'User', text: message }]);
    setLoading(true);
    scrollToBottom();
    setMessage('');

    try {
      const res = await fetch('/api/chatbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });

      const data = await res.json();
      setMessages(prev => [...prev, { sender: 'Bot', text: data.reply }]);
    } catch (error) {
      console.error('Lỗi gửi tin nhắn:', error);
      setMessages(prev => [...prev, { sender: 'Bot', text: 'Lỗi hệ thống, thử lại sau.' }]);
    }
    setLoading(false);
  };

  return (
    <Box
      w={{ base: 335, sm: 450, md: 450, lg: 450 }}
      h={{ base: 400, sm: 500, md: 500, lg: 500 }}
      className='flex flex-col overflow-hidden'
      bg='gray.1'
    >
      <UnstyledButton p={'xs'} bg={'green.9'}>
        <Group>
          <Avatar src={`/images/jpg/bot.jpg`} radius='xl' />

          <div style={{ flex: 1 }}>
            <Text size='md' fw={700} c={'white'}>
              Chat support
            </Text>

            <Text c={'white'} size='xs'>
              phungfood@contact.com
            </Text>
          </div>
        </Group>
      </UnstyledButton>
      <ScrollArea className='mb-4 flex-grow' scrollbarSize={7} viewportRef={scrollAreaRef}>
        <Box p='md' w={'100%'}>
          <Stack gap='md'>
            {messages.map((message, index) =>
              message.sender === 'Bot' ? (
                <Box maw={'86%'}>
                  <Paper
                    bg='white'
                    p='xs'
                    style={{
                      borderRadius: '16px 16px 16px 4px'
                    }}
                  >
                    <Text size='sm'>{parse(message.text)}</Text>
                  </Paper>
                  <Text size='xs' c='dimmed' ml={8} mt={4}>
                    Chat support
                  </Text>
                </Box>
              ) : (
                <Box ml='auto' w={'max-content'} maw={'86%'}>
                  <Paper
                    bg='grape.7'
                    c='white'
                    p='xs'
                    style={{
                      borderRadius: '16px 16px 4px 16px'
                    }}
                  >
                    <Text size='sm'>{parse(message.text)}</Text>
                  </Paper>
                  <Text size='xs' c='dimmed' mr={8} mt={4} ta='right'>
                    {user?.user?.name || 'User'}
                  </Text>
                </Box>
              )
            )}

            {loading && (
              <Box>
                <Group gap={4} justify='center' h={rem(24)} w={'max-content'} pl={'xs'}>
                  {[0, 1, 2].map((i: number) => (
                    <Box
                      key={i}
                      className='typing-dot'
                      w={rem(6)}
                      h={rem(6)}
                      style={{
                        backgroundColor: '#868e96',
                        borderRadius: '50%',
                        animation: 'bounce 1s infinite',
                        animationDelay: `${i * 0.15}s`
                      }}
                    />
                  ))}
                </Group>
                <Text size='xs' c='dimmed' ml={8} mt={4}>
                  Chat support đang nhập...
                </Text>
              </Box>
            )}
          </Stack>
        </Box>
      </ScrollArea>
      <Stack p={'xs'} gap={2}>
        {stateRecord.searchState === 'recording' && (
          <>
            <Center>
              <Text size='xs' c='dimmed' fs={'italic'}>
                Đang lắng nghe. . .
              </Text>
            </Center>
          </>
        )}
        <Flex align={'center'} gap={'xs'} justify={'space-between'}>
          {(stateRecord.searchState === 'initial' || stateRecord.searchState === 'completed') && (
            <>
              <Button variant='transparent' onClick={startRecording} disabled={loading} p={0}>
                <IconMicrophone size={20} />
              </Button>
            </>
          )}

          {stateRecord.searchState === 'recording' && (
            <>
              <Button variant='transparent' disabled={loading} p={0} onClick={stopRecording}>
                <IconSquareFilled color='red' size={20} />
              </Button>
            </>
          )}
          <TextInput
            radius={'xl'}
            size='xs'
            className='flex-grow'
            placeholder='Type your message...'
            disabled={loading}
            value={message}
            onChange={event => setMessage(event.currentTarget.value)}
            onKeyPress={event => {
              if (event.key === 'Enter') {
                sendMessage();
              }
            }}
          />
          <Button onClick={sendMessage} variant='transparent' disabled={loading} p={0}>
            <IconSend size={20} />
          </Button>
        </Flex>
      </Stack>
    </Box>
  );
}
