import {
  Avatar,
  Card,
  CardSection,
  Group,
  ScrollArea,
  Table,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
  Text
} from '@mantine/core';

interface PopularItem {
  name: string;
  category: string;
  price: string;
  orders: number;
  image?: string;
}

interface PopularItemsProps {
  products?: any[];
}

// Mock data - replace with real data
const mockItems: PopularItem[] = [
  {
    name: 'Pizza Margherita',
    category: 'Pizza',
    price: '299.000đ',
    orders: 145,
    image: '/placeholder.svg?height=40&width=40'
  },
  {
    name: 'Mì Ý Gà Alfredo',
    category: 'Mì Ý',
    price: '350.000đ',
    orders: 132,
    image: '/placeholder.svg?height=40&width=40'
  },
  {
    name: 'Salad Caesar',
    category: 'Salad',
    price: '199.000đ',
    orders: 98,
    image: '/placeholder.svg?height=40&width=40'
  },
  {
    name: 'Bánh mì tỏi',
    category: 'Khai vị',
    price: '89.000đ',
    orders: 87,
    image: '/placeholder.svg?height=40&width=40'
  },
  {
    name: 'Tiramisu',
    category: 'Tráng miệng',
    price: '149.000đ',
    orders: 76,
    image: '/placeholder.svg?height=40&width=40'
  }
];

export default function PopularItems({ products }: PopularItemsProps) {
  const displayItems = products?.slice(0, 5) || mockItems;

  return (
    <Card withBorder padding='md' radius='md' className='h-full'>
      <CardSection withBorder inheritPadding py='xs' className='bg-gray-50'>
        <Group justify='space-between'>
          <Text fw={700} className='text-gray-800'>
            Món ăn phổ biến
          </Text>
          <Text size='sm' c='dimmed' className='text-gray-600'>
            Trong tháng này
          </Text>
        </Group>
      </CardSection>

      <ScrollArea className='h-80'>
        <Table striped highlightOnHover withTableBorder withColumnBorders className='min-w-full'>
          <TableThead>
            <TableTr className='bg-gray-50'>
              <TableTh className='font-semibold text-gray-700'>Sản phẩm</TableTh>
              <TableTh className='font-semibold text-gray-700'>Danh mục</TableTh>
              <TableTh className='font-semibold text-gray-700'>Giá</TableTh>
              <TableTh className='font-semibold text-gray-700'>Số lượng đặt</TableTh>
            </TableTr>
          </TableThead>
          <TableTbody>
            {displayItems.map((item, index) => (
              <TableTr key={index} className='transition-colors hover:bg-gray-50'>
                <TableTd>
                  <Group gap='sm'>
                    <Avatar src={item.image} size='sm' radius='md' className='border border-gray-200' />
                    <Text className='font-medium text-gray-800'>{item.name}</Text>
                  </Group>
                </TableTd>
                <TableTd>
                  <Text className='inline-block rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600'>
                    {item.category}
                  </Text>
                </TableTd>
                <TableTd className='font-medium text-green-600'>{item.price}</TableTd>
                <TableTd>
                  <Text className='font-bold text-blue-600'>{item.orders}</Text>
                </TableTd>
              </TableTr>
            ))}
          </TableTbody>
        </Table>
      </ScrollArea>
    </Card>
  );
}
