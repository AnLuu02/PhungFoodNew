'use client';
import { Badge, Button, Card, Group, Image, Paper, Stack, Tabs, Text, Title } from '@mantine/core';
import { IconClock, IconCreditCard, IconWallet } from '@tabler/icons-react';
import ModalShowVoucher from '~/app/_components/Modals/ModalShowVoucher';
import { api } from '~/trpc/react';

const foodItems = [
  {
    id: 1,
    name: 'Pizza Margherita',
    price: '$12.99',
    discount: '20% off',
    image: ''
  },
  {
    id: 2,
    name: 'Sushi Platter',
    price: '$24.99',
    discount: '15% off',
    image: ''
  },
  { id: 3, name: 'Burger Deluxe', price: '$9.99', discount: '10% off', image: '' },
  {
    id: 4,
    name: 'Pasta Carbonara',
    price: '$14.99',
    discount: '25% off',
    image: ''
  }
];

const combos = [
  {
    id: 1,
    name: 'Bữa tiệc gia đình',
    items: ['2 Large Pizzas', 'Garlic Bread', '1.5L Soda'],
    price: '$29.99',
    endTime: '2024-01-01T00:00:00'
  },
  {
    id: 2,
    name: 'Date Night Special',
    items: ['2 Burgers', '2 Fries', '2 Milkshakes'],
    price: '$24.99',
    endTime: '2023-12-31T23:59:59'
  }
];

export default function FoodPromotionPage({
  searchParams
}: {
  searchParams?: {
    tag?: string;
    page?: string;
    limit?: string;
  };
}) {
  const { data, isLoading } = api.Voucher.getAll.useQuery();

  return <ModalShowVoucher opened={true} data={data} products={[]} onClose={() => {}} />;
}

function PromotionalBanner() {
  return (
    <Paper shadow='md' p='xl' radius='md' className='bg-blue-100 text-blue-900'>
      <Title order={3} className='mb-2'>
        Nhiều đơn hàng đặc biệt
      </Title>
      <Text>Đặt hàng từ 3 sản phẩm trở lên và được giảm thêm 10% cho toàn bộ đơn hàng!</Text>
      <Button variant='filled' color='blue' className='mt-4'>
        Đặt ngay
      </Button>
    </Paper>
  );
}

function FoodItemCard({ item }: { item: any }) {
  return (
    <Card shadow='sm' padding='lg' radius='md' withBorder className='flex h-full flex-col'>
      <Card.Section>
        <Image loading='lazy' src={item.image} h={160} alt={item.name} />
      </Card.Section>

      <Text fw={500} size='lg' mt='md'>
        {item.name}
      </Text>
      <Text size='sm' c='dimmed' mt={5} className='flex-grow'>
        {item.price}
      </Text>

      <Badge color='red' variant='light' className='mb-4 mt-2'>
        {item.discount}
      </Badge>

      <Button variant='light' color='blue' fullWidth mt='md' radius='md'>
        Add to Cart
      </Button>
    </Card>
  );
}

function ComboCard({ combo }: { combo: any }) {
  const timeLeft = new Date(combo.endTime).getTime() - new Date().getTime();
  const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));

  return (
    <Card shadow='sm' padding='lg' radius='md' withBorder>
      <Group justify='space-between' mb='md'>
        <Text fw={700} size='lg'>
          {combo.name}
        </Text>
        <Badge color='yellow' variant='light'>
          <Group gap={4}>
            <IconClock size={14} />
            <Text size='xs'>{hoursLeft} hours left</Text>
          </Group>
        </Badge>
      </Group>
      <Stack gap='xs'>
        {combo.items.map((item: string, index: number) => (
          <Text key={index} size='sm'>
            {item}
          </Text>
        ))}
      </Stack>
      <Group justify='space-between' mt='md'>
        <Text fw={700} size='xl'>
          {combo.price}
        </Text>
        <Button variant='filled' color='green'>
          Order Combo
        </Button>
      </Group>
    </Card>
  );
}

function PaymentOptions() {
  return (
    <Tabs defaultValue='wallet'>
      <Tabs.List>
        <Tabs.Tab value='wallet' leftSection={<IconWallet size={14} />}>
          Wallet
        </Tabs.Tab>
        <Tabs.Tab value='card' leftSection={<IconCreditCard size={14} />}>
          Card
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value='wallet' pt='xs'>
        <Paper shadow='xs' p='md'>
          <Text>Wallet Balance: $50.00</Text>
          <Button variant='light' color='blue' fullWidth mt='sm'>
            Top Up Wallet
          </Button>
        </Paper>
      </Tabs.Panel>

      <Tabs.Panel value='card' pt='xs'>
        <Paper shadow='xs' p='md'>
          <Text>Pay securely with your credit or debit card</Text>
          <Button variant='light' color='blue' fullWidth mt='sm'>
            Add New Card
          </Button>
        </Paper>
      </Tabs.Panel>
    </Tabs>
  );
}
