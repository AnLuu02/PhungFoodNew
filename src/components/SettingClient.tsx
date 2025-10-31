'use client';
import {
  Box,
  Center,
  Divider,
  Drawer,
  Flex,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
  useComputedColorScheme,
  useMantineColorScheme
} from '@mantine/core';
import { useDisclosure, useLocalStorage } from '@mantine/hooks';
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
import { useEffect } from 'react';
import { hexToRgb } from '~/lib/FuncHandler/hexToRgb';
export const COLOR_PALETTES = [
  { name: 'Ocean Blue', mainColor: '#5D87FF', subColor: '#A2B8FF' },
  { name: 'Sky Teal', mainColor: '#0074BA', subColor: '#56B5E5' },
  { name: 'Royal Purple', mainColor: '#763EBD', subColor: '#B18BEF' },
  { name: 'Deep Cyan', mainColor: '#0A7EA4', subColor: '#4FBFD3' },
  { name: 'Mint Breeze', mainColor: '#7DDFE3', subColor: '#A9F0F3' },
  { name: 'Coral Sunset', mainColor: '#FA896B', subColor: '#FFC3AE' }
];
interface ThemeClient {
  direction: 'ltr' | 'rtl' | 'auto';
  theme: 'light' | 'dark' | 'auto';
  color: {
    name: string;
    mainColor: string;
    subColor: string;
  };
  card: {
    withBorder: boolean;
    withShadow: boolean;
  };
}
export const SettingClient = () => {
  const [themeClient, setThemeClient] = useLocalStorage<ThemeClient | null>({
    key: 'theme-client',
    defaultValue: null
  });
  const [opened, { open, close }] = useDisclosure(false);
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', {
    getInitialValueInEffect: true
  });

  const isDark = computedColorScheme === 'dark';
  useEffect(() => {
    if (themeClient?.color) {
      document.documentElement.style.setProperty('--color-mainColor', hexToRgb(themeClient.color?.mainColor));
      document.documentElement.style.setProperty('--color-subColor', hexToRgb(themeClient.color?.subColor));
    }
  }, [themeClient?.color]);
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
              <Paper
                withBorder
                onClick={() => setColorScheme('light')}
                className={`flex cursor-pointer items-center gap-2 rounded-md px-6 py-2 duration-200 hover:scale-105 hover:text-mainColor ${!isDark && 'border-mainColor text-mainColor'}`}
              >
                <IconBrightnessUp className='h-5 w-5' />
                <Text size='md' fw={700}>
                  Sáng
                </Text>
              </Paper>
              <Paper
                withBorder
                onClick={() => setColorScheme('dark')}
                className={`flex cursor-pointer items-center gap-2 rounded-md px-6 py-2 duration-200 hover:scale-105 hover:text-mainColor ${isDark && 'border-mainColor text-mainColor'}`}
              >
                <IconMoon className='h-5 w-5' />
                <Text size='md' fw={700}>
                  Tối
                </Text>
              </Paper>
            </Group>
          </Stack>

          <Stack>
            <Text size='md' fw={700}>
              Theme direction
            </Text>
            <Group align='center' gap={'md'}>
              <Paper
                withBorder
                onClick={() => setThemeClient({ ...(themeClient as ThemeClient), direction: 'ltr' })}
                className={`flex cursor-pointer items-center gap-2 rounded-md px-6 py-2 duration-200 hover:scale-105 hover:text-mainColor ${themeClient?.direction === 'ltr' && 'border-mainColor text-mainColor'}`}
              >
                <IconTextDirectionLtr className='h-5 w-5' />
                <Text size='md' fw={700}>
                  LTR
                </Text>
              </Paper>
              <Paper
                withBorder
                onClick={() => setThemeClient({ ...(themeClient as ThemeClient), direction: 'rtl' })}
                className={`flex cursor-pointer items-center gap-2 rounded-md px-6 py-2 duration-200 hover:scale-105 hover:text-mainColor ${themeClient?.direction === 'rtl' && 'border-mainColor text-mainColor'}`}
              >
                <IconTextDirectionRtl className='h-5 w-5' />
                <Text size='md' fw={700}>
                  RTL
                </Text>
              </Paper>
            </Group>
          </Stack>

          <Stack>
            <Text size='md' fw={700}>
              Theme color
            </Text>

            <SimpleGrid cols={3}>
              {COLOR_PALETTES.map((color, index) => {
                const isSelected = themeClient?.color?.mainColor === color.mainColor;

                return (
                  <Flex
                    justify={'center'}
                    align={'center'}
                    direction={'column'}
                    pos={'relative'}
                    gap={'md'}
                    key={index}
                    onClick={() => setThemeClient({ ...(themeClient as ThemeClient), color })}
                    className={`group h-[max-content] w-full cursor-pointer rounded-md py-4 duration-200 hover:scale-105 ${
                      isSelected ? 'border border-solid border-mainColor' : 'border-gray-200'
                    }`}
                  >
                    <Box className='relative flex items-center justify-center'>
                      <Box
                        className='absolute inset-0 rounded-full'
                        style={{
                          backgroundColor: color.subColor,
                          width: 38,
                          height: 38
                        }}
                      />
                      <Box
                        className='relative flex items-center justify-center rounded-full'
                        style={{
                          backgroundColor: color.mainColor,
                          width: 26,
                          height: 26,
                          boxShadow: isSelected ? `0 0 0 3px ${color.subColor}80` : 'none'
                        }}
                      >
                        <IconCheck
                          size={16}
                          className={`text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${
                            isSelected ? 'opacity-100' : ''
                          }`}
                        />
                      </Box>
                    </Box>

                    <Text size='xs' className='text-center font-medium text-gray-600'>
                      {color.name}
                    </Text>
                  </Flex>
                );
              })}
            </SimpleGrid>
          </Stack>

          <Stack>
            <Text size='md' fw={700}>
              Layout Type
            </Text>
            <Group align='center' gap={'md'} wrap='nowrap'>
              <Paper
                withBorder
                className='flex cursor-pointer items-center gap-2 rounded-md px-4 py-3 duration-200 hover:scale-105 hover:text-mainColor'
              >
                <IconLayoutSidebar className='h-5 w-5' />
                <Text size='md' fw={700}>
                  Vertical
                </Text>
              </Paper>
              <Paper
                withBorder
                className='flex cursor-pointer items-center gap-2 rounded-md px-4 py-3 duration-200 hover:scale-105 hover:text-mainColor'
              >
                <IconLayoutNavbar className='h-5 w-5' />
                <Text size='md' fw={700}>
                  Horizontal
                </Text>
              </Paper>
            </Group>
          </Stack>

          <Stack>
            <Text size='md' fw={700}>
              Sidebar Type
            </Text>
            <Group align='center' gap={'md'}>
              <Paper
                withBorder
                className='flex cursor-pointer items-center gap-2 rounded-md px-6 py-2 duration-200 hover:scale-105 hover:text-mainColor'
              >
                <IconLayoutSidebar className='h-5 w-5' />
                <Text size='md' fw={700}>
                  Full
                </Text>
              </Paper>
              <Paper
                withBorder
                className='flex cursor-pointer items-center gap-2 rounded-md px-6 py-2 duration-200 hover:scale-105 hover:text-mainColor'
              >
                <Text size='md' fw={700}>
                  Collapse
                </Text>
              </Paper>
            </Group>
          </Stack>

          <Stack>
            <Text size='md' fw={700}>
              Card With
            </Text>
            <Group align='center' gap={'md'} wrap='nowrap'>
              <Paper
                withBorder
                onClick={() =>
                  setThemeClient({
                    ...(themeClient as ThemeClient),
                    card: {
                      withBorder: !themeClient?.card?.withBorder,
                      withShadow: Boolean(themeClient?.card?.withShadow)
                    }
                  })
                }
                className={`flex cursor-pointer items-center gap-2 rounded-md px-6 py-2 duration-200 hover:scale-105 hover:text-mainColor ${themeClient?.card?.withBorder && 'border-mainColor text-mainColor'}`}
              >
                <IconBorderOuter className='h-5 w-5' />
                <Text size='md' fw={700}>
                  Border
                </Text>
              </Paper>
              <Paper
                withBorder
                onClick={() =>
                  setThemeClient({
                    ...(themeClient as ThemeClient),
                    card: {
                      withBorder: Boolean(themeClient?.card?.withBorder),
                      withShadow: !themeClient?.card?.withBorder
                    }
                  })
                }
                className={`flex cursor-pointer items-center gap-2 rounded-md px-6 py-2 duration-200 hover:scale-105 hover:text-mainColor ${themeClient?.card?.withShadow && 'border-mainColor text-mainColor'}`}
              >
                <IconBorderNone className='h-5 w-5' />
                <Text size='md' fw={700}>
                  Shadow
                </Text>
              </Paper>
            </Group>
          </Stack>
        </Stack>
      </Drawer>
      <Box
        pos={'fixed'}
        bottom={230}
        right={{ base: -15, sm: 20 }}
        className='animate-bounceSlow z-[200] flex flex-col space-y-4'
      >
        <Center
          className='relative hidden cursor-pointer items-center justify-center text-mainColor duration-200 ease-in-out hover:opacity-80 sm:flex'
          w={50}
          h={50}
        >
          <IconSettings size={32} onClick={open} />
        </Center>
      </Box>
    </>
  );
};
