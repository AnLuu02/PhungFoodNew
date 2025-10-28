'use client';

import { Carousel } from '@mantine/carousel';
import {
  ActionIcon,
  Badge,
  Box,
  Card,
  Flex,
  Grid,
  GridCol,
  Group,
  Modal,
  NumberInput,
  Rating,
  ScrollAreaAutosize,
  Select,
  Spoiler,
  Stack,
  Text
} from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { formatPriceLocaleVi } from '~/lib/FuncHandler/Format';
import { getImageProduct } from '~/lib/FuncHandler/getImageProduct';
import { NotifySuccess } from '~/lib/FuncHandler/toast';
import { LocalImageType } from '~/lib/ZodSchema/enum';
import { ModalProps } from '~/types/modal';
import { ButtonAddToCart } from '../Button/ButtonAddToCart';
import { ShareSocials } from '../ShareSocial';
import { ImageZoomModal } from './ModalZoomImage';

function ModalProductDetails({ type, opened, onClose, data }: ModalProps<any>) {
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState('');
  const [showfullImage, setShowfullImage] = useState(false);
  const inStock = data?.availableQuantity - data?.soldQuantity > 0;
  useEffect(() => {
    setQuantity(1);
  }, [data]);

  return (
    <>
      <Modal
        scrollAreaComponent={ScrollAreaAutosize}
        className='animate-fadeBottom overflow-hidden'
        opened={opened && type === 'details'}
        radius={'md'}
        onClose={onClose}
        size='70%'
        h={'max-content'}
        transitionProps={{ transition: 'fade-down', duration: 200 }}
        padding='md'
        withCloseButton={false}
        pos={'relative'}
      >
        <ActionIcon bg={'transparent'} c='black' pos={'absolute'} top={5} right={10} onClick={onClose}>
          <IconX size={20} />
        </ActionIcon>
        {type === 'details' && (
          <Grid>
            <GridCol span={{ base: 12, lg: 5 }}>
              <Box w={'100%'} h={350} pos={'relative'}>
                <Image
                  loading='lazy'
                  src={
                    getImageProduct(data?.images || [], LocalImageType.THUMBNAIL) ||
                    '/images/png/delicious-burger-fries.png'
                  }
                  alt={data?.name}
                  className='cursor-pointer rounded-md object-cover'
                  fill
                  onClick={() => {
                    setCurrentImage(getImageProduct(data?.images || [], LocalImageType.THUMBNAIL) || '');
                    setShowfullImage(true);
                  }}
                />
              </Box>
              <Carousel
                w={'100%'}
                slideSize={{ base: '100%', sm: '50%', md: '25%' }}
                slideGap={23}
                h={74}
                mt={10}
                align='start'
                containScroll='trimSnaps'
                withControls={false}
                slidesToScroll={1}
              >
                {data?.images?.map((item: any, index: number) => {
                  if (item?.type === LocalImageType.GALLERY) {
                    return (
                      <Carousel.Slide key={index}>
                        <Card withBorder radius={'sm'}>
                          <Card.Section
                            className='cursor-pointer'
                            onClick={() => {
                              setCurrentImage(item?.type === LocalImageType.GALLERY && item?.url);
                              setShowfullImage(true);
                            }}
                          >
                            <Box w={'100%'} h={74} className='overflow-hidden rounded-sm' pos={'relative'}>
                              <Image
                                loading='lazy'
                                className='border-2 border-mainColor object-cover'
                                fill
                                style={{ objectFit: 'cover' }}
                                alt='Product Image'
                                src={item?.url}
                              />
                            </Box>
                          </Card.Section>
                        </Card>
                      </Carousel.Slide>
                    );
                  }
                })}
              </Carousel>
            </GridCol>
            <GridCol span={{ base: 12, lg: 7 }}>
              <Stack gap='md'>
                <Flex align='center' gap={'xs'}>
                  <Badge className={`${inStock ? 'bg-mainColor' : 'bg-red-500'}`} radius={'sm'}>
                    {inStock ? 'Còn hàng' : 'Hết hàng'}
                  </Badge>
                  <Rating value={data?.rating?.toFixed(1)} readOnly size='sm' color={'#FFC522'} />
                  <Text size='xs' c='dimmed'>
                    {data?.totalRating} đánh giá
                  </Text>
                </Flex>
                <Link href={`/san-pham/${data?.tag}`} onClick={onClose}>
                  <Text
                    fw={700}
                    className='cursor-pointer text-3xl text-black transition-all duration-200 ease-in-out hover:text-mainColor'
                  >
                    {data?.name || 'Súp bông tuyết'}
                  </Text>
                </Link>

                <Group gap={5}>
                  <Text c='black' fw={700} size='sm'>
                    Mã sản phẩm:
                  </Text>
                  <Text className='text-mainColor' fw={700} size='sm'>
                    {data?.id || 'asd15as5d465as65d465a16198'}
                  </Text>
                </Group>

                <Group>
                  <Group align='end'>
                    {data?.discount && (
                      <Text size='md' c={'dimmed'} td='line-through'>
                        {formatPriceLocaleVi(data?.price || 0)}
                      </Text>
                    )}
                    <Text fw={700} className='text-3xl text-subColor'>
                      {formatPriceLocaleVi(data?.price - data?.discount || 0)}
                    </Text>
                  </Group>
                  {data?.discount > 0 && <Badge color='red'>{`-${formatPriceLocaleVi(data?.discount)}`}</Badge>}
                </Group>

                <Card
                  radius={'md'}
                  withBorder
                  className='border-0 border-l-2 border-mainColor bg-gray-100'
                  p={'xs'}
                  my={'xs'}
                >
                  <Spoiler maxHeight={60} showLabel='Xem thêm' hideLabel='Ẩn'>
                    <Text size='sm'>{data?.description || `Không có nội dung.`}</Text>
                  </Spoiler>
                </Card>

                <Flex align='flex-end' gap={'md'}>
                  <Group gap='xs'>
                    <NumberInput
                      label={
                        <Text size='sm' fw={700}>
                          Số lượng:
                        </Text>
                      }
                      clampBehavior='strict'
                      radius={'md'}
                      value={quantity}
                      onChange={(value: any) => setQuantity(value)}
                      thousandSeparator=','
                      min={0}
                      max={99}
                      style={{ width: '80px' }}
                    />
                  </Group>
                  <Group gap='xs'>
                    <Select
                      radius='md'
                      disabled
                      label={
                        <Text size='sm' fw={700}>
                          Kích cỡ:
                        </Text>
                      }
                      searchable
                      placeholder='Chọn'
                      data={['1 người ăn', '2 người ăn', '3 người ăn', '5 người ']}
                    />
                  </Group>
                  <ButtonAddToCart
                    product={{ ...data, quantity }}
                    style={{
                      children: 'Mua hàng',
                      size: 'md',
                      fullWidth: true,
                      radius: 'md'
                    }}
                    handleAfterAdd={onClose}
                    notify={() => NotifySuccess('Đã thêm vào giỏ hàng', 'Sản phẩm đã được Thêm.')}
                  />
                </Flex>
                <Stack gap={5}>
                  <Text c={'dimmed'} size='sm'>
                    Thương hiệu: Phụng Food Việt Nam
                  </Text>
                  <Text c={'dimmed'} size='sm'>
                    Loại sản phẩm: {data?.subCategory?.name || 'Món tráng miệng'}
                  </Text>
                  <Text c={'dimmed'} size='sm'>
                    Khuyến mãi: <b className='text-red-500'>giảm {formatPriceLocaleVi(data?.discount)}</b>
                  </Text>
                  <Text c={'dimmed'} size='sm'>
                    Đã bán: <b className='text-red-500'>{data?.soldQuantity || 0}</b> sản phẩm
                  </Text>
                </Stack>
                <ShareSocials data={data} type='detail' />
              </Stack>
            </GridCol>
          </Grid>
        )}
      </Modal>

      <ImageZoomModal
        activeImage={{
          src: currentImage,
          alt: 'Ảnh chính'
        }}
        gallery={data?.images?.map((item: any) => ({ src: item.url, alt: 'Ảnh mô tả' })) || []}
        isOpen={showfullImage}
        onClose={() => setShowfullImage(false)}
      />
    </>
  );
}

export default ModalProductDetails;
