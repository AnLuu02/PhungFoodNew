'use client';

import { ActionIcon, Menu } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { IconWorld } from '@tabler/icons-react';
import Image from 'next/image';

export const ToggleLanguage = () => {
  const [language, setLanguage] = useLocalStorage<'vn' | 'us'>({ key: 'language', defaultValue: 'vn' });

  return (
    <>
      <Menu position='bottom-end' shadow='md'>
        <Menu.Target>
          <ActionIcon variant='subtle' color='gray.0' radius='xl' className='hidden md:block'>
            <IconWorld size={18} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown className='hidden md:block'>
          <Menu.Item
            onClick={() => setLanguage('vn')}
            leftSection={
              <Image
                loading='lazy'
                src={'/images/png/co vn.png'}
                width={language === 'vn' ? 35 : 20}
                height={language === 'vn' ? 35 : 20}
                alt='vietnam-flag'
                style={{ objectFit: 'cover' }}
                className={`${language === 'vn' ? '' : 'cursor-pointer'}`}
              />
            }
          >
            Tiếng Việt
          </Menu.Item>
          <Menu.Item
            onClick={() => setLanguage('us')}
            leftSection={
              <Image
                loading='lazy'
                src={'/images/png/co anh.png'}
                width={language === 'us' ? 35 : 20}
                height={language === 'us' ? 35 : 20}
                alt='english-flag'
                style={{ objectFit: 'cover' }}
                className={`${language === 'us' ? '' : 'cursor-pointer'}`}
              />
            }
          >
            English
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
};
