'use client';
import {
  Avatar,
  Box,
  Button,
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
import { IconMicrophone, IconSend } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
const hintAnswers = [
  'How can I track my order?',
  'What are your return policies?',
  'Do you offer international shipping?',
  'How can I contact customer support?'
];

export default function Chatbox() {
  const { data: user } = useSession();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([
    { sender: 'Bot', text: 'Tôi là chatbox của PhungFood. Tôi có thể giúp gì cho bạn?' }
  ]);
  const [loading, setLoading] = useState(false);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Hàm scroll tới cuối
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

  // Gọi `scrollToBottom` mỗi khi messages thay đổi
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
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
    <Box className='flex h-[400px] w-[300px] flex-col overflow-hidden'>
      <UnstyledButton p={'xs'} bg={'green.9'}>
        <Group>
          <Avatar
            src={`https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png`}
            radius='xl'
          />

          <div style={{ flex: 1 }}>
            <Text size='md' fw={700} c={'white'}>
              Chat support
            </Text>

            <Text c={'white'} size='xs'>
              hspoonlicker@outlook.com
            </Text>
          </div>
        </Group>
      </UnstyledButton>
      <ScrollArea className='mb-4 flex-grow' scrollbarSize={7} viewportRef={scrollAreaRef}>
        {/* Chat Content */}
        <Box bg='gray.0' p='md'>
          <Stack gap='md'>
            {messages.map((message, index) =>
              message.sender === 'Bot' ? (
                <Box>
                  <Paper
                    bg='gray.1'
                    p='xs'
                    style={{
                      maxWidth: rem(280),
                      borderRadius: '16px 16px 16px 4px'
                    }}
                  >
                    <Text size='sm'>{message.text}</Text>
                  </Paper>
                  <Text size='xs' c='dimmed' ml={8} mt={4}>
                    BOT
                  </Text>
                </Box>
              ) : (
                <Box ml='auto'>
                  <Paper
                    bg='grape.7'
                    c='white'
                    p='xs'
                    style={{
                      maxWidth: rem(280),
                      borderRadius: '16px 16px 4px 16px'
                    }}
                  >
                    <Text size='sm'>{message.text}</Text>
                  </Paper>
                  <Text size='xs' c='dimmed' mr={8} mt={4} ta='right'>
                    {user?.user?.name || 'Operator'}
                  </Text>
                </Box>
              )
            )}

            {/* Typing Indicator */}
            {loading && (
              <Box>
                <Group gap={4} justify='center' h={rem(24)} w={'max-content'} pl={'xs'}>
                  {[0, 1, 2].map(i => (
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
                  BOT đang nhập...
                </Text>
              </Box>
            )}
          </Stack>
        </Box>
      </ScrollArea>
      <Flex align={'center'} gap={'xs'} p={'xs'} justify={'space-between'}>
        <Button variant='transparent' size='md' p={0}>
          😄
        </Button>
        <Button variant='transparent' size='md' p={0}>
          <IconMicrophone size={20} />
        </Button>
        <TextInput
          radius={'xl'}
          size='xs'
          className='flex-grow'
          placeholder='Type your message...'
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
    </Box>
  );
}
