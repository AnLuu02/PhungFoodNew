'use client';
import { Group, Select, Title } from '@mantine/core';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const PageSizeSelector = () => {
  const pathname = usePathname();
  const params = useSearchParams();
  const router = useRouter();
  const limit = params.get('limit') || '3';

  const handlePageSizeChange = (value: string | null) => {
    const s = new URLSearchParams(params);
    s.delete('limit');
    s.set('limit', value ?? '3');
    const url = `${pathname}?${s.toString()}`;
    router.push(url);
  };

  return (
    <Group align='center'>
      <Title order={5} className='font-quicksand'>
        Hiển thị:
      </Title>
      <Select
        size={'xs'}
        defaultValue={limit}
        w={120}
        id='pageSize'
        value={limit}
        onChange={handlePageSizeChange}
        data={[
          { value: '3', label: '3' },
          { value: '5', label: '5' },
          { value: '7', label: '7' },
          { value: '10', label: '10' }
        ]}
        placeholder='Chọn Số lượng bản ghi mỗi trang'
      />
    </Group>
  );
};

export default PageSizeSelector;
