import { Box, Image, Table, Text } from '@mantine/core';
import { VoucherType } from '@prisma/client';
import { formatPriceLocaleVi } from '~/app/lib/utils/format/formatPrice';

type invoicePrintProps = {
  data: any;
  printRef: any;
};

export default function InvoicePrintTemplate(props: invoicePrintProps) {
  const { data, printRef } = props || {};

  const productSale: any = data.orderItems || [];
  const totalPrice = data?.orderItems?.reduce((acc: any, item: any) => acc + item?.product?.price * item.quantity, 0);
  const totalDiscount =
    data?.orderItems?.reduce((acc: any, item: any) => {
      if (item?.product?.discount > 0) {
        acc += item?.product?.discount * item.quantity;
      }
      return acc;
    }, 0) || 0;

  const totalDiscountVoucher = data?.vouchers?.reduce((acc: any, voucher: any) => {
    if (voucher.type === VoucherType.PERCENTAGE) {
      const discount =
        (productSale?.reduce((acc: any, item: any) => acc + item.price * item.quantity, 0) * voucher.discountValue) /
        100;
      if (discount > voucher.maxDiscount) {
        acc += voucher.maxDiscount;
      } else {
        acc += discount;
      }
    } else if (voucher.type === VoucherType.FIXED) {
      acc += voucher.discountValue;
    }
    return acc;
  }, 0);
  const tax = totalPrice * 0.1;
  const finalTotal = totalPrice - totalDiscount - totalDiscountVoucher + tax;
  return (
    <Box ref={printRef} p={'xl'}>
      <Box display={'flex'} style={{ flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <Image src='/logo/logo_phungfood_1.png' alt='logo' w={250} p={0} />
        <Text color={'dark'} fz={18}>
          Đầu lộ Tân Thành, khóm 9, phường 6, Cà Mau
        </Text>
        <Text color={'dark'} fz={18}>
          webp/hotline: 0937842680
        </Text>
        <Text color={'dark'} fz={18}>
          https://www.phungfood.vn
        </Text>
        <Text color={'dark'} fw={'bold'} fz={28}>
          Hoá đơn bán hàng
        </Text>
      </Box>
      <Box>
        <Box display={'flex'} style={{ flexDirection: 'column', gap: 8 }}>
          <Text color={'dark'} fz={18}>
            Thu Ngân: {'An Luu'}
          </Text>
          <Text color={'dark'} fz={18}>
            Seller: {'An Luu'}
          </Text>
          <Text color={'dark'} fz={18}>
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
          <Text color={'dark'} fz={18} fw={'bold'}>
            Tổng hoá đơn:
          </Text>
          <Text color={'dark'}>{formatPriceLocaleVi(totalPrice || 0)}</Text>
        </Box>
        <Box display={'flex'} style={{ justifyContent: 'space-between' }}>
          <Text color={'dark'} fz={18} fw={'bold'}>
            Giảm giá:
          </Text>
          <Text color={'dark'}>- {formatPriceLocaleVi(totalDiscount || 0)}</Text>
        </Box>
        {/* {sortedInvoicePaymentMethods && (
          <Text fs='italic' fz={18}>
            {sortedInvoicePaymentMethods?.map((invoicePaymentMethod: any, index: number) => {
              return (
                <Flex justify={'space-between'}>
                  <Flex>
                    <Text style={{ opacity: index !== 0 ? 0 : 1 }} color={'dark'} fz={18} fw={'bold'}>
                      Đã thanh toán
                    </Text>
                    <Text color={'dark'} fz={18} fw={'bold'} ml={4}>
                      - {invoicePaymentMethod?.paymentMethod?.name} (VNĐ):
                    </Text>
                  </Flex>
                  <Box key={index}>
                    {invoicePaymentMethod?.createdAt && (
                      <Text>{`Trả vào ${formatDate(
                        invoicePaymentMethod?.createdAt
                      )} - ${formatPriceLocaleVi(invoicePaymentMethod?.price)}`}</Text>
                    )}
                  </Box>
                </Flex>
              );
            })}
          </Text>
        )} */}
        {/* <Text color={'dark'}>
            {formatPriceLocaleVi(totalInvoicePayment || 0)}
          </Text> */}
        <Box display={'flex'} style={{ justifyContent: 'space-between' }}>
          <Text color={'dark'} fz={18} fw={'bold'}>
            Khuyến mãi (voucher):
          </Text>
          <Text color={'dark'}>- {formatPriceLocaleVi(totalDiscountVoucher || 0)}</Text>
        </Box>
        <Box display={'flex'} style={{ justifyContent: 'space-between' }}>
          <Text color={'dark'} fz={18} fw={'bold'}>
            Thuế (10%):
          </Text>
          <Text color={'dark'}>- {formatPriceLocaleVi(tax || 0)}</Text>
        </Box>
        <Box display={'flex'} style={{ justifyContent: 'space-between' }}>
          <Text color={'dark'} fz={18} fw={'bold'}>
            Giá cuối:
          </Text>
          <Text color={'dark'}>{formatPriceLocaleVi(finalTotal || 0)}</Text>
        </Box>
        <Box display={'flex'} style={{ justifyContent: 'center' }}>
          <Text color={'dark'} fz={18} fs={'italic'}>
            CẢM ƠN QUÝ KHÁCH ĐÃ TIN TƯỞNG CHỌN LỰA PHUNGFOOD
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
