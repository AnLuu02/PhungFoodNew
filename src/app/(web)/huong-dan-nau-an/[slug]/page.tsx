import {
  Badge,
  Box,
  Button,
  Card,
  CardSection,
  Center,
  Divider,
  Grid,
  GridCol,
  Group,
  Image,
  List,
  ListItem,
  Paper,
  Progress,
  Rating,
  RingProgress,
  ScrollAreaAutosize,
  Stack,
  Text,
  ThemeIcon,
  Timeline,
  TimelineItem,
  Title
} from '@mantine/core';
import {
  IconBookmark,
  IconBowlSpoon,
  IconChefHat,
  IconCircleCheck,
  IconClock,
  IconDeviceTv,
  IconEye,
  IconFlame,
  IconHeart,
  IconHome2,
  IconPlayerPlay,
  IconSalt,
  IconSparkles,
  IconUsers,
  IconWheat
} from '@tabler/icons-react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import cooking_guilds from '~/lib/HardData/cooking_guilds.json';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const recipe = cooking_guilds.find(({ tag }) => params.slug === tag);

  if (!recipe) {
    return {
      title: 'Không tìm thấy trang - Phụng Food',
      description: 'Trang bạn tìm kiếm hiện không tồn tại trên hệ thống.'
    };
  }

  const imageUrl = recipe.image;

  return {
    title: `${recipe.title} - Phụng Food`,
    description: recipe.description || 'Đặc sản miền Tây chính gốc từ Phụng Food.',
    openGraph: {
      title: recipe.title,
      description: recipe.description || '',
      images: imageUrl
    }
  };
}

export default function CookingGuildPage({ params }: { params: { slug: string } }) {
  const recipe = cooking_guilds.find(({ tag }) => params.slug === tag);
  const nutrition = recipe
    ? ([
        { label: 'Calories', value: recipe.nutrition.calories, unit: 'kcal', color: 'orange', percent: 72 },
        { label: 'Protein', value: recipe.nutrition.protein, unit: 'g', color: 'grape', percent: 40 },
        { label: 'Carbs', value: recipe.nutrition.carbs, unit: 'g', color: 'yellow', percent: 64 },
        { label: 'Fat', value: recipe.nutrition.fat, unit: 'g', color: 'red', percent: 32 },
        { label: 'Fiber', value: recipe.nutrition.fiber, unit: 'g', color: 'teal', percent: 26 }
      ] as const)
    : [];

  if (!recipe) return notFound();
  return (
    <>
      <Box mb={20}>
        <Group justify='space-between' align='center'>
          <Group gap='sm'>
            <ThemeIcon size={42} radius='xl' color='orange' variant='filled'>
              <IconChefHat size={22} />
            </ThemeIcon>
            <Box>
              <Text fw={800} size='sm' className={'text-zinc-900 dark:text-zinc-100'}>
                Recipe Guide
              </Text>
              <Text size='xs' c='dimmed'>
                Hướng dẫn nấu ăn chi tiết
              </Text>
            </Box>
          </Group>
          <Group gap='sm'>
            <Button variant='outline' leftSection={<IconHeart size={18} />}>
              Yêu thích
            </Button>
            <Button leftSection={<IconBookmark size={18} />}>Lưu món</Button>
          </Group>
        </Group>
      </Box>
      <Center my={'sm'} w={'100%'}>
        <Divider
          variant='dashed'
          size={'sm'}
          w={'80%'}
          classNames={{
            root: 'border-mainColor'
          }}
          labelPosition='center'
          label={
            <>
              <IconHome2 size={12} className='italic' />
              <Box ml={5} className='italic'>
                PhungFoodRes
              </Box>
            </>
          }
        />
      </Center>
      <Grid gutter='xl' align='start'>
        <GridCol span={{ base: 12, lg: 8 }}>
          <Stack gap='xl'>
            <Paper
              p='xl'
              className={
                'overflow-hidden border bg-gray-100 shadow-sm *:border-black/5 dark:border-white/10 dark:bg-white/[0.04]'
              }
            >
              <Grid gutter='xl' align='center'>
                <GridCol span={{ base: 12, md: 6 }}>
                  <Stack gap='lg'>
                    <Group gap='sm' wrap='wrap'>
                      <Badge radius='xl' color='orange' variant='light' leftSection={<IconBowlSpoon size={12} />}>
                        {recipe.category}
                      </Badge>
                      <Badge radius='xl' variant='outline'>
                        {recipe.difficulty}
                      </Badge>
                      <Badge radius='xl' variant='light' color='gray'>
                        {recipe.duration}
                      </Badge>
                    </Group>

                    <Box>
                      <Title order={1} className='max-w-xl text-4xl font-black tracking-tight md:text-5xl'>
                        {recipe.title}
                      </Title>
                      <Text mt='md' size='lg' c='dimmed' className='max-w-xl leading-7'>
                        {recipe.description}
                      </Text>
                    </Box>

                    <Group gap='md'>
                      <Group gap={6}>
                        <Rating value={recipe.rating} fractions={2} readOnly color='orange' />
                        <Text fw={800}>{recipe.rating}</Text>
                      </Group>
                      <Group gap={6}>
                        <IconEye size={16} />
                        <Text size='sm' c='dimmed'>
                          {recipe.views} lượt xem
                        </Text>
                      </Group>
                    </Group>

                    <Group gap='sm' wrap='wrap'>
                      <Button
                        size='md'
                        color='orange'
                        leftSection={<IconPlayerPlay size={18} />}
                        component='a'
                        href={recipe.videoUrl}
                        target='_blank'
                      >
                        Xem video
                      </Button>
                      <Button size='md' variant='outline' leftSection={<IconHeart size={18} />}>
                        Yêu thích
                      </Button>
                    </Group>

                    <Group gap='sm' wrap='wrap'>
                      {recipe.tags.map(tag => (
                        <Badge key={tag} radius='xl' variant='transparent' c={'dimmed'}>
                          #{tag}
                        </Badge>
                      ))}
                    </Group>
                  </Stack>
                </GridCol>

                <GridCol span={{ base: 12, md: 6 }}>
                  <Card p='sm' className={'bg-zinc-50 dark:bg-white/5'}>
                    <CardSection>
                      <Box className='relative'>
                        <Image src={recipe.image} alt={recipe.title} h={420} radius='lg' />
                      </Box>
                    </CardSection>
                  </Card>
                </GridCol>
              </Grid>
            </Paper>

            <Paper
              p='xl'
              className={'border border-black/5 bg-gray-100 shadow-sm dark:border-white/10 dark:bg-white/[0.04]'}
            >
              <Group justify='space-between' mb='lg'>
                <Box>
                  <Title order={2}>Tổng quan nhanh</Title>
                  <Text c='dimmed'>Nhìn ngay các thông tin quan trọng trước khi bắt đầu nấu.</Text>
                </Box>
                <ThemeIcon size={46} radius='xl' color='orange' variant='light'>
                  <IconSparkles size={22} />
                </ThemeIcon>
              </Group>

              <Grid gutter='md'>
                <GridCol span={{ base: 6, sm: 3 }}>
                  <Paper radius='lg' p='md' className={'bg-[#faf7f2] dark:bg-white/[0.04]'}>
                    <IconClock size={18} className='mb-2 text-orange-500' />
                    <Text size='xs' c='dimmed'>
                      Thời gian
                    </Text>
                    <Text fw={800}>{recipe.totalTime}</Text>
                  </Paper>
                </GridCol>
                <GridCol span={{ base: 6, sm: 3 }}>
                  <Paper radius='lg' p='md' className={'bg-[#faf7f2] dark:bg-white/[0.04]'}>
                    <IconUsers size={18} className='mb-2 text-orange-500' />
                    <Text size='xs' c='dimmed'>
                      Khẩu phần
                    </Text>
                    <Text fw={800}>{recipe.servings}</Text>
                  </Paper>
                </GridCol>
                <GridCol span={{ base: 6, sm: 3 }}>
                  <Paper radius='lg' p='md' className={'dark: bg-[#faf7f2] bg-white/[0.04]'}>
                    <IconFlame size={18} className='mb-2 text-orange-500' />
                    <Text size='xs' c='dimmed'>
                      Năng lượng
                    </Text>
                    <Text fw={800}>{recipe.nutrition.calories} kcal</Text>
                  </Paper>
                </GridCol>
                <GridCol span={{ base: 6, sm: 3 }}>
                  <Paper radius='lg' p='md' className={'bg-[#faf7f2] dark:bg-white/[0.04]'}>
                    <IconDeviceTv size={18} className='mb-2 text-orange-500' />
                    <Text size='xs' c='dimmed'>
                      Video
                    </Text>
                    <Text fw={800}>Có sẵn</Text>
                  </Paper>
                </GridCol>
              </Grid>
            </Paper>

            <Paper
              p='xl'
              className={[
                'border shadow-sm',
                'border-black/5 bg-gray-100 dark:border-white/10 dark:bg-white/[0.04]'
              ].join(' ')}
            >
              <Group mb='lg'>
                <ThemeIcon size={46} radius='xl' color='orange' variant='light'>
                  <IconClock size={22} />
                </ThemeIcon>
                <Box>
                  <Title order={2}>Phân bổ thời gian</Title>
                  <Text c='dimmed'>Cân đối giữa chuẩn bị và chế biến để tối ưu quá trình nấu.</Text>
                </Box>
              </Group>

              <Grid gutter='md'>
                <GridCol span={{ base: 12, sm: 4 }}>
                  <Paper radius='lg' p='lg' className={'bg-[#faf7f2] dark:bg-white/[0.04]'}>
                    <Text size='sm' c='dimmed'>
                      Sơ chế
                    </Text>
                    <Text fw={900} size='xl'>
                      {recipe.prepTime}
                    </Text>
                    <Progress value={45} color='orange' radius='xl' mt='md' />
                  </Paper>
                </GridCol>
                <GridCol span={{ base: 12, sm: 4 }}>
                  <Paper radius='lg' p='lg' className={'bg-[#faf7f2] dark:bg-white/[0.04]'}>
                    <Text size='sm' c='dimmed'>
                      Chế biến
                    </Text>
                    <Text fw={900} size='xl'>
                      {recipe.cookTime}
                    </Text>
                    <Progress value={55} color='gray' radius='xl' mt='md' />
                  </Paper>
                </GridCol>
                <GridCol span={{ base: 12, sm: 4 }}>
                  <Paper radius='lg' p='lg' className={'bg-[#faf7f2] dark:bg-white/[0.04]'}>
                    <Text size='sm' c='dimmed'>
                      Hoàn thiện
                    </Text>
                    <Text fw={900} size='xl'>
                      {recipe.totalTime}
                    </Text>
                    <Progress value={100} color='orange' radius='xl' mt='md' />
                  </Paper>
                </GridCol>
              </Grid>
            </Paper>

            <Paper
              p='xl'
              className={[
                'border shadow-sm',
                'border-black/5 bg-gray-100 dark:border-white/10 dark:bg-white/[0.04]'
              ].join(' ')}
            >
              <Group mb='lg'>
                <ThemeIcon size={46} radius='xl' color='orange' variant='light'>
                  <IconBowlSpoon size={22} />
                </ThemeIcon>
                <Box>
                  <Title order={2}>Các bước thực hiện</Title>
                  <Text c='dimmed'>Làm theo từng bước, rõ ràng và dễ theo dõi.</Text>
                </Box>
              </Group>

              <Timeline active={recipe.instructions.length} bulletSize={34} lineWidth={2} color='orange'>
                {recipe.instructions.map(item => (
                  <TimelineItem
                    key={item.step}
                    bullet={
                      <Text fw={900} size='sm' c='white'>
                        {item.step}
                      </Text>
                    }
                    title={
                      <Group justify='space-between' align='flex-start' mb='xs'>
                        <Box>
                          <Text fw={800} size='lg'>
                            {item.title}
                          </Text>
                          <Group gap={6} mt={4}>
                            <IconClock size={14} className='text-orange-500' />
                            <Text size='sm' c='dimmed'>
                              {item.time}
                            </Text>
                          </Group>
                        </Box>
                      </Group>
                    }
                  >
                    <Card radius='lg' mt='md' className={'bg-[#faf7f2] dark:bg-white/[0.03]'}>
                      <Grid gutter='md' align='center'>
                        <GridCol span={{ base: 12, sm: 5 }}>
                          <Image src={item.image} alt={item.title} h={180} radius='md' />
                        </GridCol>
                        <GridCol span={{ base: 12, sm: 7 }}>
                          <Text className='leading-7 text-zinc-600 dark:text-zinc-300'>{item.description}</Text>
                        </GridCol>
                      </Grid>
                    </Card>
                  </TimelineItem>
                ))}
              </Timeline>
            </Paper>
          </Stack>
        </GridCol>

        <GridCol span={{ base: 12, lg: 4 }}>
          <Stack gap='xl' className='lg:sticky lg:top-6'>
            <Paper
              p='xl'
              className={[
                'border shadow-sm',
                'border-black/5 bg-gray-100 dark:border-white/10 dark:bg-white/[0.04]'
              ].join(' ')}
            >
              <Group mb='lg'>
                <ThemeIcon size={46} radius='xl' color='orange' variant='light'>
                  <IconWheat size={22} />
                </ThemeIcon>
                <Title order={3}>Nguyên liệu</Title>
              </Group>

              <ScrollAreaAutosize mah={320} type='hover' offsetScrollbars>
                <Stack gap='md'>
                  {Object.entries(recipe.ingredients).map(([group, items]) => (
                    <Box key={group}>
                      <Text fw={800} mb='sm' className='text-orange-600'>
                        {group}
                      </Text>
                      <List
                        spacing='sm'
                        icon={
                          <ThemeIcon color='orange' variant='light' size={20} radius='xl'>
                            <IconSalt size={12} />
                          </ThemeIcon>
                        }
                      >
                        {items.map(ingredient => (
                          <ListItem key={ingredient}>
                            <Text className={'text-gray-700 dark:text-gray-200'}>{ingredient}</Text>
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  ))}
                </Stack>
              </ScrollAreaAutosize>
            </Paper>

            <Paper
              p='xl'
              className={[
                'border shadow-sm',
                'border-black/5 bg-gray-100 dark:border-white/10 dark:bg-white/[0.04]'
              ].join(' ')}
            >
              <Group mb='lg'>
                <ThemeIcon size={46} radius='xl' color='orange' variant='light'>
                  <IconCircleCheck size={22} />
                </ThemeIcon>
                <Title order={3}>Mẹo để ngon hơn</Title>
              </Group>

              <Stack gap='sm'>
                {recipe.tips.map((tip, index) => (
                  <Paper key={tip} radius='lg' p='md' className={'bg-[#faf7f2] dark:bg-white/[0.03]'}>
                    <Group align='flex-start'>
                      <ThemeIcon size={24} radius='xl' color='orange'>
                        {index + 1}
                      </ThemeIcon>
                      <Text className='flex-1 leading-7 text-zinc-700 dark:text-zinc-300'>{tip}</Text>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            </Paper>

            <Paper
              p='xl'
              className={[
                'border shadow-sm',
                'border-black/5 bg-gray-100 dark:border-white/10 dark:bg-white/[0.04]'
              ].join(' ')}
            >
              <Group justify='space-between' mb='lg'>
                <Box>
                  <Title order={3}>Dinh dưỡng</Title>
                  <Text size='sm' c='dimmed'>
                    Ước tính cho mỗi khẩu phần
                  </Text>
                </Box>
                <RingProgress
                  size={86}
                  thickness={8}
                  sections={[{ value: 72, color: 'orange' }]}
                  label={
                    <Text ta='center' fw={900} size='sm'>
                      {recipe.nutrition.calories}
                    </Text>
                  }
                />
              </Group>

              <Stack gap='md'>
                {nutrition.map(item => (
                  <Box key={item.label}>
                    <Group justify='space-between' mb={6}>
                      <Text size='sm' fw={700}>
                        {item.label}
                      </Text>
                      <Text size='sm' c='dimmed'>
                        {item.value}
                        {item.unit}
                      </Text>
                    </Group>
                    <Progress value={item.percent} color={item.color} radius='xl' />
                  </Box>
                ))}
              </Stack>
            </Paper>

            <Paper
              p='xl'
              className={[
                'border shadow-sm',
                'border-black/5 bg-gray-100 dark:border-white/10 dark:bg-white/[0.04]'
              ].join(' ')}
            >
              <Title order={3} mb='md'>
                Gợi ý sử dụng
              </Title>
              <Text c='dimmed' className='leading-7'>
                Món này hợp nhất khi dùng nóng, ăn kèm đồ chua hoặc canh thanh vị để cân bằng hương vị.
              </Text>
              <Divider my='lg' />
              <Button fullWidth size='md' color='orange' leftSection={<IconHeart size={18} />}>
                Thêm vào danh sách yêu thích
              </Button>
            </Paper>
          </Stack>
        </GridCol>
      </Grid>
    </>
  );
}
