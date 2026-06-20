import { formatDateViVN } from './Format';

export const calculateMoney = (product: { price: number; quantity: number }[]) => {
  return product?.reduce(
    (acc: number, item: { price: number; quantity: number }) => acc + item.price * item.quantity,
    0
  );
};

export const allowedVoucher = (orderPrice: number, products: { price: number; quantity: number }[]) => {
  return orderPrice <= calculateMoney(products);
};
export const hoursRemainingVoucher = (startDate: Date | string | number, endDate: Date | string | number) => {
  const now = new Date().getTime();
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  if (now < start) {
    const diff = start - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return {
      type: 'upcoming',
      value: hours < 24 ? `Có hiệu lực sau: ${hours} giờ` : `Có hiệu lực từ: ${formatDateViVN(startDate)}`
    };
  } else if (now >= start && now < end) {
    const timeLeft = end - now;
    const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
    if (hoursLeft < 23) {
      return {
        type: 'expiringSoon',
        value: `Sắp hết hạn: Còn ${hoursLeft} giờ`
      };
    } else {
      return {
        type: 'active',
        value: `HSD: ${formatDateViVN(endDate)} `
      };
    }
  }
};

export const getPromotionStatus = (startDate: Date, endDate: Date, isActive: boolean | null) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (!isActive)
    return {
      name: 'INACTIVE',
      viName: 'Tạm ẩn'
    };
  if (now < start)
    return {
      name: 'SCHEDULED',
      viName: 'Sắp đến'
    };
  if (now > end)
    return {
      name: 'EXPIRED',
      viName: 'Hết hạn'
    };
  return {
    name: 'ACTIVE',
    viName: 'Khả dụng'
  };
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return {
        color: 'blue',
        textBlur: 'text-blue-500/20',
        bgBlur: 'bg-blue-500/20'
      };
    case 'SCHEDULED':
      return {
        color: 'yellow',
        textBlur: 'text-yellow-500/20',
        bgBlur: 'bg-yellow-500/20'
      };
    case 'EXPIRED':
      return {
        color: 'red',
        textBlur: 'text-red-500/20',
        bgBlur: 'bg-red-500/20'
      };
    case 'INACTIVE':
      return {
        color: 'gray',
        textBlur: 'text-gray-500/20',
        bgBlur: 'bg-gray-500/20'
      };
    default:
      return {
        color: 'gray',
        textBlur: 'text-gray-500/20',
        bgBlur: 'bg-gray-500/20'
      };
  }
};
