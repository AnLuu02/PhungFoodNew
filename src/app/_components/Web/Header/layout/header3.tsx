import { Burger, Button, Flex, Group, Image, Menu, rem, ScrollAreaAutosize, Text } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { IconCategory, IconChevronCompactDown } from '@tabler/icons-react';
import clsx from 'clsx';
import Link from 'next/link';
import { breakpoints } from '~/app/lib/utils/constants/device';
import NavigationHeader from '../_components/NavigationHeader';

const Header3 = ({ data }: any) => {
  const formatData: any = data.flatMap((i: any) => i.subCategory) || [];
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.sm}px)`);
  const notDesktop = useMediaQuery(`(min-width: ${breakpoints.sm}px) and ( max-width: 1023px) `);
  const [opened, { open, close, toggle }] = useDisclosure();

  return (
    <Flex
      pl={{ base: rem(20), lg: rem(130) }}
      pr={{ base: rem(20), lg: rem(130) }}
      align={'center'}
      justify={'space-between'}
      py={'md'}
      className='sticky top-0 z-50 bg-white'
      direction={{ base: 'row', md: 'row' }}
    >
      {(isMobile || notDesktop) && <Burger opened={opened} onClick={toggle} aria-label='Toggle navigation' />}
      <Group>
        {notDesktop && (
          <Link href={'/goi-mon-nhanh'}>
            <Button
              size='sm'
              radius={'xl'}
              variant='subtle'
              px={'md'}
              className={clsx('animate-wiggle bg-red-600 text-white hover:bg-[#008b4b] hover:text-white')}
            >
              <Text fw={700} size='sm'>
                Mua hàng nhanh
              </Text>
            </Button>
          </Link>
        )}
        <Menu
          shadow='md'
          classNames={{
            dropdown: 'border-[#008b4b] bg-white',
            item: 'hover:bg-[#008b4b] hover:text-white'
          }}
          width={200}
          offset={0}
          transitionProps={{ transition: 'rotate-right', duration: 500 }}
        >
          <Menu.Target>
            <Button
              className='hover:opacity-90'
              radius={'sm'}
              size='sm'
              px={0}
              w={200}
              c={'black'}
              leftSection={<IconCategory size={20} />}
              rightSection={<IconChevronCompactDown size={20} />}
              bg={'yellow.8'}
            >
              Danh mục
            </Button>
          </Menu.Target>

          <Menu.Dropdown>
            <ScrollAreaAutosize mah={rem(400)} scrollbarSize={5}>
              {formatData?.map((item: any, index: number) => {
                return (
                  <Link
                    href={`/thuc-don?danh-muc=${item?.category?.tag}&loai-san-pham=${item?.tag}`}
                    key={index}
                    className='no-underline'
                  >
                    <Menu.Item
                      key={index}
                      leftSection={
                        <Image
                          loading='lazy'
                          src={item?.images?.[0]?.url || '/images/jpg/empty-300x240.jpg'}
                          alt='logo'
                          w={30}
                          h={30}
                        />
                      }
                    >
                      <Text size='sm' fw={700}>
                        {item?.name}
                      </Text>
                    </Menu.Item>
                  </Link>
                );
              })}
            </ScrollAreaAutosize>
          </Menu.Dropdown>
        </Menu>
      </Group>

      <NavigationHeader categories={data} opened={opened} toggle={toggle} close={close} />
    </Flex>
  );
};

export default Header3;
