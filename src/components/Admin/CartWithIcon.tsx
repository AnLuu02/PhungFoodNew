import { Card, Group, Text } from '@mantine/core';
import { IconArrowDownRight, IconArrowUpRight } from '@tabler/icons-react';
import Link from 'next/link';
import React from 'react';

function CardWithIcon({
  icon: Icon,
  title,
  value,
  href,
  diff
}: {
  icon: React.FC<any>;
  title: string;
  href: string;
  value: string;
  diff?: number;
}) {
  const DiffIcon = diff && diff > 0 ? IconArrowUpRight : IconArrowDownRight;
  const color = diff && diff > 0 ? 'teal.6' : 'red.6';

  return (
    <Card shadow='sm' padding='lg' radius='md' withBorder className='cursor-pointer hover:border-red-400'>
      <Link href={`/admin/${href}`}>
        <Group>
          <Icon size={32} stroke={1.5} />
          <div>
            <Text size='xs' c='dimmed' tt='uppercase' fw={700}>
              {title}
            </Text>

            <Text fw={700} size='xl'>
              {value}
            </Text>
          </div>
        </Group>
        {diff && (
          <Group mt='md' gap='xs'>
            <Text c={color} size='sm' fw={500}>
              {diff > 0 ? '+' : ''}
              {diff}%
            </Text>
            <DiffIcon size={16} color={color} />
            <Text c='dimmed' size='xs'>
              so với tháng trước
            </Text>
          </Group>
        )}
      </Link>
    </Card>
  );
}

export default CardWithIcon;
