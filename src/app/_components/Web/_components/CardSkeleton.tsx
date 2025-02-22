import { Card, Flex, Group, Skeleton } from '@mantine/core';
const CardSkeleton = () => {
  return (
    <Card shadow='sm' padding='lg' radius='md' withBorder className='w-full'>
      <Card.Section>
        <Skeleton h={160} />
      </Card.Section>

      <Group justify='space-between' mt='md' mb='xs'>
        <Skeleton height={8} mt={6} width='70%' radius='xl' />
      </Group>

      <Skeleton height={8} mt={6} width='70%' radius='xl' />
      <Skeleton height={8} mt={6} width='70%' radius='xl' />

      <Flex align={'center'} justify={'space-between'} mt='md'>
        <Skeleton height={8} mt={6} width='40%' radius='xl' />

        <Skeleton height={8} mt={6} width='40%' radius='xl' />
      </Flex>
    </Card>
  );
};

export default CardSkeleton;
