import { Button, Flex, Grid, GridCol, Input, Text, Textarea, ThemeIcon } from '@mantine/core';
import { IconBrand4chan, IconLocation, IconPhone } from '@tabler/icons-react';
import { Metadata } from 'next';
import { api } from '~/trpc/server';

export const metadata: Metadata = {
  title: 'Liên hệ - Phụng Food',
  description: 'Liên hệ chúng tôi để đặt món, tư vấn thực đơn, hợp tác hoặc phản hồi dịch vụ.'
};
const Contact = async () => {
  const restaurant = await api.Restaurant.getOneActive();
  return (
    <Grid w={'100%'}>
      <GridCol className='flex justify-between' span={12}>
        <Grid>
          <GridCol span={{ base: 12, md: 6 }}>
            <Flex direction='column' w={'100%'}>
              <Text size='md' fw={900} mb={10}>
                NƠI GIẢI ĐÁP TOÀN BỘ MỌI THẮC MẮC CỦA BẠN?
              </Text>
              <Text size='sm'>{restaurant?.name} - Nhà hàng trực tuyến dành cho bạn.</Text>
              <Text size='sm' fw={900} className='text-mainColor' mb={20}>
                Giá siêu tốt - Giao siêu tốc.
              </Text>
              <Flex mb={10} align={'center'}>
                <ThemeIcon radius='xl' size='sm' className='bg-mainColor' mr={12}>
                  <IconBrand4chan className='h-[70%] w-[70%]' />
                </ThemeIcon>
                <Text size='sm'>{restaurant?.name} Việt Nam</Text>
              </Flex>
              <Flex mb={10} align={'center'}>
                <ThemeIcon radius='xl' size='sm' className='bg-mainColor' mr={12}>
                  <IconPhone className='h-[70%] w-[70%]' />
                </ThemeIcon>
                <Text size='sm'>{restaurant?.phone}</Text>
              </Flex>
              <Flex mb={20} align={'flex-start'}>
                <ThemeIcon radius='xl' size='sm' className='bg-mainColor' mr={12}>
                  <IconLocation className='h-[70%] w-[70%]' />
                </ThemeIcon>
                <Text size='sm'>
                  {restaurant?.address || `Đầu lộ Tân Thành, Khóm 9, phường 6, thành phố Cà Mau, tỉnh Cà Mau`}
                </Text>
              </Flex>

              <Text size='md' fw={900} mb={10}>
                LIÊN HỆ VỚI CHÚNG TÔI
              </Text>
              <Text size='sm' mb={10}>
                Nếu bạn có thắc mắc gì, có thể gửi yêu cầu cho chúng tôi, và chúng tôi sẽ liên lạc lại với bạn sớm nhất
                có thể .
              </Text>

              <Grid>
                <GridCol span={12}>
                  <Input styles={{ input: { borderRadius: 8, height: 30 } }} placeholder='Tên *' />
                </GridCol>
                <GridCol span={12}>
                  <Input styles={{ input: { borderRadius: 8, height: 30 } }} placeholder='Số điện thoại *' />
                </GridCol>
                <GridCol span={12}>
                  <Input styles={{ input: { borderRadius: 8, height: 30 } }} placeholder='E-mail *' />
                </GridCol>
                <GridCol span={12}>
                  <Textarea resize='vertical' placeholder='Tin nhắn *' styles={{ input: { borderRadius: 8 } }} />
                </GridCol>
                <GridCol span={12}>
                  <Button
                    size='sm'
                    radius={'xl'}
                    className='border-mainColor bg-mainColor text-white transition-all duration-200 ease-in-out hover:border-subColor hover:bg-subColor hover:text-black'
                  >
                    Gửi thông tin
                  </Button>
                </GridCol>
              </Grid>
            </Flex>
          </GridCol>
          <GridCol span={{ base: 12, md: 6 }}>
            <Flex
              direction='column'
              w={'100%'}
              h={'500px'}
              className='bg-gray-100 dark:bg-dark-card'
              align={'center'}
              justify={'center'}
            >
              <iframe
                src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.0667450974274!2d106.60273367451757!3d10.806200058644913!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752b92b2423a45%3A0x1a966c9c45ff7eee!2sB&#39;s%20Mart!5e0!3m2!1svi!2s!4v1735319059137!5m2!1svi!2s'
                width='100%'
                height='500'
                style={{ border: 0 }}
                allowFullScreen
                loading='lazy'
                referrerPolicy='no-referrer-when-downgrade'
              ></iframe>
            </Flex>
          </GridCol>
        </Grid>
      </GridCol>
    </Grid>
  );
};

export default Contact;
