'use client';
import { Box, Button } from '@mantine/core';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import InvoicePrintTemplate from '~/app/_components/Template/InvoicePrintTemplate';
import { api } from '~/trpc/react';

export default function InvoiceToPrint({ id }: any) {
  const { data, isLoading } = api.Order.getOne.useQuery({ s: id });
  const order = data || [];
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef
  });

  return (
    <div>
      <Box style={{ display: 'none' }}>
        <InvoicePrintTemplate printRef={printRef} data={order} />
      </Box>

      <Button onClick={() => handlePrint()} size='xs' variant='outline' loading={isLoading}>
        In hóa đơn
      </Button>
    </div>
  );
}
