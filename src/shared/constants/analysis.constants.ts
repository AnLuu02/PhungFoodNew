import dayjs from '~/lib/dayjs';
import type {
  Anomaly,
  CustomerSegment,
  DailyMetric,
  Forecast,
  Insight,
  MenuEngineeringItem,
  ProductPerformance,
  RevenueBreakdown
} from '~/shared/types/analysis.types';

const generateDailyData = (days: number = 90): DailyMetric[] => {
  const today = new Date();
  const startDate = dayjs().subtract(days, 'day');
  const dates = [];

  for (let i = 0; i <= days; i++) {
    dates.push(dayjs(startDate).add(i, 'day'));
  }

  return dates.map((date, index) => {
    const dayOfWeek = date.toDate().getDate();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const dayFactor = isWeekend ? 1.4 : 1.0;

    const trendFactor = 1 + (index / days) * 0.3;
    const seasonality = 1 + Math.sin((index / 7) * Math.PI * 2) * 0.1;

    const baseRevenue = 15000 * dayFactor * trendFactor * seasonality;
    const noise = 0.9 + Math.random() * 0.2;
    const revenue = Math.round(baseRevenue * noise);

    const baseOrders = 120 * dayFactor * trendFactor * seasonality;
    const orders = Math.round(baseOrders * (0.9 + Math.random() * 0.2));
    const avgOrderValue = revenue / orders;

    const newCustomers = Math.round(15 * dayFactor * trendFactor * (0.7 + Math.random() * 0.6));
    const returningCustomers = Math.round(orders * (0.4 + Math.random() * 0.2));
    const profit = Math.round(revenue * 0.35);

    return {
      date: dayjs(date).format('YYYY-MM-DD'),
      revenue,
      orders,
      avgOrderValue,
      newCustomers,
      returningCustomers,
      profit
    };
  });
};

export const dailyData = generateDailyData(90);

export const revenueBreakdown: RevenueBreakdown = {
  byCategory: [
    { name: 'Main Dishes', value: 425000 },
    { name: 'Appetizers', value: 185000 },
    { name: 'Beverages', value: 156000 },
    { name: 'Desserts', value: 98000 },
    { name: 'Special Combos', value: 210000 }
  ],
  byProduct: [
    { name: 'Grilled Salmon', revenue: 125000, quantity: 1250 },
    { name: 'Beef Burger', revenue: 98500, quantity: 1450 },
    { name: 'Caesar Salad', revenue: 76500, quantity: 1100 },
    { name: 'Margherita Pizza', revenue: 89000, quantity: 890 },
    { name: 'Iced Latte', revenue: 45000, quantity: 1800 },
    { name: 'Chocolate Cake', revenue: 32000, quantity: 640 }
  ],
  byBranch: [
    { name: 'Downtown', revenue: 452000 },
    { name: 'Uptown', revenue: 389000 },
    { name: 'Westside', revenue: 295000 },
    { name: 'Eastside', revenue: 341000 }
  ],
  byHour: Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    revenue:
      i >= 11 && i <= 13
        ? 12000 + Math.random() * 3000
        : i >= 18 && i <= 21
          ? 18000 + Math.random() * 4000
          : i >= 7 && i <= 9
            ? 3000 + Math.random() * 2000
            : 500 + Math.random() * 1000
  })),
  byWeekday: [
    { weekday: 'Mon', revenue: 125000 },
    { weekday: 'Tue', revenue: 132000 },
    { weekday: 'Wed', revenue: 141000 },
    { weekday: 'Thu', revenue: 158000 },
    { weekday: 'Fri', revenue: 189000 },
    { weekday: 'Sat', revenue: 210000 },
    { weekday: 'Sun', revenue: 195000 }
  ]
};

export const businessInsights: Insight[] = [
  {
    id: '1',
    title: 'Weekend Revenue Surge',
    description:
      'Doanh thu cuối tuần cao hơn 42% so với ngày thường. Đề xuất tăng cường nhân viên và khuyến mãi đặc biệt vào Thứ 6 - Chủ nhật.',
    priority: 'high',
    confidenceScore: 94,
    impactLevel: 'high',
    suggestedAction: 'Điều chỉnh lịch làm việc, tăng stock nguyên liệu phổ biến cuối tuần.'
  },
  {
    id: '2',
    title: 'Beverage Category Growth',
    description: 'Danh mục đồ uống tăng trưởng 28% trong 30 ngày qua, đặc biệt là đồ uống không cồn và trà sữa.',
    priority: 'high',
    confidenceScore: 89,
    impactLevel: 'high',
    suggestedAction: 'Mở rộng menu đồ uống, tạo combo với món chính.'
  },
  {
    id: '3',
    title: 'Returning Customer Drop',
    description: 'Tỷ lệ khách hàng quay lại giảm 12% so với tháng trước. Cần xem xét chương trình loyalty.',
    priority: 'medium',
    confidenceScore: 78,
    impactLevel: 'medium',
    suggestedAction: 'Triển khai chương trình tích điểm, gửi voucher cho khách cũ.'
  },
  {
    id: '4',
    title: 'Peak Hour Efficiency',
    description: 'Thời gian xử lý đơn hàng tăng 25% vào giờ cao điểm (12h-13h, 19h-20h).',
    priority: 'high',
    confidenceScore: 92,
    impactLevel: 'high',
    suggestedAction: 'Tối ưu quy trình bếp, thêm nhân viên part-time.'
  }
];

export const anomalies: Anomaly[] = [
  {
    id: '1',
    type: 'Revenue Drop',
    severity: 'warning',
    impact: 'Revenue giảm 18% vào ngày 15/11 so với cùng kỳ tuần trước',
    description:
      'Phát hiện bất thường: doanh thu giảm đột biến, có thể do lỗi hệ thống thanh toán hoặc đối thủ khuyến mãi.',
    suggestedInvestigation: 'Kiểm tra log thanh toán, xem xét hoạt động khuyến mãi của đối thủ.',
    timestamp: '2024-11-15'
  },
  {
    id: '2',
    type: 'High Refund Rate',
    severity: 'critical',
    impact: 'Tỷ lệ hoàn tiền tăng 320% trong 3 ngày qua',
    description: 'Refund rate đạt 8.5% so với mức bình thường 2%. Chủ yếu từ món "Grilled Salmon".',
    suggestedInvestigation: 'Kiểm tra chất lượng nguyên liệu cá hồi, phản hồi khách hàng.',
    timestamp: '2024-11-18'
  },
  {
    id: '3',
    type: 'Order Spike',
    severity: 'info',
    impact: 'Lượt đặt hàng tăng đột biến +156% lúc 2h-3h sáng',
    description: 'Phát hiện traffic bất thường vào khung giờ thấp điểm.',
    suggestedInvestigation: 'Kiểm tra nguồn traffic, có thể do bot hoặc sự kiện đặc biệt.',
    timestamp: '2024-11-17'
  }
];

export const revenueForecast: Forecast = {
  dates: [
    'Nov 20',
    'Nov 21',
    'Nov 22',
    'Nov 23',
    'Nov 24',
    'Nov 25',
    'Nov 26',
    'Nov 27',
    'Nov 28',
    'Nov 29',
    'Nov 30',
    'Dec 1'
  ],
  actual: [182000, 178000, 191000, 215000, 238000, 245000, 221000, null, null, null, null, null],
  forecast: [null, null, null, null, null, null, 218000, 225000, 242000, 268000, 274000, 259000],
  upperBound: [null, null, null, null, null, null, 232000, 241000, 261000, 289000, 298000, 280000],
  lowerBound: [null, null, null, null, null, null, 204000, 209000, 223000, 247000, 250000, 238000],
  confidence: 85
};

export const orderForecast: Forecast = {
  dates: [
    'Nov 20',
    'Nov 21',
    'Nov 22',
    'Nov 23',
    'Nov 24',
    'Nov 25',
    'Nov 26',
    'Nov 27',
    'Nov 28',
    'Nov 29',
    'Nov 30',
    'Dec 1'
  ],
  actual: [1450, 1420, 1520, 1680, 1850, 1920, 1750, null, null, null, null, null],
  forecast: [null, null, null, null, null, null, 1740, 1790, 1910, 2080, 2140, 2030],
  upperBound: [null, null, null, null, null, null, 1850, 1910, 2050, 2240, 2310, 2190],
  lowerBound: [null, null, null, null, null, null, 1630, 1670, 1770, 1920, 1970, 1870],
  confidence: 82
};

export const customerSegments: CustomerSegment[] = [
  { name: 'VIP', count: 245, revenue: 185000, color: '#F59E0B' },
  { name: 'Loyal', count: 1250, revenue: 342000, color: '#10B981' },
  { name: 'New', count: 3420, revenue: 289000, color: '#3B82F6' },
  { name: 'At Risk', count: 890, revenue: 76000, color: '#EF4444' }
];

export const topProducts: ProductPerformance[] = [
  { name: 'Grilled Salmon', revenue: 125000, quantity: 1250, profit: 62500, growth: 12.4, category: 'Main' },
  { name: 'Beef Burger', revenue: 98500, quantity: 1450, profit: 49200, growth: 8.2, category: 'Main' },
  { name: 'Caesar Salad', revenue: 76500, quantity: 1100, profit: 34425, growth: -2.1, category: 'Appetizer' },
  { name: 'Margherita Pizza', revenue: 89000, quantity: 890, profit: 40050, growth: 15.7, category: 'Main' },
  { name: 'Iced Latte', revenue: 45000, quantity: 1800, profit: 31500, growth: 28.3, category: 'Beverage' }
];

export const menuEngineeringMatrix: MenuEngineeringItem[] = [
  { name: 'Grilled Salmon', popularity: 85, profitability: 92, quadrant: 'stars' },
  { name: 'Beef Burger', popularity: 92, profitability: 78, quadrant: 'stars' },
  { name: 'Caesar Salad', popularity: 68, profitability: 65, quadrant: 'puzzles' },
  { name: 'Iced Latte', popularity: 88, profitability: 82, quadrant: 'cashCows' },
  { name: 'Truffle Pasta', popularity: 45, profitability: 88, quadrant: 'cashCows' },
  { name: 'Spring Rolls', popularity: 72, profitability: 52, quadrant: 'puzzles' },
  { name: 'Chocolate Cake', popularity: 58, profitability: 62, quadrant: 'dogs' }
];

export const operationalMetrics = {
  fulfillmentTime: { current: 28.5, previous: 24.2, unit: 'minutes' },
  cancellationRate: { current: 3.2, previous: 2.8, unit: '%' },
  refundRate: { current: 4.8, previous: 2.1, unit: '%' },
  deliveryPerformance: { current: 92.5, previous: 94.2, unit: '%' },
  kitchenEfficiency: { current: 78, previous: 82, unit: '%' },
  peakHours: [
    { hour: '12:00-13:00', orderVolume: 245, avgTime: 18.5 },
    { hour: '13:00-14:00', orderVolume: 178, avgTime: 14.2 },
    { hour: '19:00-20:00', orderVolume: 312, avgTime: 22.1 },
    { hour: '20:00-21:00', orderVolume: 256, avgTime: 19.8 }
  ]
};

export const systemHealth = {
  dataFreshness: '2 minutes ago',
  lastSync: new Date().toISOString(),
  apiHealth: 99.8,
  dbHealth: 99.9,
  analyticsProcessingStatus: 'operational' as const
};
