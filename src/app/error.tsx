'use client';

import { Box, Button, Group, Stack, Text } from '@mantine/core';
import { IconHeadphones, IconHome, IconReload } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import BButton from '~/components/Button/Button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const router = useRouter();

  useEffect(() => {
    console.error('Error:', error);
  }, [error]);

  return (
    <main className='flex min-h-screen items-center justify-center px-4'>
      <div className='max-w-lg text-center'>
        {/* Error Code */}
        <div className='relative'>
          <Group gap={2} justify='center' align='center'>
            <Box className='animate-shake text-8xl font-bold text-red-500 md:text-9xl'>E</Box>
            <Box className='animate-shake text-8xl font-bold text-red-500 [animation-delay:0.25s] md:text-9xl'>r</Box>
            <Box className='animate-shake text-8xl font-bold text-red-500 [animation-delay:0.5s] md:text-9xl'>r</Box>
            <Box className='animate-shake text-8xl font-bold text-red-500 [animation-delay:0.75s] md:text-9xl'>o</Box>
            <Box className='animate-shake text-8xl font-bold text-red-500 [animation-delay:1s] md:text-9xl'>r</Box>
          </Group>
        </div>

        {/* Error Message */}
        <Stack gap='xs'>
          <h3 className='text-foreground text-balance text-3xl font-bold'>Something Went Wrong</h3>

          <Text className='text-lg text-gray-600'>Sorry, an unexpected error occurred. We're working to fix it.</Text>
        </Stack>

        {/* Error Details (Minimal) */}
        <div className='rounded-lg border border-gray-200 bg-gray-50 p-4'>
          <Text className='text-sm font-medium text-gray-700'>Error Message:</Text>
          <Text className='mt-1 truncate text-sm text-red-600'>{error?.message || 'Unknown error occurred'}</Text>
        </div>

        {/* Action Buttons */}
        <Group justify='center' gap='md' className='pt-4' wrap='nowrap'>
          <BButton size='md' onClick={reset} leftSection={<IconReload size={20} />}>
            Try Again
          </BButton>

          <BButton size='md' variant='outline' leftSection={<IconHome size={20} />}>
            Back to Home
          </BButton>
        </Group>

        {/* Support Section */}
        <div className='mt-8 border-t border-gray-200 pt-6'>
          <Stack gap='md'>
            <Button
              component='a'
              href='mailto:anluu099@gmail.com'
              variant='subtle'
              leftSection={<IconHeadphones size={20} />}
              className='text-orange-600 hover:bg-orange-50 hover:text-orange-700'
            >
              Contact Support
            </Button>

            <Text size='sm' c='dimmed'>
              Need help? Try refreshing the page or return to the homepage
            </Text>
          </Stack>
        </div>
      </div>
    </main>
  );
}
