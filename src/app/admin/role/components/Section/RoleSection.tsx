'use client';
import { ActionIcon, Box, Card, Flex, Group, Highlight, Modal, Text, Title, Tooltip } from '@mantine/core';
import { IconEdit, IconSettings, IconShield, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import Empty from '~/components/Empty';
import CustomPagination from '~/components/Pagination';
import PageSizeSelector from '~/components/Perpage';
import { confirmDelete } from '~/lib/ButtonHandler/ButtonDeleteConfirm';
import { randomColorHex } from '~/lib/FuncHandler/RandomColorHex';
import { NotifySuccess } from '~/lib/FuncHandler/toast';
import { api } from '~/trpc/react';
import RoleUpsert from '../form/RoleUpsert';
import UpdatePermissionForRole from '../form/UpdatePermissionForRole';

export const RoleSection = ({ data, s }: { data: any; s: string }) => {
  const [selectedRole, setSelectedRole] = useState<{
    mode: 'update:role' | 'update:permissionForRole';
    data: any;
  } | null>(null);
  const currentItems = data?.roles || [];
  const utils = api.useUtils();
  const mutationDeleteRole = api.RolePermission.deleteRole.useMutation({
    onSuccess: () => {
      NotifySuccess('Chúc mừng bạn đã thao tác thành công.');
    },
    onError: () => {}
  });
  return (
    <>
      {currentItems?.length === 0 ? (
        <Empty hasButton={false} title='Không có kết quả phù hợp' content='' />
      ) : (
        <>
          <Box mt={'md'} className='grid gap-4 md:grid-cols-3'>
            {currentItems.map((item: any, index: number) => (
              <Card key={item.id} withBorder mih={200}>
                <Box className='flex items-center justify-between'>
                  <Box className='flex items-center gap-2'>
                    <IconShield
                      className={`h-5 w-5`}
                      style={{
                        color: randomColorHex(index + 10)
                      }}
                    />
                    <Highlight highlight={s} size='lg' fw={700}>
                      {item?.viName}
                    </Highlight>
                  </Box>
                  <Group>
                    <Tooltip label={'Cập nhật'}>
                      <ActionIcon
                        variant='subtle'
                        color='gray'
                        onClick={() => setSelectedRole({ mode: 'update:role', data: item })}
                      >
                        <IconEdit className='h-4 w-4' />
                      </ActionIcon>
                    </Tooltip>

                    <Tooltip label={'Xóa'}>
                      <ActionIcon
                        variant='subtle'
                        color='red'
                        onClick={() => {
                          confirmDelete({
                            id: item,
                            mutationDelete: mutationDeleteRole,
                            callback: () => {
                              utils.RolePermission.invalidate();
                            },
                            entityName: 'vai trò'
                          });
                        }}
                      >
                        <IconTrash className='h-4 w-4' />
                      </ActionIcon>
                    </Tooltip>

                    <Tooltip label={'Cập nhật quyền'}>
                      <ActionIcon
                        variant='subtle'
                        onClick={() => setSelectedRole({ mode: 'update:permissionForRole', data: item })}
                      >
                        <IconSettings className='h-4 w-4' />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Box>
                <Box>
                  <Text size='sm' className='mb-4'>
                    {item?.permissions?.length || 0} quyền được chỉ định
                  </Text>
                  <Box className='max-h-32 space-y-1 overflow-y-auto'>
                    {item?.permissions?.slice(0, 6).map((permission: any, index: number) => (
                      <Flex gap={'md'} align={'center'} key={permission}>
                        <Box w={10}>👉🏽</Box>
                        <Highlight
                          highlight={s}
                          size='sm'
                          key={permission}
                          style={{
                            fontWeight: 'bold',
                            color: randomColorHex(index)
                          }}
                        >
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
                  Tạo mới / Cập nhật quyền vai trò
                </Title>
              }
            >
              {selectedRole?.mode === 'update:role' ? (
                <RoleUpsert roleId={selectedRole?.data?.id} setOpened={setSelectedRole} />
              ) : (
                <UpdatePermissionForRole id={selectedRole?.data?.id} setOpened={setSelectedRole} />
              )}
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
