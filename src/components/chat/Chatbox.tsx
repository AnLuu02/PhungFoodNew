'use client';

import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Group,
  Menu,
  Paper,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Tooltip
} from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import {
  IconChevronRight,
  IconDotsVertical,
  IconHistory,
  IconMessageChatbot,
  IconRobot,
  IconSend,
  IconSparkles,
  IconTrash,
  IconUser,
  IconX
} from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import { FoodCard } from './FoodCardChatBox';
import { TypingIndicator } from './TypingIndicator';

export type ChatMessage = {
  sender: 'User' | 'Bot';
  text: string;
  timestamp: string;
  products?: Product[];
  showMoreUrl?: string | null;
};

export type Product = {
  id: string;
  name: string;
  tag: string;
  price: number;
  discount?: number | null;
  finalPrice: number;
  image: string;
  url: string;
};

const QUICK_HINTS = [
  'Tư vấn món bán chạy',
  'Có món nào đang giảm giá không?',
  'Tôi muốn món ăn khoảng 50k',
  'Gợi ý món phù hợp cho 2 người'
];

function formatDateViVN(date: string) {
  return new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
}

export default function ModernChatbox() {
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const messageRef = useRef('');

  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useLocalStorage<ChatMessage[]>({
    key: 'phung-food-chatbox-messages',
    defaultValue: [
      {
        sender: 'Bot',
        text: 'Xin chào! Em là trợ lý AI của Phụng Food. Anh/chị muốn xem món hay cần em tư vấn gì ạ?',
        timestamp: new Date().toISOString(),
        products: [],
        showMoreUrl: null
      }
    ]
  });

  const hasOnlyWelcomeMessage = messages.length <= 1;

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollAreaRef.current?.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }, 80);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  const clearChat = () => {
    setMessages([
      {
        sender: 'Bot',
        text: 'Đoạn chat đã được làm mới. Anh/chị cần em tư vấn món gì ạ?',
        timestamp: new Date().toISOString(),
        products: [],
        showMoreUrl: null
      }
    ]);
  };

  const sendMessage = async (quickText?: string) => {
    const text = (quickText || messageRef.current).trim();

    if (!text || loading) return;

    messageRef.current = '';

    if (inputRef.current) {
      inputRef.current.value = '';
    }

    const userMessage: ChatMessage = {
      sender: 'User',
      text,
      timestamp: new Date().toISOString()
    };

    const nextMessages = [...messages, userMessage];

    setMessages([
      ...nextMessages,
      {
        sender: 'Bot',
        text: '',
        timestamp: new Date().toISOString(),
        products: [],
        showMoreUrl: null
      }
    ]);

    setLoading(true);

    try {
      const apiMessages = nextMessages.map(message => ({
        role: message.sender === 'User' ? 'user' : 'assistant',
        content: message.text
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: apiMessages
        })
      });

      if (!res.ok) {
        throw new Error('Request failed');
      }

      const data = await res.json();

      setMessages(prev => {
        const clone = [...prev];

        clone[clone.length - 1] = {
          sender: 'Bot',
          text: data.reply || 'Em chưa hiểu rõ ý anh/chị, mình hỏi lại giúp em nhé.',
          timestamp: new Date().toISOString(),
          products: Array.isArray(data.products) ? data.products : [],
          showMoreUrl: data.showMoreUrl || null
        };

        return clone;
      });
    } catch {
      setMessages(prev => {
        const clone = [...prev];

        clone[clone.length - 1] = {
          sender: 'Bot',
          text: 'Xin lỗi, hiện tại hệ thống đang lỗi. Anh/chị thử lại sau nhé.',
          timestamp: new Date().toISOString(),
          products: [],
          showMoreUrl: null
        };

        return clone;
      });
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  return (
    <Flex
      direction='column'
      w={{ base: 360, xs: 380 }}
      h={{ base: 560 }}
      className='overflow-hidden border border-white/60 bg-white shadow-2xl shadow-black/10 dark:border-zinc-800 dark:bg-zinc-950'
    >
      <Box h={80} className='relative overflow-hidden bg-cardAdmin bg-gradient-to-br from-mainColor to-subColor p-4'>
        <Flex align='center' justify='space-between' gap='sm'>
          <Group gap='sm' align='center' justify='space-between'>
            <Box className='relative'>
              <Avatar src='/images/jpg/bot.jpg' radius='xl' size={46} />
              <Box className='absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-400' />
            </Box>

            <Box className='text-white'>
              <Group gap={6}>
                <Text size='md' fw={800}>
                  Trợ lí AI
                </Text>
                <IconSparkles size={15} />
              </Group>

              <Text size='xs' className='text-white/85'>
                Online · Phụng Food Assistant
              </Text>
            </Box>
          </Group>

          <Menu width={210} shadow='md' zIndex={1000000} position='bottom-end'>
            <Menu.Target>
              <ActionIcon variant='subtle' radius='xl' color='white'>
                <IconDotsVertical size={20} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Tuỳ chọn chat</Menu.Label>

              <Menu.Item leftSection={<IconHistory size={15} />}>Lưu tạm trên thiết bị</Menu.Item>

              <Menu.Item color='red' leftSection={<IconTrash size={15} />} onClick={clearChat}>
                Xóa lịch sử chat
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Flex>
      </Box>

      <ScrollArea
        flex={1}
        className='flex-grow bg-gradient-to-b from-orange-50/50 to-gray-50 dark:from-zinc-950 dark:to-zinc-900'
        scrollbarSize={6}
        viewportRef={scrollAreaRef}
      >
        <Box p='md'>
          <Stack gap='md'>
            {messages.map((message, index) => (
              <Flex
                key={index}
                direction={message.sender === 'User' ? 'row-reverse' : 'row'}
                align='flex-start'
                gap='sm'
              >
                <Avatar
                  size='sm'
                  radius='xl'
                  className={message.sender === 'Bot' ? 'bg-mainColor shadow-md' : 'bg-subColor shadow-md'}
                >
                  {message.sender === 'Bot' ? (
                    <IconRobot size='1rem' className='text-white' />
                  ) : (
                    <IconUser size='1rem' className='text-black' />
                  )}
                </Avatar>

                <Box maw='82%' className='min-w-0'>
                  <Paper
                    p='sm'
                    shadow='xs'
                    className={
                      message.sender === 'Bot'
                        ? 'rounded-[18px] rounded-bl-[5px] bg-white text-zinc-800 dark:bg-zinc-800 dark:text-white'
                        : 'rounded-[18px] rounded-br-[5px] bg-gradient-to-br from-mainColor to-subColor text-white'
                    }
                  >
                    {message.text ? (
                      <Text size='sm' className='whitespace-pre-wrap leading-relaxed'>
                        {message.text}
                      </Text>
                    ) : (
                      <TypingIndicator />
                    )}
                  </Paper>

                  {message.sender === 'Bot' &&
                    message.products?.map(product => <FoodCard key={product.id} product={product} />)}

                  {message.sender === 'Bot' && message.showMoreUrl && (
                    <Button component='a' href={message.showMoreUrl} target='_blank' size='xs' fullWidth my={'xs'}>
                      Xem thêm món phù hợp
                      <IconChevronRight size={16} />
                    </Button>
                  )}

                  <Text size='10px' c='dimmed' ta={message.sender === 'User' ? 'right' : 'left'} mt={5} px='xs'>
                    {formatDateViVN(message.timestamp)}
                  </Text>
                </Box>
              </Flex>
            ))}

            {hasOnlyWelcomeMessage && (
              <>
                <Divider label='Gợi ý nhanh' labelPosition='center' />

                <Group gap='xs'>
                  {QUICK_HINTS.map(hint => (
                    <Button
                      key={hint}
                      size='xs'
                      radius='xl'
                      variant='light'
                      color='orange'
                      leftSection={<IconMessageChatbot size={14} />}
                      onClick={() => sendMessage(hint)}
                      disabled={loading}
                    >
                      {hint}
                    </Button>
                  ))}
                </Group>
              </>
            )}
          </Stack>
        </Box>
      </ScrollArea>

      <Box className='border-t border-gray-100 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950'>
        <Flex align='center' gap='xs'>
          <TextInput
            ref={inputRef}
            radius='xl'
            size='sm'
            className='flex-grow'
            placeholder='Nhập tin nhắn...'
            disabled={loading}
            onChange={e => {
              messageRef.current = e.target.value;
            }}
            onKeyDown={event => {
              if (event.key === 'Enter') {
                sendMessage();
              }
            }}
          />

          <Tooltip label='Gửi tin nhắn'>
            <ActionIcon
              onClick={() => sendMessage()}
              disabled={loading}
              size={38}
              radius='xl'
              loading={loading}
              className='bg-mainColor text-white transition hover:bg-subColor hover:text-black'
            >
              {loading ? <IconX size='1rem' /> : <IconSend size='1rem' />}
            </ActionIcon>
          </Tooltip>
        </Flex>

        <Text size='10px' c='dimmed' ta='center' mt={6}>
          Nội dung chat được lưu tạm trên trình duyệt của bạn
        </Text>
      </Box>
    </Flex>
  );
}
