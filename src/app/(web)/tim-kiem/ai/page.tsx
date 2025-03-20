'use client';

import { Badge, Box, Button, Card, Checkbox, Grid, GridCol, Group, Image, Menu, Stack, Text } from '@mantine/core';
import { IconArrowLeft, IconChevronDown, IconLighter } from '@tabler/icons-react';

const products = [
  {
    id: 1,
    name: 'Nepro 1 Gold',
    image: '/images/png/momo.png',
    description:
      'Sữa bột Nepro 1 Gold VitaDairy bổ sung dinh dưỡng giàm protein dành cho người bệnh đái tháo đường (400g)',
    price: 193600,
    originalPrice: 242000,
    discount: '-20%'
  },
  {
    id: 2,
    name: 'Cốm Lacto Biomin Gold',
    image: '/images/png/momo.png',
    description: 'Cốm Lacto Biomin Gold hỗ trợ cải thiện hệ vi khuẩn đường ruột (20 gói)',
    price: 135000,
    originalPrice: 135000
  },
  {
    id: 3,
    name: 'Bao cao su Sagami Love Me Gold',
    image: '/images/png/momo.png',
    description: 'Bao cao su Sagami Love Me Gold siêu mỏng, trơn, không mùi không mùi (10 cái)',
    price: 81000,
    originalPrice: 90000,
    discount: '-10%'
  }
];

export default function SearchResults() {
  const searchByImage = async (imageUrl: string) => {
    const res = await fetch('https://api-inference.huggingface.co/models/openai/clip-vit-base-patch32', {
      method: 'POST',
      headers: { Authorization: `Bearer YOUR_HUGGINGFACE_API_KEY` },
      body: JSON.stringify({ inputs: imageUrl })
    });

    const data = await res.json();
  };
  return (
    <Box>
      <Button variant='subtle' leftSection={<IconArrowLeft size={16} />} mb='md' px={0}>
        Quay lại
      </Button>

      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack>
            <Text size='xl' fw={600}>
              Kết quả tìm kiếm bằng ảnh
            </Text>

            <Card withBorder mb='sm'>
              <Group align='center'>
                <Image src='/images/png/momo.png' width={100} height={100} radius='md' />
                <Stack gap={5}>
                  <Text c='blue' fw={500}>
                    Hình 1
                  </Text>
                  <Text size='sm' c='dimmed'>
                    Tìm được 3 sản phẩm phù hợp
                  </Text>
                </Stack>
              </Group>
            </Card>

            <Stack gap='md'>
              {products.map(product => (
                <Card key={product.id} withBorder padding='lg'>
                  <Group align='center' wrap='nowrap'>
                    <Checkbox value={product.id.toString()} radius='xl' />
                    <Image src={product.image || '/images/png/momo.png'} width={120} height={120} radius='md' />
                    <Stack gap='xs' style={{ flex: 1 }}>
                      <Grid>
                        <GridCol span={8}>
                          <Stack gap='xs'>
                            <Text fw={700}>{product.name}</Text>
                            <Text size='sm'>{product.description}</Text>
                          </Stack>
                        </GridCol>

                        <GridCol span={2}>
                          <Stack gap={4} align='flex-end'>
                            <Text fw={500} size='lg'>
                              {product.price.toLocaleString()}đ
                            </Text>
                            {product.originalPrice !== product.price && (
                              <Text size='sm' c='dimmed' td='line-through'>
                                {product.originalPrice.toLocaleString()}đ
                              </Text>
                            )}
                          </Stack>
                        </GridCol>
                        <GridCol span={2}>
                          <Menu>
                            <Menu.Target>
                              <Button variant='outline' rightSection={<IconChevronDown size={16} />}>
                                Hộp
                              </Button>
                            </Menu.Target>
                            <Menu.Dropdown>
                              <Menu.Item>1 Hộp</Menu.Item>
                              <Menu.Item>2 Hộp</Menu.Item>
                              <Menu.Item>3 Hộp</Menu.Item>
                            </Menu.Dropdown>
                          </Menu>
                        </GridCol>
                      </Grid>

                      {product.discount && (
                        <Badge color='red' variant='filled' w='fit-content'>
                          {product.discount}
                        </Badge>
                      )}
                    </Stack>
                  </Group>
                </Card>
              ))}
            </Stack>
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder>
            <Stack>
              <Group>
                <IconLighter size={24} className='text-amber-500' />
                <Text fw={500}>Mẹo để tìm kiếm hình ảnh chính xác nhất</Text>
              </Group>
              <ul className='list-disc space-y-1 pl-5'>
                <li>Hình ảnh phải là sản phẩm hoặc đơn thuốc</li>
                <li>Ảnh chụp hoặc ảnh tải lên phải rõ nét và rõ tên sản phẩm</li>
                <li>Sử dụng góc chụp phù hợp, không bị mờ, chói lóa</li>
              </ul>
              <Button variant='filled' color='gray.2' c='dark'>
                Mua hàng
              </Button>
              <Button variant='light' color='blue'>
                Tìm kiếm thêm
              </Button>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Box>
  );
}
