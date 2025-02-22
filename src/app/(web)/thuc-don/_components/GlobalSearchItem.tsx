import { Badge, Box, Center, Group, Highlight, Image, Spoiler, Text } from '@mantine/core';
import { Spotlight } from '@mantine/spotlight';
import Link from 'next/link';
import { formatPriceLocaleVi } from '~/app/lib/utils/format/formatPrice';
function GlobalSearchItem({ item, query }: any) {
  const isNew = (createdAt: any) => {
    if (!createdAt) return false;
    const oneDayInMs = 24 * 60 * 60 * 1000;
    const createdAtDate = new Date(createdAt).getTime();
    const today = new Date().getTime();
    return today - createdAtDate < oneDayInMs;
  };
  return (
    <Link href={`/san-pham/${item.tag}`} className='no-underline'>
      <Spotlight.Action key={item.id}>
        <Group wrap='nowrap' w='100%'>
          {item.thumbnail && (
            <Center w={'8%'}>
              <Image
                loading='lazy'
                src={item?.thumbnail || '/images/jpg/empty-300x240.jpg'}
                w={50}
                h={50}
                alt={item.name}
              />
            </Center>
          )}

          <Box style={{ flex: 1 }} w={'70%'}>
            <Highlight highlight={query} size='md' fw={700} c='black'>
              {item.name}
            </Highlight>

            {item.description && (
              <Spoiler
                maxHeight={20}
                showLabel='Xem thêm'
                hideLabel='Ẩn'
                styles={{
                  control: { color: '#008b4b', fontWeight: 700, fontSize: '14px' }
                }}
              >
                <Highlight opacity={0.6} size='xs' highlight={query} c={'black'}>
                  {`${item.description}`}
                </Highlight>
              </Spoiler>
            )}
          </Box>
          <Text fw={700} size='sm' c={'red'} w={'10%'}>
            {formatPriceLocaleVi(item?.price || 0)}
          </Text>

          {isNew(item?.createdAt) && (
            <Badge variant='default' bg='red' c={'white'} className='animate-wiggle' top={0} w={'10%'}>
              new
            </Badge>
          )}
        </Group>
      </Spotlight.Action>
    </Link>
  );
}

export default GlobalSearchItem;
