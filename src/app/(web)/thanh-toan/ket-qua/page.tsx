import { Box, Button, Divider, Group, Paper, SimpleGrid, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import {
  IconAlertTriangle,
  IconCircleCheck,
  IconClockPause,
  IconReceipt,
  IconShieldX,
  IconX
} from '@tabler/icons-react';
import Link from 'next/link';

import { getVnpayResponseInfo, VNPAY_TRANSACTION_STATUS } from '~/lib/vnpay/codes';
import { VNPAY_CONFIG } from '~/lib/vnpay/config';
import {
  extractVnpayParamsFromUrl,
  formatVnpayPayDateToVi,
  fromVnpayAmount,
  verifyVnpaySignature
} from '~/lib/vnpay/utils';

type PaymentResultPageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

type ResultType = 'success' | 'failed' | 'warning' | 'invalid' | 'empty';

const getFirstValue = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) return value[0];

  return value;
};

const formatPriceLocaleVi = (value?: number) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return 'Đang cập nhật';

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(value);
};

const getResultTheme = (type: ResultType) => {
  const theme = {
    success: {
      label: 'Đã thanh toán',
      color: 'green',
      className:
        'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-300'
    },
    warning: {
      label: 'Cần kiểm tra',
      color: 'yellow',
      className:
        'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-300'
    },
    failed: {
      label: 'Chưa thanh toán',
      color: 'red',
      className:
        'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-300'
    },
    invalid: {
      label: 'Không hợp lệ',
      color: 'red',
      className:
        'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-300'
    },
    empty: {
      label: 'Thiếu dữ liệu',
      color: 'gray',
      className:
        'border-slate-200 bg-slate-50 text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300'
    }
  } satisfies Record<ResultType, { label: string; color: string; className: string }>;

  return theme[type];
};

const ResultIcon = ({ type }: { type: ResultType }) => {
  if (type === 'success') return <IconCircleCheck size={30} />;
  if (type === 'warning') return <IconClockPause size={30} />;
  if (type === 'invalid') return <IconShieldX size={30} />;
  if (type === 'empty') return <IconReceipt size={30} />;

  return <IconX size={30} />;
};

const InfoItem = ({ label, value }: { label: string; value?: string | number | null }) => {
  return (
    <Box className='rounded-2xl border border-slate-200/80 bg-white/70 p-4 dark:border-white/10 dark:bg-white/[0.03]'>
      <Text size='xs' fw={800} tt='uppercase' lts={0.7} c='dimmed'>
        {label}
      </Text>

      <Text mt={6} fw={900} className='break-words text-slate-950 dark:text-white'>
        {value || 'Đang cập nhật'}
      </Text>
    </Box>
  );
};

const resolveResult = (searchParams: Record<string, string | string[] | undefined>) => {
  const urlSearchParams = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    const firstValue = getFirstValue(value);

    if (firstValue) {
      urlSearchParams.set(key, firstValue);
    }
  });

  const vnpParams = extractVnpayParamsFromUrl(urlSearchParams);

  if (Object.keys(vnpParams).length === 0) {
    return {
      type: 'empty' as ResultType,
      title: 'Không có dữ liệu thanh toán',
      description: 'Trang này cần dữ liệu trả về từ VNPay để hiển thị kết quả.',
      userMessage: 'Vui lòng quay lại đơn hàng và thử thanh toán lại.',
      isValidSignature: false,
      params: vnpParams
    };
  }

  const isValidSignature = verifyVnpaySignature({
    params: vnpParams,
    hashSecret: VNPAY_CONFIG.hashSecret
  });

  if (!isValidSignature) {
    return {
      type: 'invalid' as ResultType,
      title: 'Chữ ký thanh toán không hợp lệ',
      description: 'Dữ liệu trả về không vượt qua bước kiểm tra checksum.',
      userMessage: 'Vui lòng không dựa vào kết quả này để cập nhật đơn hàng.',
      isValidSignature,
      params: vnpParams
    };
  }

  const responseCode = vnpParams.vnp_ResponseCode;
  const transactionStatus = vnpParams.vnp_TransactionStatus;
  const responseInfo = getVnpayResponseInfo(responseCode) as any;

  const isSuccess = responseCode === '00' && transactionStatus === '00';

  return {
    type: isSuccess ? ('success' as ResultType) : responseInfo.type,
    title: responseInfo.title,
    description: responseInfo.description,
    userMessage: responseInfo.userMessage,
    isValidSignature,
    params: vnpParams
  };
};

export default function PaymentResultPage({ searchParams }: PaymentResultPageProps) {
  const result = resolveResult(searchParams);
  const params = result.params;
  const theme = getResultTheme(result.type);

  const orderId = params.vnp_TxnRef;
  const responseCode = params.vnp_ResponseCode;
  const transactionStatus = params.vnp_TransactionStatus;

  const transactionStatusText = transactionStatus
    ? VNPAY_TRANSACTION_STATUS[transactionStatus] || `Không xác định: ${transactionStatus}`
    : 'Đang cập nhật';

  return (
    <Box className='min-h-screen bg-slate-50 px-4 py-8 dark:bg-transparent sm:py-12'>
      <Stack gap='xl' className='mx-auto w-full max-w-4xl'>
        <Paper
          radius={28}
          p={{ base: 'lg', md: 34 }}
          className='relative overflow-hidden border border-slate-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-dark-card'
        >
          <Box className='absolute -right-24 -top-24 h-72 w-72 rounded-full bg-mainColor/[0.06] blur-3xl' />
          <Box className='absolute -bottom-28 left-10 h-64 w-64 rounded-full bg-slate-400/10 blur-3xl' />

          <Stack gap='xl' className='relative'>
            <Group gap='md' align='flex-start'>
              <ThemeIcon size={60} radius='xl' variant='light' color={theme.color}>
                <ResultIcon type={result.type} />
              </ThemeIcon>

              <Box>
                <Box
                  className={`mb-3 inline-flex rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.16em] ${theme.className}`}
                >
                  {theme.label}
                </Box>

                <Title order={1} className='font-quicksand text-2xl text-slate-950 dark:text-white sm:text-3xl'>
                  {result.title}
                </Title>

                <Text mt='sm' size='sm' c='dimmed' className='max-w-2xl leading-6'>
                  {result.description}
                </Text>
              </Box>
            </Group>

            <Paper radius='xl' p='md' className={`border ${theme.className}`}>
              <Group gap='sm' align='flex-start' wrap='nowrap'>
                <IconAlertTriangle size={18} className='mt-0.5 shrink-0' />

                <Text size='sm' className='leading-6'>
                  {result.userMessage}
                </Text>
              </Group>
            </Paper>

            <Divider className='border-slate-200 dark:border-white/10' />

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing='md'>
              <InfoItem label='Mã đơn hàng' value={orderId} />
              <InfoItem
                label='Số tiền'
                value={formatPriceLocaleVi(params.vnp_Amount ? fromVnpayAmount(params.vnp_Amount) : undefined)}
              />
              <InfoItem label='Mã giao dịch VNPay' value={params.vnp_TransactionNo} />
              <InfoItem label='Mã giao dịch ngân hàng' value={params.vnp_BankTranNo} />
              <InfoItem label='Ngân hàng' value={params.vnp_BankCode} />
              <InfoItem label='Loại thẻ' value={params.vnp_CardType} />
              <InfoItem label='Thời gian thanh toán' value={formatVnpayPayDateToVi(params.vnp_PayDate)} />
              <InfoItem label='Nội dung' value={params.vnp_OrderInfo} />
            </SimpleGrid>

            <Paper
              radius='xl'
              p='md'
              className='border border-dashed border-slate-200 bg-slate-50/70 dark:border-white/10 dark:bg-white/[0.03]'
            >
              <SimpleGrid cols={{ base: 1, sm: 3 }} spacing='md'>
                <InfoItem label='Response Code' value={responseCode} />
                <InfoItem label='Transaction Status' value={transactionStatus} />
                <InfoItem label='Checksum' value={result.isValidSignature ? 'Hợp lệ' : 'Không hợp lệ'} />
              </SimpleGrid>

              <Text mt='md' size='sm' c='dimmed' className='leading-6'>
                Trạng thái VNPay: {transactionStatusText}
              </Text>
            </Paper>

            <Group justify='space-between' gap='sm'>
              <Button component={Link} href='/don-hang-cua-toi' radius='xl' variant='light' color='gray'>
                Về đơn hàng của tôi
              </Button>

              <Group gap='sm'>
                {orderId && (
                  <Button component={Link} href={`/don-hang-cua-toi/${orderId}`} radius='xl' variant='light'>
                    Xem chi tiết đơn
                  </Button>
                )}

                {result.type !== 'success' && result.type !== 'warning' && orderId && (
                  <Button component={Link} href={`/don-hang-cua-toi/${orderId}`} radius='xl' className='bg-mainColor'>
                    Thanh toán lại
                  </Button>
                )}
              </Group>
            </Group>
          </Stack>
        </Paper>

        <Text ta='center' size='xs' c='dimmed'>
          Không chia sẻ đường dẫn kết quả thanh toán vì URL có chứa thông tin giao dịch.
        </Text>
      </Stack>
    </Box>
  );
}
