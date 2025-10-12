'use client';
import { ActionIcon, Button, Group, Text, Tooltip } from '@mantine/core';
import {
  IconBrandFacebook,
  IconBrandLinkedin,
  IconBrandTelegram,
  IconBrandTwitter,
  IconBrandWhatsapp,
  IconMail
} from '@tabler/icons-react';
import { NotifySuccess } from '~/lib/func-handler/toast';

function ShareSocials({ data, type = 'default' }: { data: any; type?: 'default' | 'detail' }) {
  const DOMAIN = process.env.NEXT_PUBLIC_BASE_URL_DEPLOY || 'http://localhost:3000';
  const currentUrl = `${DOMAIN}/san-pham/${data?.tag || ''}`;
  const links = [
    {
      name: 'Facebook',
      label: 'Chia sẻ lên Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
      icon: IconBrandFacebook,
      color: '#3b5998'
    },
    {
      name: 'Email',
      label: 'Chia sẻ qua Email',
      url: `mailto:?subject=${encodeURIComponent('Chia sẻ sản phẩm thú vị')}&body=${encodeURIComponent(currentUrl)}`,
      icon: IconMail,
      color: '#7f7f7f'
    },
    {
      name: 'Twitter',
      label: 'Chia sẻ lên Twitter',
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}`,
      icon: IconBrandTwitter,
      color: '#1da1f2'
    },
    {
      name: 'LinkedIn',
      label: 'Chia sẻ lên LinkedIn',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
      icon: IconBrandLinkedin,
      color: '#0077b5'
    },

    {
      name: 'Telegram',
      label: 'Chia sẻ lên Telegram',
      url: `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}`,
      icon: IconBrandTelegram,
      color: '#0088cc'
    },
    {
      name: 'WhatsApp',
      label: 'Chia sẻ qua WhatsApp',
      url: `https://wa.me/?text=${encodeURIComponent(currentUrl)}`,
      icon: IconBrandWhatsapp,
      color: '#25d366'
    }
  ];
  if (type === 'detail') {
    return (
      <Group gap={5} align='center'>
        <Text c={'dimmed'} size='sm'>
          Chia sẻ:
        </Text>

        {links.map(({ name, url, label, icon: Icon }) => (
          <Tooltip label={label} key={name}>
            <a key={name} href={url} target='_blank' rel='noopener noreferrer' title={name}>
              <Icon size={16} className='cursor-pointer transition-transform hover:scale-150 hover:text-mainColor' />
            </a>
          </Tooltip>
        ))}

        <Button
          size='xs'
          variant='subtle'
          onClick={() => {
            navigator.clipboard.writeText(currentUrl);
            NotifySuccess('Thành công!', 'Sao chép link thành công.');
          }}
          title='Copy link'
          className='transition-transform hover:scale-105 hover:text-mainColor'
          styles={{
            root: {
              border: '1px solid '
            }
          }}
          classNames={{
            root: `!rounded-md !border-[#e5e5e5] !font-bold text-gray-600 hover:bg-mainColor/10 hover:text-gray-600 data-[active=true]:!border-mainColor data-[active=true]:!bg-mainColor data-[active=true]:!text-white dark:!border-dark-dimmed dark:text-white`
          }}
        >
          Sao chép
        </Button>
      </Group>
    );
  }
  return (
    <Group gap='xs'>
      <Text size='md' fw={700}>
        Chia sẻ
      </Text>
      {links.map(({ name, url, label, icon: Icon, color }, index) => {
        if (index >= 3) {
          return;
        }
        return (
          <Tooltip label={label} key={name + index}>
            <ActionIcon
              key={name + index}
              component='a'
              href={url}
              target='_blank'
              rel='noopener noreferrer'
              title={name}
              color={color}
              radius='xl'
              size={'lg'}
              className='transition-transform hover:scale-125'
            >
              <Icon size={20} />
            </ActionIcon>
          </Tooltip>
        );
      })}
    </Group>
  );
}

export default ShareSocials;
