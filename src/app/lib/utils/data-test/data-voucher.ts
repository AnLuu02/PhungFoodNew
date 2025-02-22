export const dataVoucher = [
  {
    id: 1,
    name: 'Giảm giá 15%',
    description: 'Giảm giá 15% áp dụng cho toàn bộ sản phẩm của cửa hàng Kamala Shop.',
    type: 'Percentage',
    discountValue: 15,
    voucherVariants: [
      {
        id: 11,
        name: 'Giảm tối đa 100k',
        description:
          'Giảm giá 15%, Giảm tối 100k cho đơn hàng tối thiểu 500k áp dụng cho toàn bộ sản phẩm của cửa hàng Kamala Shop.',
        type: 'Percentage',
        maxDiscount: 100000,
        minOrderPrice: 50000000,
        status: 'Active',
        quantity: 10,
        startDate: '2024-11-15T00:00:00.000Z',
        endDate: '2025-11-20T00:00:00.000Z'
      },
      {
        id: 12,
        name: 'Giảm tối đa 50k',
        description:
          'Giảm giá 10%, Giảm tối đa 50k cho đơn hàng tối thiểu 300k áp dụng cho toàn bộ sản phẩm của cửa hàng Kamala Shop.',
        type: 'Percentage',
        maxDiscount: 50000,
        minOrderPrice: 300000,
        status: 'Active',
        quantity: 15,
        startDate: '2024-11-14T00:00:00.000Z',
        endDate: '2025-11-15T00:00:00.000Z'
      },
      {
        id: 13,
        name: 'Giảm tối đa 200k',
        description:
          'Giảm giá 20%, Giảm tối đa 200k cho đơn hàng tối thiểu 800k áp dụng cho toàn bộ sản phẩm của cửa hàng Kamala Shop.',
        type: 'Percentage',
        maxDiscount: 200000,
        minOrderPrice: 800000,
        status: 'Active',
        quantity: 5,
        startDate: '2024-11-14T00:00:00.000Z',
        endDate: '2025-11-20T00:00:00.000Z'
      }
    ]
  },
  {
    id: 2,
    name: 'Giảm giá 50k',
    description: 'Giảm giá trực tiếp 50k áp dụng cho toàn bộ sản phẩm của cửa hàng Kamala Shop.',
    type: 'Fixed',
    discountValue: 50000,
    voucherVariants: [
      {
        id: 21,
        name: 'Giảm ngay 50k',
        description: 'Giảm ngay 50k cho đơn hàng tối thiểu 300k áp dụng cho toàn bộ sản phẩm của cửa hàng Kamala Shop.',
        type: 'Fixed',
        discountValue: 50000,
        minOrderPrice: 300000,
        status: 'Active',
        quantity: 10,
        startDate: '2024-11-16T00:00:00.000Z',
        endDate: '2025-11-25T00:00:00.000Z'
      },
      {
        id: 22,
        name: 'Giảm ngay 100k',
        description:
          'Giảm ngay 100k cho đơn hàng tối thiểu 500k áp dụng cho toàn bộ sản phẩm của cửa hàng Kamala Shop.',
        type: 'Fixed',
        discountValue: 100000,
        minOrderPrice: 500000,
        status: 'Active',
        quantity: 8,
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 2))
      },
      {
        id: 23,
        name: 'Giảm ngay 150k',
        description:
          'Giảm ngay 150k cho đơn hàng tối thiểu 700k áp dụng cho toàn bộ sản phẩm của cửa hàng Kamala Shop.',
        type: 'Fixed',
        discountValue: 150000,
        minOrderPrice: 700000,
        status: 'Active',
        quantity: 5,
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 3))
      }
    ]
  },
  {
    id: 3,
    name: 'Giảm giá 100k',
    description: 'Giảm giá trực tiếp 100k áp dụng cho toàn bộ sản phẩm của cửa hàng Kamala Shop.',
    type: 'Fixed',
    discountValue: 100000,
    images: [
      {
        url: '/img/background-lookup-fengshui.jpg'
      }
    ],
    voucherVariants: [
      {
        id: 24,
        name: 'Giảm ngay 100k',
        description:
          'Giảm ngay 100k cho đơn hàng tối thiểu 400k áp dụng cho toàn bộ sản phẩm của cửa hàng Kamala Shop.',
        type: 'Fixed',
        discountValue: 100000,
        minOrderPrice: 400000,
        status: 'Active',
        quantity: 7,
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 1))
      },
      {
        id: 25,
        name: 'Giảm ngay 120k',
        description:
          'Giảm ngay 120k cho đơn hàng tối thiểu 600k áp dụng cho toàn bộ sản phẩm của cửa hàng Kamala Shop.',
        type: 'Fixed',
        discountValue: 120000,
        minOrderPrice: 600000,
        status: 'Active',
        quantity: 6,
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 2))
      },
      {
        id: 26,
        name: 'Giảm ngay 200k',
        description:
          'Giảm ngay 200k cho đơn hàng tối thiểu 1000k áp dụng cho toàn bộ sản phẩm của cửa hàng Kamala Shop.',
        type: 'Fixed',
        discountValue: 200000,
        minOrderPrice: 1000000,
        status: 'Active',
        quantity: 4,
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 3))
      }
    ]
  }
];
