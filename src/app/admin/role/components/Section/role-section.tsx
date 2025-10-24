'use client';
import { ActionIcon, Box, Card, Flex, Group, Highlight, Modal, Text, Title } from '@mantine/core';
import { IconSettings, IconShield } from '@tabler/icons-react';
import { useState } from 'react';
import PageSizeSelector from '~/components/Admin/Perpage';
import Empty from '~/components/Empty';
import CustomPagination from '~/components/Pagination';
import { UserRole } from '~/constants';
import UpdateRole from '../form/UpdateRole';

export const RoleSection = ({ data, s }: { data: any; s: string }) => {
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const currentItems = data?.roles || [];
  return (
    <>
      {currentItems?.length === 0 ? (
        <Empty hasButton={false} title='Không có kết quả phù hợp' content='' />
      ) : (
        <>
          <Box mt={'md'} className='grid gap-4 md:grid-cols-3'>
            {currentItems.map((item: any) => (
              <Card key={item.id} withBorder radius={'md'} mih={200}>
                <Box className='flex items-center justify-between'>
                  <Box className='flex items-center gap-2'>
                    <IconShield
                      className={`h-5 w-5 ${
                        item?.name === UserRole.ADMIN
                          ? 'text-red-500'
                          : item?.name === UserRole.STAFF
                            ? 'text-orange-500'
                            : 'text-blue-500'
                      }`}
                    />
                    <Highlight highlight={s} size='lg' fw={700}>
                      {item?.viName}
                    </Highlight>
                  </Box>
                  <ActionIcon variant='subtle' onClick={() => setSelectedRole(item)}>
                    <IconSettings className='h-4 w-4' />
                  </ActionIcon>
                </Box>
                <Box>
                  <Text size='sm' className='mb-4'>
                    {item?.permissions?.length || 0} quyền được chỉ định
                  </Text>
                  <Box className='max-h-32 space-y-1 overflow-y-auto'>
                    {item?.permissions?.slice(0, 6).map((permission: any) => (
                      <Flex gap={'md'} align={'center'} key={permission}>
                        <Box w={10}>👉🏽</Box>
                        <Highlight highlight={s} size='sm' key={permission}>
                          {permission?.viName || 'Đang cập nhật'}
                        </Highlight>
                      </Flex>
                    ))}
                    {item?.permissions.length > 6 && (
                      <Box className='text-muted-foreground text-sm'>+ {item?.permissions.length - 6} cái khác...</Box>
                    )}
                  </Box>
                </Box>
              </Card>
            ))}
            <Modal
              closeOnClickOutside={false}
              opened={selectedRole !== null}
              onClose={() => setSelectedRole(null)}
              size={'80%'}
              title={
                <Title order={2} className='font-quicksand'>
                  Cập nhật quyền vai trò
                </Title>
              }
            >
              <UpdateRole id={selectedRole?.id} setOpened={setSelectedRole} />
            </Modal>
          </Box>
          <Group justify='space-between' align='center' my={'md'}>
            <PageSizeSelector />
            <CustomPagination totalPages={data?.pagination.totalPages || 1} />
          </Group>
        </>
      )}
    </>
  );
};
