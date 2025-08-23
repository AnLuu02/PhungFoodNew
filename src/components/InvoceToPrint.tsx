'use client';
import { Box, Button } from '@mantine/core';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import InvoicePrintTemplate from '~/components/Template/InvoicePrintTemplate';
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
        size='md'
        variant='subtle'
        loading={isLoading}
        className={`!rounded-md !border-[#e5e5e5] !font-bold text-black duration-200 hover:bg-gray-100 hover:text-black/90 dark:!border-dark-dimmed`}
      >
        In hóa đơn
      </Button>
    </Box>
  );
}
