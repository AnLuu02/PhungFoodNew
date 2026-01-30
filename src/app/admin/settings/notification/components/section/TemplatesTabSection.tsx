'use client';

import { Badge, Box, Card, Text } from '@mantine/core';
import { NotificationTemplate } from '@prisma/client';
import { IconPlus } from '@tabler/icons-react';
import { Dispatch, SetStateAction, useState } from 'react';
import BButton from '~/components/Button/Button';
import Empty from '~/components/Empty';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { api } from '~/trpc/react';
import { getTypeIcon } from '../../helpers';
import { SendNotificationStateProps } from '../../NotificationManagement';
import { NotificationTemplateModal } from '../modal/cretae_update_notification_template';

export const TemplatesTabSection = ({
  templates,
  setShowSendDialog
}: {
  templates: any[];
  setShowSendDialog: Dispatch<SetStateAction<SendNotificationStateProps>>;
}) => {
  const [loading, setLoading] = useState(false);
  const [showTemplateModal, setshowTemplateModal] = useState<{
    open: boolean;
    typeAction: 'create' | 'update';
    template?: NotificationTemplate;
  }>({
    open: false,
    typeAction: 'create'
  });

  const utils = api.useUtils();

  const mutationDelete = api.NotificationTemplate.delete.useMutation({
    onSuccess: () => {
      utils.NotificationTemplate.invalidate();
      NotifySuccess('Thao tác thành công!');
      setLoading(false);
    },
    onError: e => {
      NotifyError(e.message);
      setLoading(false);
    }
  });

  const handleDeleteNotificationTemplate = async (id: string) => {
    setLoading(true);
    await mutationDelete.mutateAsync(id);
  };

  return (
    <>
      <Card withBorder radius={'lg'}>
        <Box className='flex items-center justify-between' mb={'md'}>
          <Box>
            <Text fw={700} size='xl'>
              Mẫu thông báo
            </Text>
            <Text size='sm'>Các mẫu được xây dựng sẵn cho các thông báo phổ biến</Text>
          </Box>
          <BButton
            leftSection={<IconPlus className='mr-2 h-4 w-4' />}
            onClick={() => setshowTemplateModal({ open: true, typeAction: 'create' })}
          >
            Thêm bản mẫu
          </BButton>
        </Box>
        <Box>
          {templates?.length > 0 ? (
            <Box className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {templates.map((template: any) => (
                <Card
                  withBorder
                  radius={'lg'}
                  key={template.id}
                  className='cursor-pointer transition-shadow hover:shadow-md'
                >
                  <Box className='pb-3'>
                    <Box className='flex items-center justify-between'>
                      <Box className='flex items-center gap-2'>
                        {getTypeIcon(template.type)}
                        <Text className='text-lg' fw={700}>
                          {template.name}
                        </Text>
                      </Box>
                      <Badge variant='outline'>{template.category}</Badge>
                    </Box>
                  </Box>
                  <Box className='space-y-3'>
                    <Box>
                      <Text className='text-sm font-medium'>{template.title}</Text>
                      <Text className='text-sm'>{template.message}</Text>
                    </Box>
                    {template?.variables?.length > 0 && (
                      <Box>
                        <Text className='mb-1 text-xs font-medium'>Biến số:</Text>
                        <Box className='flex flex-wrap gap-1'>
                          {template.variables.map((variable: any, index: number) => (
                            <Badge key={index} className='text-xs'>
                              {`{${variable}}`}
                            </Badge>
                          ))}
                        </Box>
                      </Box>
                    )}
                    <Box className='flex gap-2'>
                      <BButton
                        className='w-2/5'
                        onClick={() =>
                          setShowSendDialog({ open: true, notification: template, typeAction: 'template' })
                        }
                      >
                        Sử dụng mẫu
                      </BButton>
                      <BButton
                        className='w-2/5'
                        onClick={() => setshowTemplateModal({ open: true, typeAction: 'update', template })}
                      >
                        Chỉnh sửa
                      </BButton>
                      <BButton
                        loading={loading}
                        className='w-1/5 bg-red-500'
                        onClick={() => handleDeleteNotificationTemplate(template.id)}
                      >
                        Xóa
                      </BButton>
                    </Box>
                  </Box>
                </Card>
              ))}
            </Box>
          ) : (
            <Empty title={'Không tìm thấy kết quả phù hợp./'} content='' hasButton={false} />
          )}
        </Box>
      </Card>

      <NotificationTemplateModal
        opened={showTemplateModal.open}
        defaultValues={showTemplateModal.template}
        mode={showTemplateModal.typeAction}
        onClose={() => setshowTemplateModal({ open: false, typeAction: 'create' })}
      />
    </>
  );
};
