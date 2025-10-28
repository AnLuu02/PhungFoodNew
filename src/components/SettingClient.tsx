'use client';
import {
  Box,
  Center,
  Divider,
  Drawer,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
  useComputedColorScheme,
  useMantineColorScheme
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconBorderNone,
  IconBorderOuter,
  IconBrightnessUp,
  IconCheck,
  IconLayoutNavbar,
  IconLayoutSidebar,
  IconMoon,
  IconSettings,
  IconTextDirectionLtr,
  IconTextDirectionRtl
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { hexToRgb } from '~/lib/FuncHandler/hexToRgb';
const colors = ['#5D87FF', '#0074BA', '#763EBD', '#0A7EA4', '#7DDFE3', '#FA896B'];
export const SettingClient = () => {
  const [mainColor, setMainColor] = useState<string | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', {
    getInitialValueInEffect: true
  });

  const isDark = computedColorScheme === 'dark';
  useEffect(() => {
    if (mainColor) {
      document.documentElement.style.setProperty('--mainColor', hexToRgb(mainColor));
    }
  }, [mainColor]);
  return (
    <>
      <Drawer
        position='right'
        opened={opened}
        padding={0}
        onClose={close}
        size={'25%'}
        title={
          <Title order={3} className='font-quicksand'>
            Cài đặt
          </Title>
        }
        className='z-[300]'
        classNames={{
          header: 'px-6 py-4'
        }}
      >
        <Divider />
        <Stack className='px-6 py-4' gap={'xl'}>
          <Stack>
            <Text size='md' fw={700}>
              Theme
            </Text>
            <Group align='center' gap={'md'}>
              <Box
                onClick={() => setColorScheme('light')}
                className={`flex cursor-pointer items-center gap-2 rounded-md border border-solid border-gray-200 px-6 py-2 duration-200 hover:scale-105 hover:text-mainColor ${!isDark && 'text-mainColor'}`}
              >
                <IconBrightnessUp className='h-5 w-5' />
                <Text size='md' fw={700}>
                  Sáng
                </Text>
              </Box>
              <Box
                onClick={() => setColorScheme('dark')}
                className={`flex cursor-pointer items-center gap-2 rounded-md border border-solid border-gray-200 px-6 py-2 duration-200 hover:scale-105 hover:text-mainColor ${isDark && 'text-mainColor'}`}
              >
                <IconMoon className='h-5 w-5' />
                <Text size='md' fw={700}>
                  Tối
                </Text>
              </Box>
            </Group>
          </Stack>

          <Stack>
            <Text size='md' fw={700}>
              Theme direction
            </Text>
            <Group align='center' gap={'md'}>
              <Box className='flex cursor-pointer items-center gap-2 rounded-md border border-solid border-gray-200 px-6 py-2 duration-200 hover:scale-105 hover:text-mainColor'>
                <IconTextDirectionLtr className='h-5 w-5' />
                <Text size='md' fw={700}>
                  LTR
                </Text>
              </Box>
              <Box className='flex cursor-pointer items-center gap-2 rounded-md border border-solid border-gray-200 px-6 py-2 duration-200 hover:scale-105 hover:text-mainColor'>
                <IconTextDirectionRtl className='h-5 w-5' />
                <Text size='md' fw={700}>
                  RTL
                </Text>
              </Box>
            </Group>
          </Stack>

          <Stack>
            <Text size='md' fw={700}>
              Theme color
            </Text>

            <SimpleGrid cols={3} spacing={'md'}>
              {colors.map((color, index) => (
                <Box
                  key={index}
                  onClick={() => {
                    setMainColor(color);
                  }}
                  className='group relative flex h-[58px] w-[80px] cursor-pointer items-center justify-center rounded-md border border-solid border-gray-200 duration-200 hover:scale-105 hover:text-mainColor'
                >
                  <Box w={25} h={25} className={`flex items-center justify-center rounded-full bg-[${color?.trim()}]`}>
                    <IconCheck
                      className={`hidden h-5 w-5 font-bold text-white group-hover:block ${mainColor === color && '!block'}`}
                    />
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
          </Stack>

          <Stack>
            <Text size='md' fw={700}>
              Layout Type
            </Text>
            <Group align='center' gap={'md'} wrap='nowrap'>
              <Box className='flex cursor-pointer items-center gap-2 rounded-md border border-solid border-gray-200 px-4 py-3 duration-200 hover:scale-105 hover:text-mainColor'>
                <IconLayoutSidebar className='h-5 w-5' />
                <Text size='md' fw={700}>
                  Vertical
                </Text>
              </Box>
              <Box className='flex cursor-pointer items-center gap-2 rounded-md border border-solid border-gray-200 px-4 py-3 duration-200 hover:scale-105 hover:text-mainColor'>
                <IconLayoutNavbar className='h-5 w-5' />
                <Text size='md' fw={700}>
                  Horizontal
                </Text>
              </Box>
            </Group>
          </Stack>

          <Stack>
            <Text size='md' fw={700}>
              Sidebar Type
            </Text>
            <Group align='center' gap={'md'}>
              <Box className='flex cursor-pointer items-center gap-2 rounded-md border border-solid border-gray-200 px-6 py-2 duration-200 hover:scale-105 hover:text-mainColor'>
                <IconLayoutSidebar className='h-5 w-5' />
                <Text size='md' fw={700}>
                  Full
                </Text>
              </Box>
              <Box className='flex cursor-pointer items-center gap-2 rounded-md border border-solid border-gray-200 px-6 py-2 duration-200 hover:scale-105 hover:text-mainColor'>
                <Text size='md' fw={700}>
                  Collapse
                </Text>
              </Box>
            </Group>
          </Stack>

          <Stack>
            <Text size='md' fw={700}>
              Card With
            </Text>
            <Group align='center' gap={'md'} wrap='nowrap'>
              <Box className='flex cursor-pointer items-center gap-2 rounded-md border border-solid border-gray-200 px-6 py-2 duration-200 hover:scale-105 hover:text-mainColor'>
                <IconBorderOuter className='h-5 w-5' />
                <Text size='md' fw={700}>
                  Border
                </Text>
              </Box>
              <Box className='flex cursor-pointer items-center gap-2 rounded-md border border-solid border-gray-200 px-6 py-2 duration-200 hover:scale-105 hover:text-mainColor'>
                <IconBorderNone className='h-5 w-5' />
                <Text size='md' fw={700}>
                  Shadow
                </Text>
              </Box>
            </Group>
          </Stack>
        </Stack>
      </Drawer>
      <Box pos={'fixed'} bottom={40} right={{ base: -15, sm: 20 }} className='z-[200] flex flex-col space-y-4'>
        <Center
          className='relative hidden h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-mainColor text-white duration-200 ease-in-out hover:opacity-80 sm:flex'
          w={50}
          h={50}
        >
          <IconSettings size={24} onClick={open} />
        </Center>
      </Box>
    </>
  );
};
