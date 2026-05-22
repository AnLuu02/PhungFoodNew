import { Box, Group } from '@mantine/core';

export function TypingIndicator() {
  return (
    <Group gap={4}>
      <Box className='h-2 w-2 animate-bounce rounded-full bg-gray-400' />
      <Box className='h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:120ms]' />
      <Box className='h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:240ms]' />
    </Group>
  );
}
