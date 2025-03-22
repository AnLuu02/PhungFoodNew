import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  BackgroundImage,
  Box,
  Button,
  Card,
  Center,
  Flex,
  Grid,
  GridCol,
  Group,
  Image,
  Overlay,
  Paper,
  SimpleGrid,
  Text,
  ThemeIcon,
  Title
} from '@mantine/core';
import { IconChefHat, IconMail, IconMapPin, IconPhone, IconStar } from '@tabler/icons-react';
import Link from 'next/link';
import BButton from '~/app/_components/Button';
import ProductCardCarouselHorizontal from '~/app/_components/Web/Home/_Components/ProductCardCarouselHorizontal';
import ProductCardCarouselVertical from '~/app/_components/Web/Home/_Components/ProductCardCarouselVertical';
import { api } from '~/trpc/server';

export default async function AboutPage() {
  const [productBestSaller, mienTay, mienBac, mienTrung, mienNam] = await Promise.all([
    api.Product.find({ bestSaler: true, take: 4, skip: 0 }),
    api.Product.find({ s: 'mien-tay', take: 4, skip: 0 }),
    api.Product.find({ s: 'mien-bac', take: 4, skip: 0 }),
    api.Product.find({ s: 'mien-trung', take: 4, skip: 0 }),
    api.Product.find({ s: 'mien-nam', take: 4, skip: 0 })
  ]);
  const dataProduct: any = productBestSaller.products || [];
  return (
    <Box pos={'relative'}>
      <BackgroundImage
        src='/images/banner/banner_about.jpg'
        style={{ textAlign: 'center', padding: '4rem 0' }}
        radius={'md'}
        pos={'relative'}
      >
        <Flex direction={'column'} pos={'relative'} align={'center'} justify={'center'} className='z-10' gap={'md'}>
          <Title order={1} size='h1' c={'white'}>
            Chào mừng đến với Hương Vị Sài Gòn Mama Reastaurant
          </Title>
          <Text size='xl' my='xl' c={'white'}>
            Trải nghiệm hương vị đích thực của miền Tây Việt Nam và hơn thế nữa!
          </Text>

          <Link href={'/thuc-don'}>
            <BButton size='lg' w={'max-content'} title={'Xem thực đơn'} radius='md' />
          </Link>
        </Flex>
        <Overlay opacity={0.5} color='#000' zIndex={1} radius='md' />
      </BackgroundImage>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing='xl' mt={50}>
        <div>
          <Title order={2} size='h2' style={{ color: '#2e7d32' }}>
            Câu chuyện của chúng tôi
          </Title>
          <Text mt='md'>
            Mama Reastaurant là một nhà hàng gia đình mang truyền thống ẩm thực phong phú của Việt Nam vào đĩa thức ăn
            của bạn. Chúng tôi chuyên về ẩm thực miền Tây Việt Nam đồng thời cung cấp các món ăn được yêu thích từ cả ba
            miền Việt Nam.
          </Text>
          <Text mt='md'>
            Hành trình của chúng tôi bắt đầu khi gia đình chúng tôi chuyển từ đồng bằng sông Cửu Long đến thành phố sôi
            động này, mang theo những hương vị và kỹ thuật được truyền qua nhiều thế hệ. Chúng tôi đam mê chia sẻ di sản
            của mình thông qua ẩm thực, kết hợp các công thức nấu ăn truyền thống với những cách chế biến hiện đại để
            tạo ra những trải nghiệm ăn uống khó quên.
          </Text>
          <Group mt='md' wrap='nowrap'>
            <ThemeIcon size='lg' color='green'>
              <IconChefHat />
            </ThemeIcon>
            <Text>Công thức nấu ăn đích thực được truyền qua nhiều thế hệ</Text>
          </Group>
          <Group mt='md' wrap='nowrap'>
            <ThemeIcon size='lg' color='yellow'>
              <IconMapPin />
            </ThemeIcon>
            <Text>Hương vị từ miền Tây Việt Nam và hơn thế nữa</Text>
          </Group>
          <Group mt='md' wrap='nowrap'>
            <ThemeIcon size='lg' color='green'>
              <IconStar />
            </ThemeIcon>
            <Text>Gia đình sở hữu và điều hành bằng tình yêu</Text>
          </Group>
        </div>
        <Image
          src='https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-6.png'
          alt='Restaurant interior'
          height={300}
          radius='md'
        />
      </SimpleGrid>

      {dataProduct?.length > 0 && (
        <>
          <Title order={2} size='h2' style={{ color: '#2e7d32', marginTop: '3rem' }}>
            Món ăn đặc trưng của chúng tôi
          </Title>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing='md' mt='xl'>
            {dataProduct.map((item: any) => (
              <ProductCardCarouselHorizontal key={item.id} data={item} />
            ))}
          </SimpleGrid>
        </>
      )}

      <Title order={2} size='h2' style={{ color: '#2e7d32', marginTop: '3rem' }}>
        Thực đơn của chúng tôi
      </Title>
      <Text mt='md' mb='xl'>
        Khám phá thực đơn đa dạng của chúng tôi bao gồm các món ăn từ mọi vùng miền của Việt Nam, đặc biệt tập trung vào
        ẩm thực miền Tây Việt Nam.
      </Text>
      <Accordion defaultValue={'western'}>
        <AccordionItem value='western'>
          <AccordionControl>Đặc sản miền Tây Việt Nam</AccordionControl>
          <AccordionPanel>
            {(mienTay?.products && mienTay?.products?.length > 0) ||
            (mienNam?.products && mienNam?.products?.length > 0) ? (
              <Grid>
                {[...mienTay?.products, ...mienNam.products]?.map((item: any, index: number) => {
                  return (
                    index < 3 && (
                      <GridCol span={{ base: 12, md: 6, lg: 3 }} key={index}>
                        <ProductCardCarouselVertical product={item} key={index} />
                      </GridCol>
                    )
                  );
                })}
              </Grid>
            ) : (
              <Center>
                <Text size='sm' c={'dimmed'}>
                  <i>--- Đang cập nhật ---</i>
                </Text>
              </Center>
            )}
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem value='northern'>
          <AccordionControl>Món ngon miền Bắc</AccordionControl>
          <AccordionPanel>
            {mienBac?.products && mienBac?.products?.length > 0 ? (
              <Grid>
                {mienBac?.products?.map((item: any, index: number) => {
                  return (
                    index < 3 && (
                      <GridCol span={{ base: 12, md: 6, lg: 3 }} key={index}>
                        <ProductCardCarouselVertical product={item} key={index} />
                      </GridCol>
                    )
                  );
                })}
              </Grid>
            ) : (
              <Center>
                <Text size='sm' c={'dimmed'}>
                  <i>--- Đang cập nhật ---</i>
                </Text>
              </Center>
            )}
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem value='central'>
          <AccordionControl>Miền Trung Việt Nam Được Yêu Thích</AccordionControl>
          <AccordionPanel>
            {mienTrung?.products && mienTrung?.products?.length > 0 ? (
              <Grid>
                {mienTrung?.products?.map((item: any, index: number) => {
                  return (
                    index < 3 && (
                      <GridCol span={{ base: 12, md: 6, lg: 3 }} key={index}>
                        <ProductCardCarouselVertical product={item} key={index} />
                      </GridCol>
                    )
                  );
                })}
              </Grid>
            ) : (
              <Center>
                <Text size='sm' c={'dimmed'}>
                  <i>--- Đang cập nhật ---</i>
                </Text>
              </Center>
            )}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing='xl' mt={50}>
        <Image
          src='https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-6.png'
          alt='Chef portrait'
          height={300}
          radius='md'
        />
        <div>
          <Title order={2} size='h2' style={{ color: '#2e7d32' }}>
            Gặp gỡ đầu bếp của chúng tôi
          </Title>
          <Text mt='md'>
            Tâm điểm của SaiGon Flavours là đầu bếp và chủ sở hữu tài năng của chúng tôi, Chef Mai - một người mẹ với
            hơn 30 năm kinh nghiệm ẩm thực. Hành trình của cô bắt đầu tại những khu chợ sầm uất ở đồng bằng sông Cửu
            Long, nơi cô học được nghệ thuật cân bằng hương vị và lựa chọn những nguyên liệu tươi ngon nhất.
          </Text>
          <Text mt='md'>
            Niềm đam mê ẩm thực Việt Nam và sự tâm huyết của Chef Mai trong việc bảo tồn hương vị truyền thống đồng thời
            đổi mới các món ăn mới khiến mỗi bữa ăn tại Sài Gòn Flavors đều là một trải nghiệm đáng nhớ. Cô đích thân
            giám sát mọi khía cạnh của nhà bếp, đảm bảo rằng mỗi món ăn đều đáp ứng các tiêu chuẩn chính xác của cô.
          </Text>
          <Text mt='md' fw={500}>
            "Nấu ăn không chỉ là về nguyên liệu mà còn là một nghệ thuật sáng tạo giúp gắn kết gia đình và cộng đồng.
            Thông qua món ăn, chúng ta chia sẻ văn hóa, ký ức và tình yêu của mình." - Đầu bếp Mai
          </Text>
        </div>
      </SimpleGrid>

      <Title order={2} size='h2' style={{ color: '#2e7d32', marginTop: '3rem' }}>
        Khách hàng của chúng tôi nói gì?
      </Title>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing='md' mt='xl'>
        {[
          { name: 'John D.', review: 'The Western Pho is a game-changer! Absolutely delicious and unique.' },
          {
            name: 'Sarah L.',
            review: "Chef Mai's attention to detail and flavors is evident in every bite. A must-visit!"
          },
          {
            name: 'Mike T.',
            review: 'The Mekong Delta Curry transported me back to Vietnam. Authentic and full of flavor.'
          }
        ].map((review, index) => (
          <Paper key={index} shadow='xs' p='md'>
            <Text>{review.review}</Text>
            <Text mt='sm' fw={500}>
              - {review.name}
            </Text>
          </Paper>
        ))}
      </SimpleGrid>

      <Title order={2} size='h2' style={{ color: '#2e7d32', marginTop: '3rem' }}>
        Ghé thăm chúng tôi
      </Title>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 2 }} spacing='xl' mt='xl'>
        <div>
          <Text fw={500}>Địa chỉ :</Text>
          <Text>123 Sài Gòn, Quận Ẩm Thực, Thành Phố Của Chúng Tôi</Text>
          <Text fw={500} mt='md'>
            Giờ:
          </Text>
          <Text>Thứ Hai - Thứ Năm: 11:00 sáng - 9:00 tối</Text>
          <Text>Thứ Sáu - Thứ Bảy: 11:00 sáng - 10:00 tối</Text>
          <Text>Chủ Nhật: 12:00 trưa - 8:00 tối</Text>
          <Group mt='md'>
            <ThemeIcon size='lg' color='green'>
              <IconPhone />
            </ThemeIcon>
            <Text>(123) 456-7890</Text>
          </Group>
          <Group mt='md'>
            <ThemeIcon size='lg' color='yellow'>
              <IconMail />
            </ThemeIcon>
            <Text>info@saigonflavors.com</Text>
          </Group>
        </div>
        <Image
          src='https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-6.png'
          alt='Map'
          height={300}
          radius='md'
        />
      </SimpleGrid>

      <Title order={2} size='h2' style={{ color: '#2e7d32', marginTop: '3rem' }}>
        Sự kiện đặc biệt & Dịch vụ ăn uống
      </Title>
      <Text mt='md'>
        Tổ chức sự kiện tiếp theo của bạn với Sài Gòn Flavours! Chúng tôi cung cấp dịch vụ ăn uống và có thể phục vụ các
        bữa tiệc riêng tư trong nhà hàng.
      </Text>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing='md' mt='xl'>
        <Card shadow='sm' padding='lg' radius='md' withBorder>
          <Text fw={500} size='lg'>
            Ăn uống riêng
          </Text>
          <Text mt='sm'>
            Hoàn hảo cho sinh nhật, ngày kỷ niệm hoặc sự kiện của công ty. Phòng riêng của chúng tôi có thể chứa tối đa
            30 khách.
          </Text>
        </Card>
        <Card shadow='sm' padding='lg' radius='md' withBorder>
          <Text fw={500} size='lg'>
            Dịch vụ ăn uống
          </Text>
          <Text mt='sm'>
            Mang hương vị Sài Gòn vào sự kiện của bạn. Chúng tôi cung cấp dịch vụ ăn uống đầy đủ cho các sự kiện thuộc
            mọi quy mô.
          </Text>
        </Card>
      </SimpleGrid>

      <Group justify='center' mt={50} mb={50}>
        <Button size='lg' style={{ backgroundColor: '#f9a825', color: '#000' }}>
          Đặt chỗ
        </Button>
        <Button size='lg' variant='outline' style={{ borderColor: '#2e7d32', color: '#2e7d32' }}>
          Xem thực đơn đầy đủ
        </Button>
      </Group>
    </Box>
  );
}
