'use client';

import { ActionIcon, Group, Text } from '@mantine/core';
import { IconBrandFacebook, IconBrandPinterest, IconBrandTwitter } from '@tabler/icons-react';

export function SocialShare() {
  return (
    <Group gap='xs'>
      <Text size='md' fw={700}>
        Chia sẻ
      </Text>
      <ActionIcon color='blue' radius='xl' size={'lg'}>
        <IconBrandFacebook />
      </ActionIcon>
      <ActionIcon color='red' radius='xl' size={'lg'}>
        <IconBrandPinterest />
      </ActionIcon>
      <ActionIcon color='blue' radius='xl' size={'lg'}>
        <IconBrandTwitter />
      </ActionIcon>
    </Group>
  );
}
