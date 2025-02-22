'use client';
import {
  Box,
  Divider,
  Flex,
  Highlight,
  Loader,
  Modal,
  NavLink,
  ScrollArea,
  Spoiler,
  Text,
  TextInput
} from '@mantine/core';
import { useDebouncedValue, useDisclosure, useWindowEvent } from '@mantine/hooks';
import { IconBrandFacebook, IconCheese, IconHome, IconListTree, IconSearch, IconUser } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { api } from '~/trpc/react';

const defaultGlobalSearchData = [
  {
    type: 'admintrator',
    title: 'Quản trị',
    data: [
      {
        name: 'Sản phẩm bán',
        icon: <IconCheese size={24} />,
        url: '/admin/product',
        description: 'Đến trang danh sách sản phẩm bán'
      },
      {
        name: 'Danh mục',
        url: '/admin/category',
        icon: <IconListTree size={24} />,
        description: 'Đến trang danh sách danh mục'
      },
      {
        name: 'Người dùng',
        url: '/admin/user',
        icon: <IconUser size={24} />,
        description: 'Đến trang danh sách người dùng'
      }
    ]
  },
  {
    type: 'brand',
    title: 'Thương hiệu',
    data: [
      {
        name: 'Trang chủ Phụng-Food',
        icon: <IconHome size={24} />,

        url: '/'
      },
      {
        name: 'Facebook Phụng-Food',
        icon: <IconBrandFacebook size={24} />,
        url: 'https://www.facebook.com/tlinh1423'
      }
    ]
  }
];

export const GlobalSearch = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [value, setValue] = useState('');
  const [results, setResults] = useState<{ type: string; title: string; data: any }[]>([]);
  const [debounced] = useDebouncedValue(value, 500);

  const { data: category, isLoading: isLoadingCategory } = api.Category.find.useQuery(
    { skip: 0, take: 10, query: debounced ?? '' },
    { enabled: !!debounced }
  );
  const { data: product, isLoading: isLoadingProduct } = api.Product.find.useQuery(
    { skip: 0, take: 10, query: debounced ?? '' },
    { enabled: !!debounced }
  );
  const { data: user, isLoading: isLoadingUser } = api.User.find.useQuery(
    { skip: 0, take: 10, query: debounced ?? '' },
    { enabled: !!debounced }
  );
  useWindowEvent('keydown', event => {
    if (event.ctrlKey && event.key === 'k') {
      event.preventDefault();
      open();
    }
  });
  useEffect(() => {
    if (debounced) {
      const rs: any = [];
      if (category && category.categories.length > 0) {
        rs.push({
          type: 'category',
          title: 'Danh mục',
          data: category.categories.map((item: any) => ({
            ...item,
            icon: <IconListTree key={item.id} size={24} />
          }))
        });
      }
      if (product && product.products.length > 0) {
        rs.push({
          type: 'product',
          title: 'Sản phẩm',
          data: product.products.map((item: any) => ({
            ...item,
            icon: <IconCheese key={item.id} size={24} />
          }))
        });
      }
      if (user && user.users.length > 0) {
        rs.push({
          type: 'user',
          title: 'Người dung',
          data: user.users.map((item: any) => ({
            ...item,
            icon: <IconUser key={item.id} size={24} />
          }))
        });
      }
      setResults(rs);
    } else {
      setResults([...defaultGlobalSearchData]);
    }
  }, [debounced, category, product, user]);
  return (
    <>
      <TextInput
        placeholder='Search...'
        leftSection={<IconSearch size={24} className='text-gray-300' />}
        rightSectionWidth={80}
        pointer
        rightSection={
          <Box
            style={{
              fontSize: '10px',
              padding: '4px 10px',
              border: '0.5px solid rgba(0, 0, 0, 0.2)',
              boxShadow: '1px 2px 0 rgba(0, 0, 0, 0.2)',
              borderRadius: '6px',
              fontWeight: 'bold'
            }}
            size='xs'
            c='dimmed'
          >
            Ctrl + K
          </Box>
        }
        radius='md'
        readOnly
        onClick={open}
      />
      <Modal
        padding={0}
        opened={opened}
        transitionProps={{ transition: 'scale', duration: 200, timingFunction: 'ease-in-out' }}
        radius={'md'}
        overlayProps={{ opacity: 1, blur: 10 }}
        onClose={close}
        size='lg'
        yOffset={80}
        styles={{
          content: {
            minHeight: '50px',
            maxHeight: '80vh',
            overflow: 'hidden'
          }
        }}
        withCloseButton={false}
      >
        <TextInput
          value={value}
          onChange={event => setValue(event.currentTarget.value)}
          placeholder='Search...'
          leftSection={
            <>
              {isLoadingProduct && isLoadingCategory && isLoadingUser ? (
                <Loader color={'dimmed'} className='' size={20} />
              ) : (
                <IconSearch size={24} />
              )}
            </>
          }
          style={{ width: '100%' }}
          onClick={open}
          m={0}
          size='lg'
          variant='unstyled'
        />
        <Divider m={0} p={0} pb={10} />
        <ScrollArea.Autosize mih={50} mah={440} scrollbarSize={8}>
          {results.length > 0 ? (
            results.map((result, index) => (
              <Box pb={10} key={index}>
                <Text size='sm' fw={500} c='dimmed' pl={'md'}>
                  {result.title}
                </Text>
                {result.data?.length > 0 &&
                  result.data.map((d: any, index: number) => (
                    <NavLink
                      key={d.id}
                      pl={'md'}
                      ml={'xs'}
                      mr={'xs'}
                      w={'auto'}
                      leftSection={d.icon}
                      href={d.url}
                      label={
                        <Box ml={'md'}>
                          <Text size='md' fw={500}>
                            <Highlight highlight={debounced}>{d.name}</Highlight>
                          </Text>
                          <Flex>
                            {result.type === 'product' && (
                              <>
                                <Text size='xs' c='dimmed'>
                                  #{index + 1}
                                </Text>
                                <Divider mx={'xs'} size='xs' orientation='vertical' />
                              </>
                            )}

                            <Spoiler
                              maxHeight={60}
                              showLabel='Xem thêm'
                              hideLabel='Ẩn'
                              styles={{
                                control: { color: '#008b4b', fontWeight: 700, fontSize: '14px' }
                              }}
                            >
                              <Text size='xs' c='dimmed'>
                                {d.description || d?.email}
                              </Text>
                            </Spoiler>
                          </Flex>
                        </Box>
                      }
                      style={{ width: '100%', borderRadius: 4 }}
                      onClick={close}
                    />
                  ))}
              </Box>
            ))
          ) : (
            <Text ta='center' m='md'>
              Nothing found...
            </Text>
          )}
        </ScrollArea.Autosize>
      </Modal>
    </>
  );
};
