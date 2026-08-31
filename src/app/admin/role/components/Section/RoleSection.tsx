'use client';
import { ActionIcon, Box, Card, Divider, Group, Highlight, Modal, Text, Title, Tooltip } from '@mantine/core';
import { IconEdit, IconSettings, IconShield, IconTrash } from '@tabler/icons-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Empty from '~/components/Empty';
import { ModalUpsertSkeleton } from '~/components/ModelUpsertSkeleton';
import CustomPagination from '~/components/Pagination';
import PageSizeSelector from '~/components/Perpage';
import { onHandleModalAction } from '~/lib/ButtonHandler/ButtonHandleAction';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { FindRole } from '~/shared/type-trpc/role-permission.type-trpc';
import { api } from '~/trpc/react';
import RoleUpsert from '../form/RoleUpsert';
import UpdatePermissionForRole from '../form/UpdatePermissionForRole';

const getRoleTier = (count: number) => {
  if (count > 20) {
    return {
      border: 'border-indigo-300 ring-1 ring-indigo-100',
      badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      tierLabel: 'Toàn quyền',
      accentColor: '#6366f1'
    };
  } else if (count >= 15) {
    return {
      border: 'border-slate-300',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
      tierLabel: 'Nâng cao',
      accentColor: '#3b82f6'
    };
  } else {
    return {
      border: 'border-slate-200',
      badgeBg: 'bg-slate-100 text-slate-600 border-slate-200',
      tierLabel: 'Cơ bản',
      accentColor: '#64748b'
    };
  }
};

export const RoleSection = () => {
  const searchParams = useSearchParams();

  const s = searchParams.get('s') || '';
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') ?? '5';

  const { data, isLoading } = api.RolePermission.find.useQuery({ page: +page, limit: +limit, s });

  const [selectedRole, setSelectedRole] = useState<{
    mode: 'update:role' | 'update:permissionForRole';
    data: FindRole['roles'][number];
  } | null>(null);
  const currentItems = data?.roles || [];
  const utils = api.useUtils();
  const mutationDeleteRole = api.RolePermission.deleteRole.useMutation({
    onSuccess: () => {
      utils.RolePermission.invalidate();
      NotifySuccess('Chúc mừng bạn đã thao tác thành công.');
    },
    onError: e => {
      NotifyError(e.message);
    }
  });

  useEffect(() => {
    if (data?.pagination.hasNext) {
      void utils.RolePermission.find.prefetch({ page: +page + 1, limit: +limit, s });
    }
  }, [page]);

  return (
    <>
      {isLoading ? (
        <ModalUpsertSkeleton />
      ) : currentItems?.length === 0 ? (
        <Empty hasButton={false} title='Không có kết quả phù hợp' content='' />
      ) : (
        <>
          <Box mt={'md'} className='grid gap-4 md:grid-cols-3'>
            {currentItems.map((item: FindRole['roles'][number], index: number) => {
              const permCount = item?.permissions?.length || 0;
              const tier = getRoleTier(permCount);
              return (
                <Card
                  key={item.id + index}
                  withBorder
                  mih={220}
                  className={`shadow-xs relative flex flex-col justify-between rounded-xl bg-white p-5 transition-all duration-200 hover:shadow-md ${tier.border}`}
                >
                  <Box>
                    <Box className='mb-3 flex items-center justify-between'>
                      <Box className='flex items-center gap-3'>
                        <Box
                          className='shadow-2xs flex items-center justify-center rounded-xl bg-slate-100/80 p-2.5'
                          style={{ color: tier.accentColor }}
                        >
                          <IconShield className='h-5 w-5' />
                        </Box>
                        <Box>
                          <div className='flex items-center gap-2'>
                            <Highlight highlight={s} size='sm' fw={700} className='leading-tight text-slate-900'>
                              {item?.viName || 'Đang cập nhật'}
                            </Highlight>
                          </div>
                          <div className='mt-0.5 flex items-center gap-2'>
                            <span className={`rounded border px-1.5 py-0.5 text-[10px] font-semibold ${tier.badgeBg}`}>
                              {tier.tierLabel}
                            </span>
                            <Text size='xs' c='dimmed' className='font-medium'>
                              {permCount} quyền
                            </Text>
                          </div>
                        </Box>
                      </Box>

                      <Group gap={4}>
                        <Tooltip label={'Cập nhật vai trò'}>
                          <ActionIcon
                            variant='subtle'
                            color='gray'
                            className='rounded-lg text-slate-500 hover:bg-slate-100'
                            onClick={() => setSelectedRole({ mode: 'update:role', data: item })}
                          >
                            <IconEdit className='h-4 w-4' />
                          </ActionIcon>
                        </Tooltip>

                        <Tooltip label={'Cấu hình quyền'}>
                          <ActionIcon
                            variant='subtle'
                            color='gray'
                            className='rounded-lg text-slate-500 hover:bg-blue-50 hover:text-blue-600'
                            onClick={() => setSelectedRole({ mode: 'update:permissionForRole', data: item })}
                          >
                            <IconSettings className='h-4 w-4' />
                          </ActionIcon>
                        </Tooltip>

                        <Tooltip label={'Xóa vai trò'}>
                          <ActionIcon
                            variant='subtle'
                            color='red'
                            className='rounded-lg text-red-500 hover:bg-red-50'
                            onClick={() => {
                              item?.id &&
                                onHandleModalAction({
                                  type: 'delete',
                                  customProps: {
                                    onConfirm: async () => {
                                      await mutationDeleteRole.mutateAsync({ id: item.id });
                                    }
                                  }
                                });
                            }}
                          >
                            <IconTrash className='h-4 w-4' />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    </Box>

                    <Divider className='my-3 border-slate-100' />

                    <Box className='scrollbar-thin max-h-36 overflow-y-auto pr-1'>
                      {item?.permissions && item.permissions.length > 0 ? (
                        <div className='flex flex-wrap gap-1.5'>
                          {item.permissions
                            .slice(0, 6)
                            .map((permission: FindRole['roles'][number]['permissions'][number], pIndex: number) => (
                              <span
                                key={permission.id || pIndex}
                                className='inline-flex items-center rounded-md border border-slate-200/60 bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700'
                              >
                                {permission?.viName || 'Đang cập nhật'}
                              </span>
                            ))}

                          {item.permissions.length > 6 && (
                            <span className='inline-flex items-center rounded-md border border-blue-100 bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600'>
                              + {item.permissions.length - 6} quyền khác
                            </span>
                          )}
                        </div>
                      ) : (
                        <Text size='xs' c='dimmed' className='py-2 text-center italic'>
                          Chưa có quyền nào được gán
                        </Text>
                      )}
                    </Box>
                  </Box>
                  {item.default && (
                    <Text size='sm' fw={700} c={'primary'} className='absolute bottom-[4px] right-[4px]'>
                      Mặc định
                    </Text>
                  )}
                </Card>
              );
            })}
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
                <UpdatePermissionForRole id={selectedRole?.data?.id || ''} setOpened={setSelectedRole} />
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
