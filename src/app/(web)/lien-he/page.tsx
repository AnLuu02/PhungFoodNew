'use client';
import { Button, Flex, Grid, GridCol, Input, Text, Textarea, ThemeIcon } from '@mantine/core';
import { IconBrand4chan, IconLocation, IconPhone } from '@tabler/icons-react';
import { useState } from 'react';

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const sendTestEmail = async () => {
    setLoading(true);
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: 'anluu0099@gmail.com',
        subject: 'Test Email',
        message: 'Hello from Next.js!'
      })
    });

    const data = await res.json();
    setLoading(false);
  };

  return (
    <Grid w={'100%'}>
      <GridCol className='flex justify-between' span={12}>
        <Button
          loading={loading}
          onClick={() => {
            sendTestEmail();
          }}
        >
          Send mail
        </Button>
      </GridCol>

      <GridCol className='flex justify-between' span={12}>
        <Grid>
          <GridCol span={{ base: 12, md: 6 }}>
            <Flex direction='column' w={'100%'}>
              <Text size='md' fw={900} mb={10}>
                NƠI GIẢI ĐÁP TOÀN BỘ MỌI THẮC MẮC CỦA BẠN?
              </Text>
              <Text size='sm'>Bean Farm- Siêu thị trực tuyến mua sắm nông sản, chất lượng, tươi xanh.</Text>
              <Text size='sm' fw={900} c={'green.9'} mb={20}>
                Giá siêu tốt - Giao siêu tốc.
              </Text>
              <Flex mb={10} align={'center'}>
                <ThemeIcon radius='xl' size='sm' bg={'green.9'} mr={12}>
                  <IconBrand4chan style={{ width: '70%', height: '70%' }} />
                </ThemeIcon>
                <Text size='sm'>PhungFood Việt Nam</Text>
              </Flex>
              <Flex mb={10} align={'center'}>
                <ThemeIcon radius='xl' size='sm' bg={'green.9'} mr={12}>
                  <IconPhone style={{ width: '70%', height: '70%' }} />
                </ThemeIcon>
                <Text size='sm'>0911862581</Text>
              </Flex>
              <Flex mb={20} align={'flex-start'}>
                <ThemeIcon radius='xl' size='sm' bg={'green.9'} mr={12}>
                  <IconLocation style={{ width: '70%', height: '70%' }} />
                </ThemeIcon>
                <Text size='sm'>Đầu lộ Tân Thành, Khóm 9, phường 6, thành phố Cà Mau, tỉnh Cà Mau</Text>
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
                    className='border-[#008b4b] bg-[#008b4b] text-white transition-all duration-200 ease-in-out hover:border-[#f8c144] hover:bg-[#f8c144] hover:text-black'
                  >
                    Gửi thông tin
                  </Button>
                </GridCol>
              </Grid>
            </Flex>
          </GridCol>
          <GridCol span={{ base: 12, md: 6 }}>
            <Flex direction='column' w={'100%'} h={'500px'} bg={'gray.1'} align={'center'} justify={'center'}>
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
