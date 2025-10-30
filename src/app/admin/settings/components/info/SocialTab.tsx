'use client';

import { Box, Flex, Paper, TabsPanel, Text, Title } from '@mantine/core';
import { IconGlobe, IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import BButton from '~/components/Button/Button';
import { SocialTabItem } from '../Items/SocialTabItems';
import { SocialLinkModal } from '../Modal/ModalCreateSocial';
export const SocialTab = ({ socials, restaurantId }: { socials: any; restaurantId: string }) => {
  const [openedSocial, setOpenedSocial] = useState<{ open: boolean; social?: any }>({ open: false });
  return (
    <>
      <TabsPanel value='social' className='space-y-6'>
        <Paper radius={'md'} shadow='md' p={'lg'} className='bg-gray-100 dark:bg-dark-card'>
          <Flex align={'center'} justify={'space-between'}>
            <Box mb={'md'}>
              <Title order={4} className='flex items-center gap-2 font-quicksand'>
                <IconGlobe className='h-5 w-5' />
                Liên kết truyền thông xã hội
              </Title>
              <Text fw={600} size={'sm'} c={'dimmed'}>
                Kết nối các tài khoản mạng xã hội của bạn để tăng khả năng hiển thị
              </Text>
            </Box>
            <BButton
              variant='outline'
              leftSection={<IconPlus size={16} />}
              onClick={() => setOpenedSocial({ open: true })}
            >
              Thêm
            </BButton>
          </Flex>
          <Box className='space-y-4'>
            {socials && socials?.length > 0 && (
              <Box className='space-y-2'>
                {socials?.map((item: any, index: number) => {
                  return <SocialTabItem key={index} item={item} index={index} setOpenedSocial={setOpenedSocial} />;
                })}
              </Box>
            )}
          </Box>
        </Paper>
        <SocialLinkModal
          onClose={() => setOpenedSocial({ open: false })}
          opened={openedSocial}
          restaurantId={restaurantId}
          index={socials?.length}
        />
      </TabsPanel>
    </>
  );
};
