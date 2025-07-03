import { Grid, Modal, Title } from '@mantine/core';
import RatingStatistics from '~/app/(web)/san-pham/[slug]/components/RatingStatistics';
import Comments from '../Comments/Comments';
import ProductCardCarouselVertical from '../Web/Home/components/ProductCardCarouselVertical';

function ModalProductComments({ type, opened, close, product }: any) {
  let ratingCountsDefault = [0, 0, 0, 0, 0];

  const ratingCounts =
    product?.review?.reduce((acc: any, item: any) => {
      acc[item.rating - 1] += 1;
      return acc;
    }, ratingCountsDefault) || ratingCountsDefault;

  return (
    <Modal
      transitionProps={{ transition: 'fade-down', duration: 200 }}
      opened={opened && type === 'comments'}
      onClose={close}
      pos={'relative'}
      title={
        <Title order={2} className='font-quicksand'>
          Đánh giá sản phẩm
        </Title>
      }
      size='80%'
      className='overflow-y-hidden'
    >
      {type === 'comments' && (
        <Grid>
          <Grid.Col span={3}>
            <ProductCardCarouselVertical product={product} />
          </Grid.Col>
          <Grid.Col span={4}>
            <RatingStatistics ratings={ratingCounts} />
          </Grid.Col>
          <Grid.Col span={5}>
            <Comments product={product} max_height_scroll={350} />
          </Grid.Col>
        </Grid>
      )}
    </Modal>
  );
}

export default ModalProductComments;
