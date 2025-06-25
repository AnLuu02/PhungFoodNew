import { Box, Card, CardSection, Grid, GridCol, Group, rem, Skeleton, Stack } from '@mantine/core';

import { Flex } from '@mantine/core';

interface SkeletonLoaderProps {
  type: 'grid-2col-carousel' | 'simple' | 'category-list' | 'promotion-banner-carousel';
  count?: number;
}

export default function SkeletonLoader({ type, count = 1 }: SkeletonLoaderProps) {
  const renderSkeleton = () => {
    switch (type) {
      case 'grid-2col-carousel':
        return (
          <Box>
            <Flex gap='md' direction={{ base: 'column', lg: 'row' }}>
              <Box w={{ base: '100%', lg: '66.666667%' }} className='relative h-[400px] overflow-hidden rounded-md'>
                <Skeleton height={'100%'} radius='lg' />
              </Box>
              <Flex
                direction={{ base: 'column', sm: 'row', md: 'row', lg: 'column' }}
                align='center'
                justify='space-between'
                w={{ base: '100%', lg: '33.333333%' }}
                className='hidden xl:flex'
              >
                <Skeleton height={190} radius='md' />
                <Skeleton height={190} radius='md' />
              </Flex>
            </Flex>
          </Box>
        );
      case 'simple':
        return (
          <Box w={'100%'} className='relative h-[400px] overflow-hidden rounded-md'>
            <Skeleton height={'100%'} radius='lg' />
          </Box>
        );

      case 'category-list':
        return (
          <Grid columns={10}>
            {[...Array(count)].map((_, index) => (
              <GridCol span={1}>
                <Card radius={'md'} key={index} padding='lg' shadow='sm' h={200} m={0}>
                  <CardSection>
                    <div style={{ position: 'relative', width: '100%', height: '120px' }}>
                      <Skeleton height={50} width={50} circle />
                    </div>
                  </CardSection>
                  <Stack gap={rem(1)} mt={'xs'} align='center'>
                    <Skeleton height={16} width='80%' />
                  </Stack>
                </Card>
              </GridCol>
            ))}
          </Grid>
        );

      case 'promotion-banner-carousel':
        return (
          <Card h={{ base: 'max-content', md: 500 }} radius={'lg'} bg={'gray.1'} p={0}>
            <Flex h={'100%'}>
              <Skeleton
                className='relative hidden bg-cover bg-no-repeat lg:block'
                h={'100%'}
                w={{ base: '100%', md: '25%' }}
                pos={'relative'}
              ></Skeleton>

              <Stack flex={1} p={'md'}>
                <Flex align={'center'} justify={'space-between'} mb={{ base: 0, md: 20 }} py={'md'}>
                  <Group gap={'md'}>
                    <Skeleton height={40} width={40} circle />
                    <Skeleton height={40} width={40} circle />
                  </Group>
                  <Flex align={'center'} gap={'md'}>
                    <Skeleton height={20} width={100} />
                    <Skeleton height={20} width={100} />
                    <Skeleton height={20} width={100} />
                  </Flex>
                </Flex>
                <Grid>
                  {[...Array(count)].map((_, index) => (
                    <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
                      <Card shadow='sm' padding='lg' radius='md' withBorder>
                        <Card.Section>
                          <Skeleton height={160} />
                        </Card.Section>
                        <Stack gap='xs' mt='md'>
                          <Skeleton height={20} width='80%' />
                          <Group justify='space-between'>
                            <Skeleton height={18} width='50%' />
                            <Group gap={2}>
                              {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} height={10} width={10} />
                              ))}
                            </Group>
                          </Group>
                          <Skeleton height={32} radius='md' />
                        </Stack>
                      </Card>
                    </Grid.Col>
                  ))}
                </Grid>
                <Flex align={'center'} justify={'center'} mt={30}>
                  <Skeleton height={30} width={120} radius='xl' />
                </Flex>
              </Stack>
            </Flex>
          </Card>
        );

      default:
        return <Skeleton height={200} />;
    }
  };

  if (type === 'category-list' || type === 'promotion-banner-carousel' || type === 'simple') {
    return renderSkeleton();
  }

  return (
    <Stack gap='md'>
      {[...Array(count)].map((_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </Stack>
  );
}
