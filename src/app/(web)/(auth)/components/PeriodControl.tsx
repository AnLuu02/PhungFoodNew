'use client';

import { Button, Divider, Flex } from '@mantine/core';
import { IconCircleDashedCheck, IconMail, IconShield } from '@tabler/icons-react';

export default function PeriodControl({ period }: any) {
  return (
    <>
      <Flex align={'center'} justify={'space-between'} w={'100%'}>
        <Button
          variant='transparent'
          className={`text-black ${period === 'email' || period === 'reset' || period === 'verify' ? 'font-bold text-mainColor' : ''}`}
          size='sm'
          p={0}
          m={0}
          leftSection={<IconMail size={24} stroke={1.5} />}
        >
          Email
        </Button>
        <Divider w={25} size={'sm'} color={period === 'reset' || period === 'verify' ? '#008B4B' : ''} />
        <Button
          variant='transparent'
          className={`text-black ${period === 'reset' || period === 'verify' ? 'font-bold text-mainColor' : ''}`}
          size='sm'
          leftSection={<IconShield size={24} stroke={1.5} />}
          p={0}
          m={0}
        >
          Xác thực
        </Button>
        <Divider color={period === 'reset' ? '#008B4B' : ''} w={25} size={'sm'} />

        <Button
          variant='transparent'
          className={`text-black ${period === 'reset' ? 'font-bold text-mainColor' : ''}`}
          size='sm'
          p={0}
          m={0}
          leftSection={<IconCircleDashedCheck size={24} stroke={1.5} />}
        >
          Kích hoạt
        </Button>
      </Flex>
    </>
  );
}
