'use client';
import { Box, Table, Text } from '@mantine/core';
import { VoucherType } from '@prisma/client';
import { useMemo } from 'react';
import { caculateAmount } from '~/lib/FuncHandler/calculateLevel';
import { formatPriceLocaleVi } from '~/lib/FuncHandler/Format';
import Logo from '../Logo';

type invoicePrintProps = {
  data: any;
  printRef: any;
};

export default function InvoicePrintTemplate(props: invoicePrintProps) {
  const { data, printRef } = props || {};
  const productSale: any = data.orderItems || [];

  const { finalAmount, tax, totalProductDiscount, totalOriginalPrice, totalVoucherAmount } = useMemo(() => {
    return caculateAmount({
      products: [
        {
          discount: productSale?.discount ?? 0,
          price: productSale?.price ?? 0,
          quantity: productSale?.quantity ?? 1
        }
      ],
      vouchers: (data?.vouchers ?? [])?.map((voucher: any) => ({
        discountValue: voucher?.discountValue ?? 0,
        maxDiscount: voucher?.maxDiscount ?? 0,
        minOrderPrice: voucher?.minOrderPrice ?? 0,
        type: voucher?.type ?? VoucherType.FIXED
      }))
    });
  }, [
    productSale?.id,
    productSale?.price,
    productSale?.quantity,
    productSale?.discount,
    JSON.stringify(data?.vouchers)
  ]);

  return (
    <Box ref={printRef} p={'xl'}>
      <Box display={'flex'} style={{ flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <Logo className='w-[300px] text-mainColor' />
        <Text c={'dark'} fz={18}>
          Đầu lộ Tân Thành, khóm 9, phường 6, Cà Mau
        </Text>
        <Text c={'dark'} fz={18}>
          webp/hotline: 0937842680
        </Text>
        <Text c={'dark'} fz={18}>
          https://phung-food-new.vercel.app
        </Text>
        <Text c={'dark'} fw={'bold'} fz={28}>
          Hoá đơn bán hàng
        </Text>
      </Box>
      <Box>
        <Box display={'flex'} style={{ flexDirection: 'column', gap: 8 }}>
          <Text c={'dark'} fz={18}>
            Thu Ngân: {'An Luu'}
          </Text>
          <Text c={'dark'} fz={18}>
            Seller: {'An Luu'}
          </Text>
          <Text c={'dark'} fz={18}>
            Khách Hàng: {data?.user?.name}
          </Text>
        </Box>
        <Box my={8}>
          <Table withRowBorders withColumnBorders striped highlightOnHover fz='md' c='dark'>
            <thead style={{ background: '#f3f4f6' }}>
              <tr>
                {['STT', 'Sản phẩm', 'Số lượng', 'Giá', 'Giảm giá', 'Thành tiền'].map((header, index) => (
                  <th key={index} style={{ color: 'black', border: '1px solid black', padding: '8px' }}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {productSale?.map((saleOrderLine: any, index: number) => (
                <tr key={index}>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{index + 1}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{saleOrderLine?.product?.name || ''}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{saleOrderLine?.quantity || 0}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    {formatPriceLocaleVi(saleOrderLine?.price || 0)}
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    {formatPriceLocaleVi(saleOrderLine?.product?.discount || 0)}
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold' }}>
                    {formatPriceLocaleVi(
                      (saleOrderLine?.price || 0) * (saleOrderLine?.quantity || 0) -
                        (saleOrderLine?.product?.discount || 0) * (saleOrderLine?.quantity || 0)
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Box>
        <Box display={'flex'} style={{ justifyContent: 'space-between' }}>
          <Text c={'dark'} fz={18} fw={'bold'}>
            Tổng hoá đơn:
          </Text>
          <Text c={'dark'}>{formatPriceLocaleVi(totalOriginalPrice || 0)}</Text>
        </Box>
        <Box display={'flex'} style={{ justifyContent: 'space-between' }}>
          <Text c={'dark'} fz={18} fw={'bold'}>
            Giảm giá:
          </Text>
          <Text c={'dark'}>- {formatPriceLocaleVi(totalProductDiscount || 0)}</Text>
        </Box>
        <Box display={'flex'} style={{ justifyContent: 'space-between' }}>
          <Text c={'dark'} fz={18} fw={'bold'}>
            Khuyến mãi (voucher):
          </Text>
          <Text c={'dark'}>- {formatPriceLocaleVi(totalVoucherAmount || 0)}</Text>
        </Box>
        <Box display={'flex'} style={{ justifyContent: 'space-between' }}>
          <Text c={'dark'} fz={18} fw={'bold'}>
            Thuế (10%):
          </Text>
          <Text c={'dark'}>+ {formatPriceLocaleVi(tax || 0)}</Text>
        </Box>
        <Box display={'flex'} style={{ justifyContent: 'space-between' }}>
          <Text c={'dark'} fz={18} fw={'bold'}>
            Giá cuối:
          </Text>
          <Text c={'dark'}>{formatPriceLocaleVi(finalAmount || 0)}</Text>
        </Box>
        <Box display={'flex'} style={{ justifyContent: 'center' }}>
          <Text c={'dark'} fz={18} fs={'italic'}>
            CẢM ƠN QUÝ KHÁCH ĐÃ TIN TƯỞNG CHỌN LỰA PHUNGFOOD
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
