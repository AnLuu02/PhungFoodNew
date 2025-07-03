'use client';

import { Button, Container, Group, Text, Title } from '@mantine/core';
import { IconHome } from '@tabler/icons-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Container size={420} my={40}>
      <Title ta='center' className='text-9xl font-extrabold'>
        404
      </Title>
      <Text c='dimmed' size='lg' ta='center' mt='xl'>
        Oops! Page Not Found
      </Text>
      <Text size='lg' ta='center' mt='xl'>
        The page you're looking for doesn't exist or has been moved.
      </Text>
      <Link href='/'>
        <Group justify='center' mt='xl'>
          <Button size='md' leftSection={<IconHome size={20} />}>
            Về trang chủ
          </Button>
        </Group>
      </Link>
    </Container>
  );
}
