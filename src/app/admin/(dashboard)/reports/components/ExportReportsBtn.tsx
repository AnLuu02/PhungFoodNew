import { Button } from '@mantine/core';
import { IconCaretDown, IconFileArrowRight } from '@tabler/icons-react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export const ExportReports = () => {
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);
  const params = new URLSearchParams(searchParams);
  const period = params.get('period');
  const handleExportReports = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/export-reports', {
        method: 'POST',
        body: JSON.stringify({ period: Number(period) || 1 }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error?.message || 'Xuất PDF thất bại');
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'bao-cao-' + (period ? period + '-ngay' : 'hom-nay') + '.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Có lỗi khi tải file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        size='sm'
        variant='subtle'
        leftSection={<IconFileArrowRight size={16} />}
        rightSection={<IconCaretDown size={16} />}
        onClick={handleExportReports}
        styles={{
          root: {
            border: '1px solid '
          }
        }}
        loading={loading}
        classNames={{
          root: `!rounded-md !border-[#e5e5e5] !font-bold text-black hover:bg-mainColor/10 hover:text-black data-[active=true]:!border-mainColor data-[active=true]:!bg-mainColor data-[active=true]:!text-white dark:!border-dark-dimmed dark:text-white`
        }}
      >
        Xuất báo cáo
      </Button>
    </>
  );
};
