'use client';
import { Switch, useComputedColorScheme, useMantineColorScheme } from '@mantine/core';
import { IconMoonStars, IconSun } from '@tabler/icons-react';

export default function ControlModeTheme() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
  return (
    <Switch
      size='md'
      color='dark.4'
      onChange={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
      onLabel={<IconSun size={16} stroke={2.5} color='var(--mantine-color-yellow-4)' />}
      offLabel={<IconMoonStars size={16} stroke={2.5} color='var(--mantine-color-blue-6)' />}
    />
  );
}
