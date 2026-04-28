import { Box, Button, Group } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';

export const dynamic = 'force-static';

export default function NotFound() {
  return (
    <main className='flex min-h-screen items-center justify-center px-4'>
      <Box className='w-full max-w-2xl space-y-8 text-center'>
        <Box className='space-y-4'>
          <Group gap={2} justify='center' align='center'>
            <Box className='animate-shake text-9xl font-bold text-mainColor opacity-30'>4</Box>
            <Box className='animate-shake text-9xl font-bold text-mainColor opacity-30 [animation-delay:0.25s]'>0</Box>
            <Box className='animate-shake text-9xl font-bold text-mainColor opacity-30 [animation-delay:0.5s]'>4</Box>
          </Group>
          <h1 className='text-foreground text-balance text-5xl font-bold md:text-6xl'>Page Not Found</h1>
          <p className='mx-auto max-w-md text-xl leading-relaxed'>
            Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
          </p>
        </Box>

        <Box className='flex justify-center gap-2 py-4 sm:py-8'>
          <Box className='h-2 w-2 rounded-full bg-mainColor opacity-60'></Box>
          <Box className='h-2 w-2 rounded-full bg-mainColor opacity-40'></Box>
          <Box className='h-2 w-2 rounded-full bg-mainColor opacity-20'></Box>
        </Box>

        <Box className='flex flex-col justify-center gap-4 sm:flex-row sm:pt-4'>
          <Link href='/'>
            <Button leftSection={<IconArrowLeft className='h-5 w-5' />} size='lg'>
              Back to Home
            </Button>
          </Link>
          <Link href='/lien-he'>
            <Button variant='transparent' leftSection={<IconArrowLeft className='h-5 w-5' />} size='lg'>
              Contact Support
            </Button>
          </Link>
        </Box>

        <Box className='border-border border-t sm:pt-8'>
          <p className='text-sm'>
            Need help? Try searching or{' '}
            <Link href='/' className='font-semibold text-mainColor hover:underline'>
              return to the homepage
            </Link>
          </p>
        </Box>
      </Box>
    </main>
  );
}
