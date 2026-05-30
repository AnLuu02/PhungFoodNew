'use client';

import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  FileInput,
  Group,
  Menu,
  Modal,
  NumberInput,
  Paper,
  Progress,
  RingProgress,
  ScrollArea,
  Select,
  SimpleGrid,
  Stack,
  Table,
  Tabs,
  Text,
  Textarea,
  TextInput,
  ThemeIcon,
  Timeline,
  Title
} from '@mantine/core';
import {
  IconAlertTriangle,
  IconArrowDown,
  IconArrowUp,
  IconBuildingWarehouse,
  IconCalendarDue,
  IconDotsVertical,
  IconDownload,
  IconFilter,
  IconPackage,
  IconPlus,
  IconSearch,
  IconShoppingCart,
  IconTruckDelivery
} from '@tabler/icons-react';

import { useDisclosure } from '@mantine/hooks';

import { IconTrash } from '@tabler/icons-react';

import { useMemo, useState } from 'react';
const warehouseStats = [
  {
    title: 'Tổng nguyên liệu',
    value: '148',
    desc: 'Đang quản lý trong kho',
    icon: IconPackage,
    color: 'blue'
  },
  {
    title: 'Sắp hết hàng',
    value: '12',
    desc: 'Cần nhập thêm sớm',
    icon: IconAlertTriangle,
    color: 'orange'
  },
  {
    title: 'Sắp hết hạn',
    value: '8',
    desc: 'Trong vòng 7 ngày',
    icon: IconCalendarDue,
    color: 'red'
  },
  {
    title: 'Giá trị tồn kho',
    value: '128.5M',
    desc: 'Ước tính hiện tại',
    icon: IconBuildingWarehouse,
    color: 'teal'
  }
];

const ingredients = [
  {
    name: 'Thịt bò burger',
    category: 'Thịt',
    stock: 42,
    unit: 'kg',
    minStock: 30,
    status: 'Ổn định',
    expiry: '12/06/2026',
    supplier: 'Fresh Meat Co.',
    value: '12.600.000đ'
  },
  {
    name: 'Phô mai lát',
    category: 'Dairy',
    stock: 18,
    unit: 'kg',
    minStock: 25,
    status: 'Sắp hết',
    expiry: '04/06/2026',
    supplier: 'Dairy Farm',
    value: '4.320.000đ'
  },
  {
    name: 'Khoai tây đông lạnh',
    category: 'Frozen',
    stock: 120,
    unit: 'kg',
    minStock: 50,
    status: 'Ổn định',
    expiry: '22/08/2026',
    supplier: 'Frozen Food VN',
    value: '9.800.000đ'
  },
  {
    name: 'Bánh burger',
    category: 'Bakery',
    stock: 260,
    unit: 'cái',
    minStock: 300,
    status: 'Sắp hết',
    expiry: '02/06/2026',
    supplier: 'Golden Bread',
    value: '3.900.000đ'
  },
  {
    name: 'Rau xà lách',
    category: 'Vegetable',
    stock: 9,
    unit: 'kg',
    minStock: 15,
    status: 'Nguy cấp',
    expiry: '30/05/2026',
    supplier: 'Green Farm',
    value: '540.000đ'
  }
];

const transactions = [
  {
    type: 'Nhập kho',
    name: 'Khoai tây đông lạnh',
    quantity: '+50kg',
    time: 'Hôm nay, 09:30',
    color: 'teal',
    icon: IconArrowDown
  },
  {
    type: 'Xuất kho',
    name: 'Thịt bò burger',
    quantity: '-12kg',
    time: 'Hôm nay, 11:15',
    color: 'red',
    icon: IconArrowUp
  },
  {
    type: 'Nhập kho',
    name: 'Bánh burger',
    quantity: '+120 cái',
    time: 'Hôm qua, 16:45',
    color: 'teal',
    icon: IconArrowDown
  }
];

const suppliers = [
  {
    name: 'Fresh Meat Co.',
    total: '38.4M',
    orders: 18,
    status: 'Đang hợp tác'
  },
  {
    name: 'Golden Bread',
    total: '21.8M',
    orders: 24,
    status: 'Đang hợp tác'
  },
  {
    name: 'Green Farm',
    total: '12.5M',
    orders: 15,
    status: 'Cần đánh giá'
  }
];

function getStockPercent(stock: number, minStock: number) {
  return Math.min(Math.round((stock / minStock) * 100), 100);
}

function getStatusColor(status: string) {
  if (status === 'Ổn định') return 'teal';
  if (status === 'Sắp hết') return 'orange';
  return 'red';
}

export default function WarehouseManagementPage() {
  const [opened, { open, close }] = useDisclosure(false);

  const [items, setItems] = useState([
    {
      ingredient: '',
      quantity: 1,
      price: 0
    }
  ]);

  const totalPrice = useMemo(() => {
    return items.reduce((acc, item) => {
      return acc + item.quantity * item.price;
    }, 0);
  }, [items]);

  const addRow = () => {
    setItems(prev => [
      ...prev,
      {
        ingredient: '',
        quantity: 1,
        price: 0
      }
    ]);
  };

  const removeRow = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, key: string, value: any) => {
    setItems(prev =>
      prev.map((item, i) => {
        if (i !== index) return item;

        return {
          ...item,
          [key]: value
        };
      })
    );
  };
  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title='Tạo phiếu nhập kho'
        classNames={{
          title: 'text-2xl font-bold'
        }}
        centered
        size='80%'
        radius='xl'
      >
        <Stack gap='xl'>
          <SimpleGrid cols={{ base: 1, md: 2 }}>
            <TextInput label='Mã phiếu nhập' placeholder='PNK-2026-001' />

            <Select
              label='Nhà cung cấp'
              placeholder='Chọn nhà cung cấp'
              data={['Fresh Meat Co.', 'Golden Bread', 'Green Farm', 'Frozen Food VN']}
            />

            <Select label='Trạng thái' defaultValue='Nháp' data={['Nháp', 'Đã xác nhận', 'Đã nhập kho']} />

            <TextInput label='Người tạo' defaultValue='Admin Warehouse' />
          </SimpleGrid>

          <Paper withBorder radius='xl' p='md'>
            <Group justify='space-between' mb='md'>
              <Box>
                <Title order={5}>Danh sách nguyên liệu</Title>
                <Text size='sm' c='dimmed'>
                  Thêm nguyên liệu nhập kho
                </Text>
              </Box>

              <Button size='xs' leftSection={<IconPlus size={16} />} onClick={addRow}>
                Thêm dòng
              </Button>
            </Group>

            <Stack gap='md'>
              {items.map((item, index) => (
                <Paper key={index} withBorder radius='lg' p='md' className='bg-slate-50 dark:bg-dark-card'>
                  <SimpleGrid cols={{ base: 1, md: 4 }}>
                    <Select
                      label='Nguyên liệu'
                      placeholder='Chọn nguyên liệu'
                      value={item.ingredient}
                      onChange={value => updateItem(index, 'ingredient', value)}
                      data={['Thịt bò burger', 'Phô mai lát', 'Khoai tây đông lạnh', 'Bánh burger', 'Rau xà lách']}
                    />

                    <NumberInput
                      label='Số lượng'
                      value={item.quantity}
                      min={1}
                      onChange={value => updateItem(index, 'quantity', value)}
                    />

                    <NumberInput
                      label='Đơn giá'
                      value={item.price}
                      thousandSeparator=','
                      min={0}
                      onChange={value => updateItem(index, 'price', value)}
                    />

                    <Stack justify='end'>
                      <Button
                        color='red'
                        variant='light'
                        leftSection={<IconTrash size={16} />}
                        onClick={() => removeRow(index)}
                      >
                        Xóa
                      </Button>
                    </Stack>
                  </SimpleGrid>

                  <Group justify='space-between' mt='md'>
                    <Text size='sm' c='dimmed'>
                      Thành tiền
                    </Text>

                    <Text fw={700}>{(item.quantity * item.price).toLocaleString()}đ</Text>
                  </Group>
                </Paper>
              ))}
            </Stack>
          </Paper>

          <SimpleGrid cols={{ base: 1, md: 2 }}>
            <Textarea label='Ghi chú' placeholder='Thông tin thêm về phiếu nhập' minRows={5} />

            <Stack>
              <FileInput label='Hóa đơn / chứng từ' placeholder='Upload file' />

              <Paper withBorder radius='xl' p='lg' className='bg-blue-50 dark:bg-dark-card'>
                <Stack gap='xs'>
                  <Group justify='space-between'>
                    <Text c='dimmed'>Tổng sản phẩm</Text>
                    <Text fw={700}>{items.length}</Text>
                  </Group>

                  <Group justify='space-between'>
                    <Text c='dimmed'>Tổng tiền</Text>
                    <Title order={3} c='blue'>
                      {totalPrice.toLocaleString()}đ
                    </Title>
                  </Group>
                </Stack>
              </Paper>
            </Stack>
          </SimpleGrid>

          <Group justify='flex-end'>
            <Button variant='default' onClick={close}>
              Hủy
            </Button>

            <Button variant='outline'>Lưu nháp</Button>

            <Button color='teal'>Xác nhận nhập kho</Button>
          </Group>
        </Stack>
      </Modal>

      <Box className='min-h-screen bg-slate-50 dark:bg-transparent'>
        <Stack gap='xl'>
          <Group justify='space-between' align='flex-start'>
            <Box>
              <Title order={2} className='font-quicksand'>
                Quản lý kho
              </Title>
              <Text c='dimmed' size='sm'>
                Theo dõi tồn kho, nhập xuất nguyên liệu và cảnh báo vận hành cho nhà hàng fast food.
              </Text>
            </Box>

            <Group>
              <Button leftSection={<IconDownload size={18} />} variant='outline'>
                Xuất báo cáo
              </Button>
              <Button leftSection={<IconPlus size={18} />} onClick={open}>
                Tạo phiếu nhập
              </Button>
            </Group>
          </Group>

          <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
            {warehouseStats.map(item => {
              const Icon = item.icon;

              return (
                <Paper key={item.title} withBorder radius='xl' p='lg' className='shadow-sm'>
                  <Group justify='space-between'>
                    <Stack gap={4}>
                      <Text size='sm' c='dimmed'>
                        {item.title}
                      </Text>
                      <Title order={2}>{item.value}</Title>
                      <Text size='xs' c='dimmed'>
                        {item.desc}
                      </Text>
                    </Stack>

                    <ThemeIcon size={48} radius='xl' color={item.color} variant='light'>
                      <Icon size={24} />
                    </ThemeIcon>
                  </Group>
                </Paper>
              );
            })}
          </SimpleGrid>

          <SimpleGrid cols={{ base: 1, lg: 3 }} spacing='lg'>
            <Paper withBorder radius='xl' p='lg' className='shadow-sm lg:col-span-2'>
              <Group justify='space-between' mb='md'>
                <Box>
                  <Title order={4}>Danh sách nguyên liệu</Title>
                  <Text size='sm' c='dimmed'>
                    Quản lý tồn kho theo từng nguyên liệu
                  </Text>
                </Box>

                <Group>
                  <TextInput placeholder='Tìm nguyên liệu...' leftSection={<IconSearch size={16} />} className='w-56' />
                  <Select
                    placeholder='Danh mục'
                    data={['Tất cả', 'Thịt', 'Dairy', 'Frozen', 'Bakery', 'Vegetable']}
                    defaultValue='Tất cả'
                    leftSection={<IconFilter size={16} />}
                    className='w-40'
                  />
                </Group>
              </Group>

              <ScrollArea>
                <Table verticalSpacing='md' highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Nguyên liệu</Table.Th>
                      <Table.Th>Tồn kho</Table.Th>
                      <Table.Th>Trạng thái</Table.Th>
                      <Table.Th>Hạn dùng</Table.Th>
                      <Table.Th>Nhà cung cấp</Table.Th>
                      <Table.Th>Giá trị</Table.Th>
                      <Table.Th />
                    </Table.Tr>
                  </Table.Thead>

                  <Table.Tbody>
                    {ingredients.map(item => (
                      <Table.Tr key={item.name}>
                        <Table.Td>
                          <Stack gap={2}>
                            <Text fw={600}>{item.name}</Text>
                            <Badge variant='light' color='gray' w='fit-content'>
                              {item.category}
                            </Badge>
                          </Stack>
                        </Table.Td>

                        <Table.Td>
                          <Stack gap={6}>
                            <Group justify='space-between' gap='xs'>
                              <Text size='sm' fw={600}>
                                {item.stock} {item.unit}
                              </Text>
                              <Text size='xs' c='dimmed'>
                                Min: {item.minStock}
                              </Text>
                            </Group>
                            <Progress
                              value={getStockPercent(item.stock, item.minStock)}
                              color={getStatusColor(item.status)}
                              radius='xl'
                            />
                          </Stack>
                        </Table.Td>

                        <Table.Td>
                          <Badge color={getStatusColor(item.status)} variant='light'>
                            {item.status}
                          </Badge>
                        </Table.Td>

                        <Table.Td>
                          <Text size='sm'>{item.expiry}</Text>
                        </Table.Td>

                        <Table.Td>
                          <Text size='sm'>{item.supplier}</Text>
                        </Table.Td>

                        <Table.Td>
                          <Text size='sm' fw={600}>
                            {item.value}
                          </Text>
                        </Table.Td>

                        <Table.Td>
                          <Menu shadow='md' position='bottom-end'>
                            <Menu.Target>
                              <ActionIcon variant='subtle'>
                                <IconDotsVertical size={18} />
                              </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                              <Menu.Item>Xem chi tiết</Menu.Item>
                              <Menu.Item>Điều chỉnh tồn kho</Menu.Item>
                              <Menu.Item color='red'>Đánh dấu lỗi hàng</Menu.Item>
                            </Menu.Dropdown>
                          </Menu>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </ScrollArea>
            </Paper>

            <Stack gap='lg'>
              <Paper withBorder radius='xl' p='lg' className='shadow-sm'>
                <Group justify='space-between' mb='md'>
                  <Box>
                    <Title order={4}>Tình trạng kho</Title>
                    <Text size='sm' c='dimmed'>
                      Mức an toàn nguyên liệu
                    </Text>
                  </Box>

                  <RingProgress
                    size={92}
                    thickness={10}
                    sections={[
                      { value: 72, color: 'teal' },
                      { value: 18, color: 'orange' },
                      { value: 10, color: 'red' }
                    ]}
                    label={
                      <Text ta='center' fw={700} size='lg'>
                        72%
                      </Text>
                    }
                  />
                </Group>

                <Stack gap='sm'>
                  <Group justify='space-between'>
                    <Text size='sm'>Ổn định</Text>
                    <Badge color='teal' variant='light'>
                      106 món
                    </Badge>
                  </Group>
                  <Group justify='space-between'>
                    <Text size='sm'>Cần nhập thêm</Text>
                    <Badge color='orange' variant='light'>
                      12 món
                    </Badge>
                  </Group>
                  <Group justify='space-between'>
                    <Text size='sm'>Nguy cấp</Text>
                    <Badge color='red' variant='light'>
                      4 món
                    </Badge>
                  </Group>
                </Stack>
              </Paper>

              <Paper withBorder radius='xl' p='lg' className='shadow-sm'>
                <Title order={4} mb='xs'>
                  Hoạt động gần đây
                </Title>

                <Timeline active={-1} bulletSize={34} lineWidth={2}>
                  {transactions.map(item => {
                    const Icon = item.icon;

                    return (
                      <Timeline.Item
                        key={`${item.name}-${item.time}`}
                        bullet={
                          <ThemeIcon color={item.color} radius='xl' size={30}>
                            <Icon size={16} />
                          </ThemeIcon>
                        }
                      >
                        <Text fw={600} size='sm'>
                          {item.type}
                        </Text>
                        <Text size='sm' c='dimmed'>
                          {item.name} · {item.quantity}
                        </Text>
                        <Text size='xs' c='dimmed'>
                          {item.time}
                        </Text>
                      </Timeline.Item>
                    );
                  })}
                </Timeline>
              </Paper>
            </Stack>
          </SimpleGrid>

          <Tabs
            defaultValue='purchase'
            variant='pills'
            classNames={{
              root: 'w-full',
              list: `border-1 flex flex-wrap gap-3 rounded-2xl border border-solid border-slate-200 bg-white p-2 shadow-sm dark:border-dark-dimmed dark:bg-transparent`,
              tab: `rounded-xl px-5 py-3 font-semibold text-slate-600 transition-all duration-200 hover:bg-mainColor/20 hover:text-slate-900 data-[active=true]:bg-gradient-to-r data-[active=true]:from-mainColor data-[active=true]:to-indigo-500 data-[active=true]:text-white data-[active=true]:shadow-lg data-[active=true]:shadow-blue-500/20`,
              panel: 'pt-6'
            }}
          >
            <Tabs.List>
              <Tabs.Tab value='purchase' leftSection={<IconShoppingCart size={16} />}>
                Kế hoạch nhập hàng
              </Tabs.Tab>
              <Tabs.Tab value='supplier' leftSection={<IconTruckDelivery size={16} />}>
                Nhà cung cấp
              </Tabs.Tab>
              <Tabs.Tab value='expiry' leftSection={<IconCalendarDue size={16} />}>
                Hạn sử dụng
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value='purchase' pt='lg'>
              <SimpleGrid cols={{ base: 1, md: 3 }}>
                {['Phô mai lát', 'Bánh burger', 'Rau xà lách'].map((name, index) => (
                  <Card key={name} withBorder radius='xl' p='lg' className='shadow-sm'>
                    <Group justify='space-between' mb='sm'>
                      <Title order={5}>{name}</Title>
                      <Badge color={index === 2 ? 'red' : 'orange'} variant='light'>
                        Cần nhập
                      </Badge>
                    </Group>
                    <Text size='sm' c='dimmed'>
                      Đề xuất nhập thêm dựa trên tốc độ bán 7 ngày gần nhất.
                    </Text>
                    <Divider my='md' />
                    <Group justify='space-between'>
                      <Text size='sm'>Số lượng đề xuất</Text>
                      <Text fw={700}>{index === 2 ? '20kg' : index === 1 ? '300 cái' : '35kg'}</Text>
                    </Group>
                  </Card>
                ))}
              </SimpleGrid>
            </Tabs.Panel>

            <Tabs.Panel value='supplier' pt='lg'>
              <SimpleGrid cols={{ base: 1, md: 3 }}>
                {suppliers.map(item => (
                  <Card key={item.name} withBorder radius='xl' p='lg' className='shadow-sm'>
                    <Group justify='space-between'>
                      <Title order={5}>{item.name}</Title>
                      <Badge color={item.status === 'Đang hợp tác' ? 'teal' : 'orange'} variant='light'>
                        {item.status}
                      </Badge>
                    </Group>

                    <Stack gap='xs' mt='md'>
                      <Group justify='space-between'>
                        <Text size='sm' c='dimmed'>
                          Tổng giao dịch
                        </Text>
                        <Text fw={700}>{item.total}</Text>
                      </Group>
                      <Group justify='space-between'>
                        <Text size='sm' c='dimmed'>
                          Số đơn nhập
                        </Text>
                        <Text fw={700}>{item.orders}</Text>
                      </Group>
                    </Stack>
                  </Card>
                ))}
              </SimpleGrid>
            </Tabs.Panel>

            <Tabs.Panel value='expiry' pt='lg'>
              <Paper withBorder radius='xl' p='lg' className='shadow-sm'>
                <Title order={4} mb='md'>
                  Cảnh báo hạn sử dụng gần nhất
                </Title>

                <Stack>
                  {[
                    'Rau xà lách - hết hạn 30/05/2026',
                    'Bánh burger - hết hạn 02/06/2026',
                    'Phô mai lát - hết hạn 04/06/2026'
                  ].map(item => (
                    <Group key={item} justify='space-between' className='rounded-xl bg-red-50 p-4 dark:bg-dark-card'>
                      <Group>
                        <ThemeIcon color='red' variant='light' radius='xl'>
                          <IconAlertTriangle size={18} />
                        </ThemeIcon>
                        <Text fw={600}>{item}</Text>
                      </Group>
                      <Button size='xs' color='red' variant='light'>
                        Xử lý
                      </Button>
                    </Group>
                  ))}
                </Stack>
              </Paper>
            </Tabs.Panel>
          </Tabs>
        </Stack>
      </Box>
    </>
  );
}
