'use client';

import {
  ActionIcon,
  Box,
  Button,
  Checkbox,
  Collapse,
  Divider,
  Flex,
  Grid,
  GridCol,
  Group,
  Paper,
  Select,
  Stack,
  Text,
  Title
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown, IconChevronUp, IconGrid3x3, IconList } from '@tabler/icons-react';
import { useState } from 'react';
import Empty from '~/app/_components/Empty';
import ProductCardCarouselVertical from '~/app/_components/Web/Home/_Components/ProductCardCarouselVertical';

export default function MainSearchResults({ products }: any) {
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [sortValue, setSortValue] = useState<string | null>('bestseller');
  const [openedPrice, { toggle: togglePrice }] = useDisclosure(true);
  const [openedType, { toggle: toggleType }] = useDisclosure(false);
  const [openedFlavor, { toggle: toggleFlavor }] = useDisclosure(false);
  const [openedOrigin, { toggle: toggleOrigin }] = useDisclosure(false);

  return (
    <Flex gap='xl' direction={{ base: 'column', md: 'row' }}>
      <Paper
        bg={'gray.1'}
        mb='lg'
        p={'md'}
        radius={'lg'}
        w={{ base: '100%', md: 280 }}
        className='h-fit'
        pos={'sticky'}
        top={70}
      >
        <Stack>
          <Group justify='space-between'>
            <Title className='font-quicksand' order={5}>
              Bộ lọc nâng cao
            </Title>
          </Group>

          <Stack gap='xs'>
            <Checkbox label='Phụ nữ có thai' />

            <Button variant='subtle' px={0} leftSection={<IconChevronDown size={16} />}>
              Xem thêm
            </Button>

            <Box>
              <Group justify='space-between' onClick={togglePrice} style={{ cursor: 'pointer' }}>
                <Text fw={500}>Giá bán</Text>
                {openedPrice ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
              </Group>

              <Collapse in={openedPrice}>
                <Stack gap='xs' mt='xs'>
                  <Button variant='outline' fullWidth justify='start' fw='normal'>
                    Dưới 100.000đ
                  </Button>
                  <Button variant='outline' fullWidth justify='start' fw='normal'>
                    100.000đ đến 300.000đ
                  </Button>
                  <Button variant='outline' fullWidth justify='start' fw='normal'>
                    300.000đ đến 500.000đ
                  </Button>
                  <Button variant='outline' fullWidth justify='start' fw='normal'>
                    Trên 500.000đ
                  </Button>
                </Stack>
              </Collapse>
            </Box>

            <Divider />

            <Box>
              <Group justify='space-between' onClick={toggleType} style={{ cursor: 'pointer' }}>
                <Text fw={500}>Loại thuốc</Text>
                {openedType ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
              </Group>
              <Collapse in={openedType}>
                <Stack gap='xs' mt='xs'></Stack>
              </Collapse>
            </Box>

            <Divider />

            <Box>
              <Group justify='space-between' onClick={toggleFlavor} style={{ cursor: 'pointer' }}>
                <Text fw={500}>Mùi vị/ Mùi hương</Text>
                {openedFlavor ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
              </Group>
            </Box>

            <Divider />

            <Box>
              <Group justify='space-between' onClick={toggleOrigin} style={{ cursor: 'pointer' }}>
                <Text fw={500}>Nước sản xuất</Text>
                {openedOrigin ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
              </Group>
            </Box>
          </Stack>
        </Stack>
      </Paper>

      <Box style={{ flex: 1 }} className='h-fit'>
        <Group justify='space-between' mb='md'>
          <Title className='font-quicksand' order={4}>
            Danh sách sản phẩm
          </Title>
          <Group>
            <Group>
              <Text size='sm' c='dimmed'>
                Sắp xếp theo
              </Text>
              <Select
                value={sortValue}
                onChange={setSortValue}
                data={[
                  { value: 'bestseller', label: 'Bán chạy' },
                  { value: 'price-asc', label: 'Giá thấp' },
                  { value: 'price-desc', label: 'Giá cao' }
                ]}
                w={160}
              />
            </Group>
            <Group>
              <ActionIcon variant={viewType === 'grid' ? 'filled' : 'subtle'} onClick={() => setViewType('grid')}>
                <IconGrid3x3 size={16} />
              </ActionIcon>
              <ActionIcon variant={viewType === 'list' ? 'filled' : 'subtle'} onClick={() => setViewType('list')}>
                <IconList size={16} />
              </ActionIcon>
            </Group>
          </Group>
        </Group>

        <Box>
          <Grid gutter='md'>
            {products?.length > 0 ? (
              products.map((item: any) => (
                <GridCol key={item.id} span={{ base: 12, sm: 4, md: 4, lg: 3 }}>
                  <ProductCardCarouselVertical key={item.id} product={item} />
                </GridCol>
              ))
            ) : (
              <GridCol span={12}>
                <Empty title={'Không tìm thấy sản phẩm'} content='' hasButton={false} />
              </GridCol>
            )}
          </Grid>
        </Box>
      </Box>
    </Flex>
  );
}
