import { LocalOrderStatus } from '../zod/EnumType';

export const sampleOrders = Array.from({ length: 20 }, (_, i) => ({
  id: `order_${i + 1}`,
  payment: { name: i % 2 === 0 ? 'VNPAY' : 'COD' },
  originalTotal: (Math.random() * 500000 + 50000).toFixed(0),
  createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  status: ['COMPLETED', 'PROCESSING', 'DELIVERED', 'PENDING', 'CANCELLED'][i % 5]
}));

export const generateSampleOrdersInfoUser = (count = 50) => {
  const getRandomDate = () => {
    const daysAgo = Math.floor(Math.random() * 90);
    return new Date(Date.now() - daysAgo * 86400000).toISOString();
  };

  const getRandomPrice = () => Math.floor(Math.random() * 4950000) + 50000;

  const statuses = [
    LocalOrderStatus.PROCESSING,
    LocalOrderStatus.PENDING,
    LocalOrderStatus.DELIVERED,
    LocalOrderStatus.COMPLETED,
    LocalOrderStatus.CANCELLED
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `ORD${(i + 1).toString().padStart(4, '0')}`,
    date: getRandomDate(),
    originalTotal: getRandomPrice(),
    status: statuses[Math.floor(Math.random() * statuses.length)]
  }));
};

export const mockOrders = [
  { id: '1', date: '2023-05-01', originalTotal: 99.99, status: 'completed' },
  { id: '2', date: '2023-05-15', originalTotal: 149.99, status: 'processing' },
  { id: '3', date: '2023-05-20', originalTotal: 79.99, status: 'canceled' },
  { id: '4', date: '2023-06-01', originalTotal: 189.99, status: 'completed' },
  { id: '5', date: '2023-06-10', originalTotal: 59.99, status: 'processing' },
  { id: '6', date: '2023-06-15', originalTotal: 129.99, status: 'completed' }
];
