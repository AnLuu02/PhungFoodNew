'use client';
import { Switch, useComputedColorScheme, useMantineColorScheme } from '@mantine/core';
import { IconMoonStars, IconSun } from '@tabler/icons-react';

export default function ControlModeTheme() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', {
    getInitialValueInEffect: true
  });

  const isDark = computedColorScheme === 'dark';

  return (
    <Switch
      size='md'
      color='dark.4'
      checked={isDark}
      onChange={() => setColorScheme(isDark ? 'light' : 'dark')}
      onLabel={<IconSun size={16} stroke={2.5} color='var(--mantine-color-yellow-4)' />}
      offLabel={<IconMoonStars size={16} stroke={2.5} color='var(--mantine-color-blue-6)' />}
      aria-label='Toggle theme'
      styles={{
        track: {
          transition: 'background-color 200ms ease'
        }
      }}
    />
  );
}
