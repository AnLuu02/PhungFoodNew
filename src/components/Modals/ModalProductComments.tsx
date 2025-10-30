'use client';
import { Alert, Flex, Grid, Group, Modal, Title } from '@mantine/core';
import { IconAlertSquareRounded } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import RatingStatistics from '~/app/(web)/san-pham/[slug]/components/RatingStatistics';
import { ModalProps } from '~/types/modal';
import Comments from '../Comments/Comments';
import ProductCardCarouselVertical from '../Web/Card/CardProductCarouselVertical';

function ModalProductComments({ type, opened, onClose, data }: ModalProps<any>) {
  let ratingCountsDefault = [0, 0, 0, 0, 0];
  const { data: user } = useSession();

  const ratingCounts =
    data?.review?.reduce((acc: any, item: any) => {
      acc[item.rating - 1] += 1;
      return acc;
    }, ratingCountsDefault) || ratingCountsDefault;

  return (
    <Modal
      transitionProps={{ transition: 'fade-down', duration: 200 }}
      opened={opened && type === 'comments'}
      onClose={onClose}
      radius={'md'}
      pos={'relative'}
      title={
        <Group align='center'>
          <Title order={2} className='font-quicksand'>
            Đánh giá sản phẩm
          </Title>
          {!user?.user?.id && (
            <Alert
              color='yellow'
              variant='light'
              p='xs'
              radius={'md'}
              title={
                <Flex align={'center'} gap={5}>
                  <IconAlertSquareRounded /> Vui lý đăng nhập để đánh giá sản phẩm.
                </Flex>
              }
            />
          )}
        </Group>
      }
      size='90%'
      className='overflow-y-hidden'
    >
      {type === 'comments' && (
        <Grid>
          <Grid.Col span={3}>
            <ProductCardCarouselVertical data={data} />
          </Grid.Col>
          <Grid.Col span={4}>
            <RatingStatistics ratings={ratingCounts} />
          </Grid.Col>
          <Grid.Col span={5}>
            <Comments product={data} max_height_scroll={350} />
          </Grid.Col>
        </Grid>
      )}
    </Modal>
  );
}

export default ModalProductComments;
