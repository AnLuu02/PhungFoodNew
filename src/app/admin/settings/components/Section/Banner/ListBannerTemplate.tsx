'use client';

import { ActionIcon, Badge, Box, Button, Card, Group, Image, SimpleGrid, Stack } from '@mantine/core';
import { IconEye, IconTrash } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { CardSkeleton } from '~/components/Web/Card/CardSkeleton';
import { formatDateViVN } from '~/lib/FuncHandler/Format';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { api } from '~/trpc/react';
import ModalViewBanner from '../ModalViewBanner';
import { bannerdefaultValues } from './BannerRestautant';

export default function ListBannerTemplate({
  onSetDefaultBanner,
  onDeletedBanner
}: {
  onSetDefaultBanner: (banner: any) => void;
  onDeletedBanner: () => void;
}) {
  const [viewBanner, setViewBanner] = useState<{ isOpened: boolean; activeBanner: any }>({
    isOpened: false,
    activeBanner: {}
  });
  const [activeBanner, setActiveBanner] = useState<any>(null);
  const formFields = useFormContext();
  const [loading, setLoading] = useState<{ type: 'set-default' | 'delete'; value: boolean } | null>(null);
  const { data: dataClient = [], isLoading } = api.Restaurant.getAllBanner.useQuery();
  const utils = api.useUtils();
  useEffect(() => {
    if (Array.isArray(dataClient) && dataClient.length > 0) {
      const bannerActive = dataClient.find((banner: any) => banner.isActive) || null;
      setActiveBanner(bannerActive);
    }
  }, [dataClient]);

  useEffect(() => {
    if (activeBanner) {
      onSetDefaultBanner(activeBanner);
    }
  }, [activeBanner]);

  const setDefaultBannerMutation = api.Restaurant.setDefaultBanner.useMutation({
    onSuccess: () => {
      NotifySuccess('Chúc mừng bạn đã thao tác thành công.');
      utils.Restaurant.getAllBanner.invalidate();
    },
    onError: e => {
      NotifyError(e.message);
    }
  });
  const deleteBannerMutation = api.Restaurant.deleteBanner.useMutation({
    onSuccess: () => {
      formFields.reset(bannerdefaultValues);
      utils.Restaurant.invalidate();
    },
    onError: e => {
      NotifyError(e.message);
    }
  });
  async function handleSetDefault(id: string) {
    setLoading({ type: 'set-default', value: true });
    await setDefaultBannerMutation.mutateAsync({ id });
    setLoading({ type: 'set-default', value: false });
  }
  async function handleDeleteBanner(id: string) {
    setLoading({ type: 'delete', value: true });
    await deleteBannerMutation.mutateAsync({ id });
    setLoading({ type: 'delete', value: false });
  }
  if (isLoading)
    return (
      <>
        <SimpleGrid cols={3} className='mb-4 gap-4'>
          {Array.from({ length: 3 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </SimpleGrid>
      </>
    );
  return (
    <>
      <ModalViewBanner viewBanner={viewBanner} setViewBanner={setViewBanner} />
      <Box>
        {dataClient?.length > 0 && (
          <Box className='mb-4 grid grid-cols-3 gap-4'>
            {dataClient.map((banner: any, index: number) => (
              <Card
                key={banner.id}
                pos='relative'
                h={320}
                p={0}
                withBorder
                className='overflow-hidden border border-gray-200 shadow-sm dark:border-dark-dimmed'
              >
                <Box h={220} pos={'relative'}>
                  <Image
                    src={banner.imageForEntities?.[0]?.image?.url}
                    alt='Banner'
                    w={'100%'}
                    h={'100%'}
                    className='rounded-t-md object-fill'
                  />
                </Box>
                <Box pos='absolute' top={12} right={12}>
                  {banner.isActive ? (
                    <Badge size='md' color='red' variant='filled'>
                      Mặc định
                    </Badge>
                  ) : (
                    <Button
                      size='xs'
                      loading={loading?.type === 'set-default' && loading.value}
                      onClick={() => handleSetDefault(banner.id)}
                    >
                      Đặt mặc định
                    </Button>
                  )}
                </Box>

                <Stack gap={'xs'} p={'sm'}>
                  <Badge
                    variant='light'
                    color='gray'
                    size='sm'
                    styles={{
                      root: {
                        border: '1px solid '
                      }
                    }}
                    classNames={{
                      root: `!rounded-md !border-[#e5e5e5] !font-bold text-black hover:bg-mainColor/10 hover:text-black data-[active=true]:!border-mainColor data-[active=true]:!bg-mainColor data-[active=true]:!text-white dark:!border-dark-dimmed dark:text-dark-text`
                    }}
                  >
                    {formatDateViVN(banner.createdAt)}
                  </Badge>

                  <Group justify='space-between' gap='xs'>
                    <Button
                      leftSection={<IconEye size={16} />}
                      onClick={() => setViewBanner({ isOpened: true, activeBanner: banner })}
                      flex={1}
                    >
                      Xem
                    </Button>

                    <ActionIcon
                      variant='light'
                      color='red'
                      loading={loading?.type === 'delete' && loading.value}
                      onClick={() => {
                        handleDeleteBanner(banner.id);
                        onDeletedBanner();
                      }}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Stack>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </>
  );
}
