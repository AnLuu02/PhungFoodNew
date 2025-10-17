'use client';

import { Skeleton, Switch, useComputedColorScheme, useMantineColorScheme } from '@mantine/core';
import { IconMoonStars, IconSun } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

export default function ButtonControlModeTheme() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', {
    getInitialValueInEffect: true
  });

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <Skeleton height={24} w={50} radius={'xl'} />;

  const isDark = computedColorScheme === 'dark';

  return (
    <Switch
      size='md'
      color='dark.4'
      checked={isDark}
      onChange={() => setColorScheme(isDark ? 'light' : 'dark')}
      onLabel={<IconSun size={16} stroke={2.5} className='text-yellow-400' />}
      offLabel={<IconMoonStars size={16} stroke={2.5} className='text-blue-600' />}
      aria-label='Toggle theme'
    />
  );
}
