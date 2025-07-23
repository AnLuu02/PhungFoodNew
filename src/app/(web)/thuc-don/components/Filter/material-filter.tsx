'use client';
import { Button, Checkbox, CheckIcon, Flex, Group, ScrollAreaAutosize, Stack, Text } from '@mantine/core';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Empty from '~/components/Empty';

export const MaterialFilter = ({ materials }: any) => {
  const params = useSearchParams();
  const [valueMaterials, setValueMaterials] = useState<string[]>([...params.getAll('nguyen-lieu')]);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setValueMaterials([...params.getAll('nguyen-lieu')]);
  }, [params]);

  return materials?.length > 0 ? (
    <Stack gap='xs'>
      <Flex align={'center'} justify={'space-between'}>
        <Text size='md' fw={700}>
          NGUYÊN LIỆU
        </Text>
        {valueMaterials?.length > 0 && (
          <>
            <Button
              size='sm'
              fw={700}
              w={'max-content'}
              onClick={() => {
                const s = new URLSearchParams(params);
                if (valueMaterials?.length > 0) {
                  s.delete('nguyen-lieu');
                  valueMaterials.map((item, index) => {
                    s.append('nguyen-lieu', item);
                  });
                } else {
                  s.delete('nguyen-lieu');
                }
                router.push(`${pathname}?${s.toString()}`);
              }}
              variant='subtle'
            >
              Tìm kiếm
            </Button>
            <Button
              size='sm'
              fw={700}
              w={'max-content'}
              color='red'
              onClick={() => {
                const s = new URLSearchParams(params);
                setValueMaterials([]);
                s.delete('nguyen-lieu');
                router.push(`${pathname}?${s.toString()}`);
              }}
              variant='subtle'
            >
              Xóa
            </Button>
          </>
        )}
      </Flex>
      <ScrollAreaAutosize mah={260} scrollbarSize={6} type='auto'>
        <Stack gap='xs' pr={'xs'}>
          <Checkbox.Group value={valueMaterials} onChange={setValueMaterials}>
            <Group mt='xs'>
              {materials.map((type: any) => (
                <>
                  <Checkbox
                    icon={CheckIcon}
                    name='type'
                    value={type?.tag}
                    key={type?.id}
                    label={type?.name}
                    classNames={{
                      label: 'cursor-pointer font-medium hover:text-mainColor',
                      input:
                        'border-gray-300 text-mainColor data-[checked=true]:border-mainColor data-[checked=true]:bg-mainColor'
                    }}
                  />
                </>
              ))}
            </Group>
          </Checkbox.Group>
        </Stack>
      </ScrollAreaAutosize>
    </Stack>
  ) : (
    <Empty title='Chưa có nguyên liệu nào' hasButton={false} size='sm' content='' />
  );
};
