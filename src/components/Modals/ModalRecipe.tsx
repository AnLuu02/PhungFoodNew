'use client';

import {
  AspectRatio,
  Badge,
  Box,
  Button,
  Card,
  Image,
  Modal,
  ScrollAreaAutosize,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  Text,
  Title
} from '@mantine/core';
import {
  IconBowFilled,
  IconChefHat,
  IconCircleCheck,
  IconClock,
  IconHeart,
  IconPlayerPlay,
  IconShare2,
  IconShoppingCart,
  IconStar,
  IconTimeDuration0,
  IconUsers,
  IconX
} from '@tabler/icons-react';
import { useState } from 'react';
import { ModalProps } from '~/types/modal';
import { Recipe } from '../../types/recipe';

export default function ModalRecipe({ type, opened, onClose, data }: ModalProps<Recipe>) {
  const [checkedSteps, setCheckedSteps] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const toggleStep = (stepNumber: number) => {
    setCheckedSteps(prev => (prev.includes(stepNumber) ? prev.filter(s => s !== stepNumber) : [...prev, stepNumber]));
  };

  const difficultyColors = {
    Dễ: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'Trung bình': 'bg-amber-100 text-amber-800 border-amber-200',
    Khó: 'bg-rose-100 text-rose-800 border-rose-200'
  };

  return (
    <Modal
      radius={'md'}
      opened={opened && type === 'recipe'}
      onClose={onClose}
      size={'90%'}
      withCloseButton={false}
      padding={0}
      centered
      scrollAreaComponent={ScrollAreaAutosize}
      className='animate-fadeUp overflow-y-hidden'
      transitionProps={{ transition: 'fade-down', duration: 200 }}
      pos={'relative'}
    >
      {type === 'recipe' && (
        <Box className='flex h-full flex-col'>
          <Box className='relative h-[70vh] overflow-hidden'>
            <Image src={data.image || '/placeholder.svg'} alt={data.title} className='h-full w-full object-cover' />
            <Box className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20' />

            <Button
              size='icon'
              className='absolute right-4 top-4 bg-black/20 text-white hover:bg-black/40'
              onClick={onClose}
            >
              <IconX className='h-5 w-5' />
            </Button>
            <Box className='absolute bottom-0 left-0 right-0 p-8 text-white'>
              <Box className='mb-4 flex items-center gap-3'>
                <Badge className='border-0 bg-emerald-600 text-white hover:bg-emerald-700'>{data.category}</Badge>
                <Badge
                  variant='outline'
                  className={`${difficultyColors[data.difficulty as keyof typeof difficultyColors]} border`}
                >
                  {data.difficulty}
                </Badge>
              </Box>

              <Title className='mb-4 text-balance font-quicksand text-3xl font-bold drop-shadow-lg md:text-4xl'>
                {data.title}
              </Title>

              <Text className='mb-6 max-w-3xl text-pretty text-lg text-white/90 drop-shadow'>{data.description}</Text>

              <Box className='flex flex-wrap items-center gap-6 text-sm'>
                <Box className='flex items-center gap-2'>
                  <IconClock className='h-5 w-5' />
                  <span>{data.totalTime}</span>
                </Box>
                <Box className='flex items-center gap-2'>
                  <IconUsers className='h-5 w-5' />
                  <span>{data.servings}</span>
                </Box>
                <Box className='flex items-center gap-2'>
                  <IconStar className='h-5 w-5 fill-current text-yellow-400' />
                  <span>{data.rating}/5</span>
                </Box>
                <Box className='flex items-center gap-2'>
                  <IconPlayerPlay className='h-5 w-5' />
                  <span>{data.views} lượt xem</span>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box className='flex-1 overflow-y-auto'>
            <Box className='p-8'>
              <Box className='mb-8 flex flex-wrap gap-3'>
                <Button
                  variant='outline'
                  styles={{
                    root: {
                      border: '1px solid '
                    }
                  }}
                  classNames={{
                    root: `!rounded-md !border-[#e5e5e5] !font-bold text-gray-600 hover:bg-mainColor/10 hover:text-gray-600 data-[active=true]:!border-mainColor data-[active=true]:!bg-mainColor data-[active=true]:!text-white dark:!border-dark-dimmed dark:text-dark-text`
                  }}
                >
                  <IconHeart className='mr-2 h-4 w-4' />
                  Yêu thích
                </Button>
                <Button
                  variant='outline'
                  styles={{
                    root: {
                      border: '1px solid '
                    }
                  }}
                  classNames={{
                    root: `!rounded-md !border-[#e5e5e5] !font-bold text-gray-600 hover:bg-mainColor/10 hover:text-gray-600 data-[active=true]:!border-mainColor data-[active=true]:!bg-mainColor data-[active=true]:!text-white dark:!border-dark-dimmed dark:text-dark-text`
                  }}
                >
                  <IconShare2 className='mr-2 h-4 w-4' />
                  Chia sẻ
                </Button>
                <Button
                  variant='outline'
                  styles={{
                    root: {
                      border: '1px solid '
                    }
                  }}
                  classNames={{
                    root: `!rounded-md !border-[#e5e5e5] !font-bold text-gray-600 hover:bg-mainColor/10 hover:text-gray-600 data-[active=true]:!border-mainColor data-[active=true]:!bg-mainColor data-[active=true]:!text-white dark:!border-dark-dimmed dark:text-dark-text`
                  }}
                >
                  <IconShoppingCart className='mr-2 h-4 w-4' />
                  Thêm vào giỏ
                </Button>
              </Box>

              <Tabs
                value={activeTab}
                onChange={(value: string | null) => setActiveTab(value || 'overview')}
                className='w-full'
                variant='pills'
                styles={{
                  tab: {
                    border: '1px solid ',
                    marginRight: 6
                  }
                }}
                classNames={{
                  tab: `!rounded-md !border-[#e5e5e5] !font-bold hover:bg-mainColor/10 data-[active=true]:!border-mainColor data-[active=true]:!bg-mainColor data-[active=true]:!text-white dark:!border-dark-dimmed dark:text-dark-text`
                }}
              >
                <TabsList className='mb-8 grid w-full grid-cols-5'>
                  <TabsTab value='overview'>Tổng quan</TabsTab>
                  <TabsTab value='ingredients'>Nguyên liệu</TabsTab>
                  <TabsTab value='instructions'>Hướng dẫn</TabsTab>
                  <TabsTab value='videos'>Xem video</TabsTab>
                  <TabsTab value='tips'>Mẹo hay</TabsTab>
                </TabsList>

                <TabsPanel value='overview' className='space-y-6'>
                  <Box className='grid gap-6 md:grid-cols-3'>
                    <Card radius={'lg'} withBorder className='border-emerald-200 bg-emerald-50'>
                      <Box className='p-6 text-center'>
                        <IconTimeDuration0 className='mx-auto mb-3 h-8 w-8 text-emerald-600' />
                        <Title className='mb-2 font-quicksand font-semibold'>Thời gian chuẩn bị</Title>
                        <Text className='text-2xl font-bold text-emerald-600'>{data.prepTime}</Text>
                      </Box>
                    </Card>
                    <Card radius={'lg'} withBorder className='border-amber-200 bg-amber-50'>
                      <Box className='p-6 text-center'>
                        <IconChefHat className='mx-auto mb-3 h-8 w-8 text-amber-600' />
                        <Title className='mb-2 font-quicksand font-semibold'>Thời gian nấu</Title>
                        <Text className='text-2xl font-bold text-amber-600'>{data.cookTime}</Text>
                      </Box>
                    </Card>
                    <Card radius={'lg'} withBorder className='border-rose-200 bg-rose-50'>
                      <Box className='p-6 text-center'>
                        <IconBowFilled className='mx-auto mb-3 h-8 w-8 text-rose-600' />
                        <Title className='mb-2 font-quicksand font-semibold'>Tổng thời gian</Title>
                        <Text className='text-2xl font-bold text-rose-600'>{data.totalTime}</Text>
                      </Box>
                    </Card>
                  </Box>

                  <Card radius={'lg'} withBorder shadow='sm' className='border-emerald-200'>
                    <Box className='p-6'>
                      <Title className='mb-4 font-quicksand text-xl font-semibold'>Thông tin dinh dưỡng</Title>
                      <Box className='grid grid-cols-2 gap-4 md:grid-cols-5'>
                        <Box className='text-center'>
                          <Text className='text-2xl font-bold text-emerald-600'>{data.nutrition.calories}</Text>
                          <Text className='text-sm text-gray-600'>Calories</Text>
                        </Box>
                        <Box className='text-center'>
                          <Text className='text-2xl font-bold text-blue-600'>{data.nutrition.protein}</Text>
                          <Text className='text-sm text-gray-600'>Protein</Text>
                        </Box>
                        <Box className='text-center'>
                          <Text className='text-2xl font-bold text-amber-600'>{data.nutrition.carbs}</Text>
                          <Text className='text-sm text-gray-600'>Carbs</Text>
                        </Box>
                        <Box className='text-center'>
                          <Text className='text-2xl font-bold text-rose-600'>{data.nutrition.fat}</Text>
                          <Text className='text-sm text-gray-600'>Fat</Text>
                        </Box>
                        <Box className='text-center'>
                          <Text className='text-2xl font-bold text-green-600'>{data.nutrition.fiber}</Text>
                          <Text className='text-sm text-gray-600'>Fiber</Text>
                        </Box>
                      </Box>
                    </Box>
                  </Card>
                </TabsPanel>

                <TabsPanel value='ingredients' className='space-y-6'>
                  <Box className='grid gap-6 md:grid-cols-3'>
                    {Object.entries(data.ingredients).map(([category, items]) => (
                      <Card
                        key={category}
                        padding={0}
                        className='border-emerald-200 bg-emerald-50'
                        withBorder
                        radius={'lg'}
                      >
                        <Box className='p-6'>
                          <Title className='mb-4 font-quicksand text-lg font-semibold text-emerald-700'>
                            {category}
                          </Title>
                          <ul className='space-y-3'>
                            {items?.map((item: string, index: number) => (
                              <li
                                key={index}
                                className='flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-emerald-50'
                              >
                                <Box className='h-2 w-2 flex-shrink-0 rounded-full bg-emerald-600' />
                                <span className='text-gray-700'>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </Box>
                      </Card>
                    ))}
                  </Box>
                </TabsPanel>

                <TabsPanel value='instructions' className='space-y-6'>
                  <Box className='space-y-6'>
                    {data.instructions.map(instruction => (
                      <Card
                        key={instruction.step}
                        className='border-l-4 border-l-emerald-500 bg-emerald-50'
                        withBorder
                        radius={'lg'}
                      >
                        <Box className='p-6'>
                          <Box className='flex items-start gap-4'>
                            <Button
                              variant='outline'
                              size='icon'
                              className={`flex-shrink-0 ${
                                checkedSteps.includes(instruction.step)
                                  ? 'border-emerald-600 bg-emerald-600 text-white'
                                  : 'border-emerald-200'
                              }`}
                              onClick={() => toggleStep(instruction.step)}
                            >
                              {checkedSteps.includes(instruction.step) ? (
                                <IconCircleCheck className='h-4 w-4' />
                              ) : (
                                <span className='text-sm font-semibold'>{instruction.step}</span>
                              )}
                            </Button>

                            <Box className='flex-1'>
                              <Box className='mb-3 flex items-center gap-3'>
                                <Title className='font-quicksand text-lg font-semibold'>{instruction.title}</Title>
                                <Badge variant='outline' className='text-xs'>
                                  <IconClock className='mr-1 h-3 w-3' />
                                  {instruction.time}
                                </Badge>
                              </Box>

                              <Box className='grid gap-4 md:grid-cols-2'>
                                <Box>
                                  <Text className='mb-4 leading-relaxed text-gray-700'>{instruction.description}</Text>
                                </Box>
                                <Box>
                                  <Image
                                    src={instruction.image || '/placeholder.svg'}
                                    alt={instruction.title}
                                    className='h-40 w-full rounded-lg object-cover'
                                  />
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      </Card>
                    ))}
                  </Box>
                </TabsPanel>
                <TabsPanel value='videos'>
                  <Card shadow='sm' radius='md' withBorder>
                    <AspectRatio ratio={16 / 9}>
                      <iframe
                        src={`https://www.youtube.com/watch?v=sE-NgFQdHrg&list=RDsE-NgFQdHrg&start_radio=1`}
                        title='YouTube video player'
                        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                        allowFullScreen
                      />
                    </AspectRatio>
                  </Card>
                </TabsPanel>

                <TabsPanel value='tips' className='space-y-6'>
                  <Card className='border-amber-200 bg-amber-50' withBorder radius={'lg'}>
                    <Box className='p-6'>
                      <Title className='mb-6 font-quicksand text-xl font-semibold'>Mẹo nấu ăn hay</Title>
                      <Box className='space-y-4'>
                        {data.tips.map((tip, index) => (
                          <Box
                            key={index}
                            className='flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4'
                          >
                            <Box className='flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-500 text-sm font-semibold text-white'>
                              {index + 1}
                            </Box>
                            <Text className='leading-relaxed text-gray-700'>{tip}</Text>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Card>
                </TabsPanel>
              </Tabs>
            </Box>
          </Box>
        </Box>
      )}
    </Modal>
  );
}
