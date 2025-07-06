'use client';

import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  Group,
  Loader,
  Menu,
  Paper,
  rem,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  UnstyledButton
} from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import {
  IconDotsVertical,
  IconMicrophone,
  IconRobot,
  IconSend,
  IconSquareFilled,
  IconTrash,
  IconUser
} from '@tabler/icons-react';
import { useEffect, useReducer, useRef, useState } from 'react';
import { NotifyError } from '~/lib/func-handler/toast';
interface Message {
  sender: 'Bot' | 'User';
  text: string;
  timestamp: string;
}
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

const TypingIndicator = () => (
  <Group gap={4} w='max-content'>
    {[0, 1, 2].map(i => (
      <Box
        key={i}
        w={rem(8)}
        h={rem(8)}
        bg='gray.5'
        style={{
          borderRadius: '50%',
          animation: 'bounce 1.4s infinite ease-in-out',
          animationDelay: `${i * 0.16}s`
        }}
      />
    ))}
  </Group>
);

export default function Chatbox() {
  const [messages, setMessages, resetMessages] = useLocalStorage<Message[]>({
    key: 'chatbox-messages',
    defaultValue: [
      {
        sender: 'Bot',
        text: 'Tôi là chatbox của PhungFood. Tôi có thể giúp gì cho bạn?',
        timestamp: new Date().toISOString()
      }
    ]
  });

  const messageRef = useRef('');
  const inputRef = useRef<HTMLInputElement>(null);

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
      messageRef.current = stateRecord.transcript;
      inputRef.current!.value = stateRecord.transcript;
    }
  }, [stateRecord.transcript]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    stopRecording();
    if (!messageRef.current.trim()) return;
    setMessages([...messages, { sender: 'User', text: messageRef.current, timestamp: new Date().toISOString() }]);
    setLoading(true);
    scrollToBottom();
    if (inputRef.current) {
      inputRef.current.value = '';
    }

    try {
      const res = await fetch('/api/chatbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageRef.current })
      });
      messageRef.current = '';

      const data = await res.json();
      setMessages(prev => [...prev, { sender: 'Bot', text: data.reply, timestamp: new Date().toISOString() }]);
    } catch (error) {
      console.error('Lỗi gửi tin nhắn:', error);
      setMessages(prev => [
        ...prev,
        { sender: 'Bot', text: 'Lỗi hệ thống, thử lại sau.', timestamp: new Date().toISOString() }
      ]);
    }
    setLoading(false);
  };

  return (
    <Box
      w={{ base: 335, sm: 450, md: 450, lg: 400 }}
      h={{ base: 400, sm: 500, md: 500, lg: 500 }}
      className='dark:bg-dark-card flex flex-col overflow-hidden bg-gray-100'
    >
      <UnstyledButton
        p={'xs'}
        style={{
          background: 'linear-gradient(135deg, #228be6 0%, #7048e8 100%)'
        }}
      >
        <Flex align={'center'} gap={'xs'} justify={'space-between'}>
          <Group>
            <Avatar src={`/images/jpg/bot.jpg`} radius='xl' />

            <div style={{ flex: 1 }}>
              <Text size='md' fw={700} className='text-white'>
                Chat support
              </Text>

              <Text className='text-white' size='xs'>
                phungfood@contact.com
              </Text>
            </div>
          </Group>
          <Menu width={200} shadow='md' zIndex={1000000} position='bottom-end'>
            <Menu.Target>
              <ActionIcon variant='transparent' size={30} color='white'>
                <IconDotsVertical color='white' size={20} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item leftSection={<IconTrash size={14} color='red' />} onClick={() => resetMessages()}>
                Xóa đoạn chat
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Flex>
      </UnstyledButton>
      <ScrollArea className='mb-4 flex-grow' scrollbarSize={7} viewportRef={scrollAreaRef}>
        <Box p='md' w={'100%'}>
          <Stack gap='md'>
            {messages.map((message, index) => (
              <Flex
                key={index}
                direction={message.sender === 'User' ? 'row-reverse' : 'row'}
                align='flex-start'
                gap='sm'
              >
                <Avatar size='sm' radius='xl' color={message.sender === 'Bot' ? 'blue' : 'violet'} variant='filled'>
                  {message.sender === 'Bot' ? <IconRobot size='1rem' /> : <IconUser size='1rem' />}
                </Avatar>

                <Box maw='80%'>
                  <Paper
                    p='sm'
                    radius='lg'
                    style={{
                      background:
                        message.sender === 'Bot' ? 'white' : 'linear-gradient(135deg, #4dabf7 0%, #9775fa 100%)',
                      color: message.sender === 'Bot' ? '#000' : '#fff',
                      borderRadius: message.sender === 'Bot' ? '1rem 1rem 1rem 0.25rem' : '1rem 1rem 0.25rem 1rem'
                    }}
                  >
                    <Text size='sm' c={message.sender === 'Bot' ? 'dark' : 'white'} style={{ wordBreak: 'break-word' }}>
                      {message.text}
                    </Text>
                  </Paper>
                  <Text size='xs' c='dimmed' ta={message.sender === 'User' ? 'right' : 'left'} mt={4} px='sm'>
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Text>
                </Box>
              </Flex>
            ))}

            {loading && (
              <Flex align='flex-start' gap='sm'>
                <Avatar size='sm' radius='xl' color='blue' variant='filled'>
                  <IconRobot size='1rem' />
                </Avatar>
                <Box>
                  <Paper p='sm' radius='lg' bg='gray.1' style={{ borderRadius: '1rem 1rem 1rem 0.25rem' }}>
                    <TypingIndicator />
                  </Paper>
                  <Text size='xs' c='dimmed' mt={4} px='sm'>
                    AI Assistant is typing...
                  </Text>
                </Box>
              </Flex>
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
            ref={inputRef}
            radius={'xl'}
            size='xs'
            className='flex-grow'
            placeholder='Type your message...'
            disabled={loading}
            rightSection={
              <ActionIcon
                onClick={sendMessage}
                disabled={loading || !inputRef.current}
                variant='gradient'
                gradient={{ from: 'blue', to: 'violet', deg: 45 }}
                size='sm'
                radius='xl'
                style={{ marginRight: rem(4) }}
              >
                {loading ? <Loader size='xs' color='white' /> : <IconSend size='1rem' />}
              </ActionIcon>
            }
            onChange={e => {
              messageRef.current = e.target.value;
            }}
            onKeyPress={event => {
              if (event.key === 'Enter') {
                sendMessage();
              }
            }}
          />
        </Flex>
      </Stack>
    </Box>
  );
}
