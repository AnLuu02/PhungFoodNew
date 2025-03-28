import { OrderStatus } from '@prisma/client';

export const sampleOrders = Array.from({ length: 20 }, (_, i) => ({
  id: `order_${i + 1}`,
  payment: { name: i % 2 === 0 ? 'VNPAY' : 'COD' },
  total: (Math.random() * 500000 + 50000).toFixed(0), // Số tiền ngẫu nhiên từ 50,000 đến 550,000
  createdAt: new Date(Date.now() - i * 86400000).toISOString(), // Mỗi đơn cách nhau 1 ngày
  status: ['COMPLETED', 'PROCESSING', 'DELIVERED', 'PENDING', 'CANCELLED'][i % 5] // Luân phiên trạng thái
}));

export const generateSampleOrdersInfoUser = (count = 50) => {
  const getRandomDate = () => {
    const daysAgo = Math.floor(Math.random() * 90); // Tối đa 90 ngày trước
    return new Date(Date.now() - daysAgo * 86400000).toISOString();
  };

  const getRandomPrice = () => Math.floor(Math.random() * 4950000) + 50000;

  const statuses = [
    OrderStatus.PROCESSING,
    OrderStatus.PENDING,
    OrderStatus.DELIVERED,
    OrderStatus.COMPLETED,
    OrderStatus.CANCELLED
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `ORD${(i + 1).toString().padStart(4, '0')}`,
    date: getRandomDate(),
    total: getRandomPrice(),
    status: statuses[Math.floor(Math.random() * statuses.length)]
  }));
};
