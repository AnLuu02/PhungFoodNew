'use client';
import { ActionIcon, Box, Group, NumberInput, Paper, Text, Tooltip } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import Image from 'next/image';
import { formatPriceLocaleVi } from '~/lib/FuncHandler/Format';

interface CartItemProps {
  image: string;
  name: string;
  price: number;
  quantity: number;
  onQuantityChange: (value: number) => void;
  onDelete: () => void;
}

export default function CartItemFastMenu({ image, name, price, quantity, onQuantityChange, onDelete }: CartItemProps) {
  return (
    <Group wrap='nowrap' className='w-full gap-4 p-4'>
      <Paper radius='md' w={80} h={80}>
        <Image
          loading='lazy'
          src={image || '/images/jpg/empty-300x240.jpg'}
          alt={name}
          width={80}
          height={80}
          className='rounded-md object-cover'
        />
      </Paper>

      <Box className='flex-grow'>
        <Group justify='space-between' wrap='nowrap'>
          <Tooltip label={name}>
            <Text size='sm' fw={700} lineClamp={1}>
              {name || 'Đang cập nhật'}
            </Text>
          </Tooltip>
          <ActionIcon variant='subtle' color='red' onClick={onDelete} className='hover:bg-red-50'>
            <IconTrash size={16} />
          </ActionIcon>
        </Group>

        <Group wrap='nowrap' gap='xs'>
          <NumberInput
            label={
              <Text size='xs' c='dimmed'>
                Số lượng
              </Text>
            }
            clampBehavior='strict'
            value={quantity}
            onChange={value => onQuantityChange(Number(value))}
            min={1}
            max={99}
            radius={'md'}
            className='w-[100px]'
            rightSection={null}
            size='xs'
            styles={{ input: { textAlign: 'center' } }}
          />
          <Text className='ml-auto' fw={700} size='sm'>
            {formatPriceLocaleVi(price || 0)}
          </Text>
        </Group>
      </Box>
    </Group>
  );
}
