import { Badge, Card, Flex, Group, Skeleton, Text } from '@mantine/core';

export default function ProductCardSkeleton() {
  return (
    <Card h={320} radius='md' padding={0} shadow='sm' className='flex flex-col justify-between' pos='relative'>
      <Card.Section h='50%' pos='relative'>
        <Skeleton height='100%' width='100%' radius={0} />
      </Card.Section>

      <Card.Section h='50%' pos='relative'>
        <Flex direction='column' gap='sm' pt={10} align='center' className='w-full' h='100%'>
          <Skeleton height={20} width='80%' radius='md' />
          <Group>
            <Skeleton height={14} width={50} radius='md' />
            <Skeleton height={18} width={70} radius='md' />
          </Group>
          <Flex align='center' gap={10} justify='space-between' w='80%'>
            <Skeleton height={14} width={80} radius='md' />
            <Skeleton height={14} width={60} radius='md' />
          </Flex>
          <Skeleton height={30} width={100} radius='md' />
        </Flex>

        <Badge color='red' pr={20} pos='absolute' top={-15} right={-10}>
          <Text size='xs' className='text-white'>
            Đã bán: --
          </Text>
        </Badge>
      </Card.Section>

      <Badge color='red' pos='absolute' top={10} left={8}>
        -₫
      </Badge>
    </Card>
  );
}
