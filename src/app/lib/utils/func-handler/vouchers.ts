import { formatDate } from '../format/formatDate';

export const calculateMoney = (product: any) => {
  return product?.reduce((acc: any, item: any) => acc + item.price * item.quantity, 0);
};
export const calculateMoneyWithDiscount = (products: any[], listVoucher: any) => {
  const subtotal = products?.reduce((acc, item) => acc + item.price * item.quantity, 0);
  let totalDiscount = 0;
  listVoucher.forEach((voucher: any) => {
    if (voucher.type === 'Percentage') {
      const discount = (subtotal * voucher.discountValue) / 100;
      if (discount > voucher.maxDiscount) {
        totalDiscount += voucher.maxDiscount;
      } else {
        totalDiscount += discount;
      }
    } else if (voucher.type === 'Fixed') {
      totalDiscount += voucher.discountValue;
    }
  });
  return {
    discount: totalDiscount,
    totalDiscount: Math.min(totalDiscount, subtotal) || 0,
    totalAfterDiscount: Math.max(subtotal - totalDiscount, 0) || 0
  };
};
export const allowedVoucher = (orderPrice: number, products: any) => {
  return orderPrice <= calculateMoney(products);
};
export const hoursRemainingVoucher = (startDate: any, endDate: any) => {
  const now = new Date().getTime();
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  if (now < start) {
    const diff = start - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return {
      type: 'upcoming',
      value: hours < 24 ? `Có hiệu lực sau: ${hours} giờ` : `Có hiệu lực từ: ${formatDate(startDate)}`
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
        value: `HSD: ${formatDate(endDate)} `
      };
    }
  }
};
