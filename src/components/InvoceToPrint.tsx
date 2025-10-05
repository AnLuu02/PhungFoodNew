'use client';
import { Box, Button } from '@mantine/core';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import InvoicePrintTemplate from '~/components/Template/invoice-print-template';
import { api } from '~/trpc/react';

export default function InvoiceToPrint({ id }: any) {
  const { data, isLoading } = api.Order.getOne.useQuery({ s: id });
  const order = data || [];
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef
  });

  return (
    <Box>
      <Box style={{ display: 'none' }}>
        <InvoicePrintTemplate printRef={printRef} data={order} />
      </Box>

      <Button
        onClick={() => handlePrint()}
        size='sm'
        variant='subtle'
        loading={isLoading}
        className={`!rounded-md !border-gray-300 !font-bold text-black duration-200 hover:bg-mainColor/10 hover:text-black/90 dark:!border-dark-dimmed dark:text-white`}
      >
        In hóa đơn
      </Button>
    </Box>
  );
}
