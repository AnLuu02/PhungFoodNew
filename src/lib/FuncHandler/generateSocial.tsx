import {
  IconBasket,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandMessenger,
  IconBrandSnapchat,
  IconBrandTelegram,
  IconBrandThreads,
  IconBrandTiktok,
  IconBrandUber,
  IconBrandWhatsapp,
  IconBrandX,
  IconBrandYoutube,
  IconCar,
  IconMail,
  IconMapPin,
  IconMessageCircle2,
  IconPhone,
  IconShoppingBag,
  IconShoppingCart,
  IconWorldWww
} from '@tabler/icons-react';

export const TEMPLATE_OPTIONS = [
  {
    value: 'custom',
    label: 'Tùy chỉnh',
    defaultData: {
      platform: 'custom',
      label: 'Liên kết tùy chỉnh',
      isActive: false,
      pattern: '{value}',
      icon: 'IconLink'
    }
  },
  {
    value: 'phone',
    label: 'Phone',
    defaultData: {
      platform: 'phone',
      label: 'Số điện thoại',
      isActive: false,
      pattern: 'tel:{value}',
      icon: 'IconPhone'
    }
  },
  {
    value: 'email',
    label: 'Email',
    defaultData: {
      platform: 'email',
      label: 'Email',
      isActive: false,
      pattern: 'mailto:{value}',
      icon: 'IconMail'
    }
  },
  {
    value: 'facebook',
    label: 'Facebook',
    defaultData: {
      platform: 'facebook',
      label: 'Facebook',
      isActive: false,
      pattern: 'https://facebook.com/{value}',
      icon: 'IconBrandFacebook'
    }
  },
  {
    value: 'messenger',
    label: 'Messenger',
    defaultData: {
      platform: 'messenger',
      label: 'Facebook Messenger',
      isActive: false,
      pattern: 'https://m.me/{value}',
      icon: 'IconBrandMessenger'
    }
  },
  {
    value: 'zalo',
    label: 'Zalo',
    defaultData: {
      platform: 'zalo',
      label: 'Zalo Chat',
      isActive: false,
      pattern: 'https://zalo.me/{value}',
      icon: 'IconMessageCircle2'
    }
  },
  {
    value: 'instagram',
    label: 'Instagram',
    defaultData: {
      platform: 'instagram',
      label: 'Instagram',
      isActive: false,
      pattern: 'https://instagram.com/{value}',
      icon: 'IconBrandInstagram'
    }
  },
  {
    value: 'tiktok',
    label: 'TikTok',
    defaultData: {
      platform: 'tiktok',
      label: 'TikTok',
      isActive: false,
      pattern: 'https://www.tiktok.com/@{value}',
      icon: 'IconBrandTiktok'
    }
  },
  {
    value: 'youtube',
    label: 'YouTube',
    defaultData: {
      platform: 'youtube',
      label: 'YouTube',
      isActive: false,
      pattern: 'https://www.youtube.com/{value}',
      icon: 'IconBrandYoutube'
    }
  },
  {
    value: 'twitter',
    label: 'Twitter / X',
    defaultData: {
      platform: 'twitter',
      label: 'Twitter (X)',
      isActive: false,
      pattern: 'https://twitter.com/{value}',
      icon: 'IconBrandX'
    }
  },
  {
    value: 'linkedin',
    label: 'LinkedIn',
    defaultData: {
      platform: 'linkedin',
      label: 'LinkedIn',
      isActive: false,
      pattern: 'https://linkedin.com/in/{value}',
      icon: 'IconBrandLinkedin'
    }
  },
  {
    value: 'telegram',
    label: 'Telegram',
    defaultData: {
      platform: 'telegram',
      label: 'Telegram',
      isActive: false,
      pattern: 'https://t.me/{value}',
      icon: 'IconBrandTelegram'
    }
  },
  {
    value: 'whatsapp',
    label: 'WhatsApp',
    defaultData: {
      platform: 'whatsapp',
      label: 'WhatsApp',
      isActive: false,
      pattern: 'https://wa.me/{value}',
      icon: 'IconBrandWhatsapp'
    }
  },
  {
    value: 'threads',
    label: 'Threads',
    defaultData: {
      platform: 'threads',
      label: 'Threads',
      isActive: false,
      pattern: 'https://threads.net/@{value}',
      icon: 'IconBrandThreads'
    }
  },
  {
    value: 'snapchat',
    label: 'Snapchat',
    defaultData: {
      platform: 'snapchat',
      label: 'Snapchat',
      isActive: false,
      pattern: 'https://www.snapchat.com/add/{value}',
      icon: 'IconBrandSnapchat'
    }
  },
  {
    value: 'website',
    label: 'Website',
    defaultData: {
      platform: 'website',
      label: 'Website',
      isActive: false,
      pattern: '{value}',
      icon: 'IconWorldWww'
    }
  },
  {
    value: 'map',
    label: 'Google Maps',
    defaultData: {
      platform: 'map',
      label: 'Google Maps',
      isActive: false,
      pattern: 'https://maps.google.com/?q={value}',
      icon: 'IconMapPin'
    }
  },
  {
    value: 'shopee',
    label: 'Shopee',
    defaultData: {
      platform: 'shopee',
      label: 'Shopee',
      isActive: false,
      pattern: 'https://shopee.vn/{value}',
      icon: 'IconShoppingBag'
    }
  },
  {
    value: 'tiki',
    label: 'Tiki',
    defaultData: {
      platform: 'tiki',
      label: 'Tiki',
      isActive: false,
      pattern: 'https://tiki.vn/{value}',
      icon: 'IconShoppingCart'
    }
  },
  {
    value: 'lazada',
    label: 'Lazada',
    defaultData: {
      platform: 'lazada',
      label: 'Lazada',
      isActive: false,
      pattern: 'https://www.lazada.vn/{value}',
      icon: 'IconBasket'
    }
  },
  {
    value: 'grab',
    label: 'Grab',
    defaultData: {
      platform: 'grab',
      label: 'Grab',
      isActive: false,
      pattern: 'https://www.grab.com/vn/{value}',
      icon: 'IconCar'
    }
  },
  {
    value: 'be',
    label: 'Be',
    defaultData: {
      platform: 'be',
      label: 'Be Ride Hailing',
      isActive: false,
      pattern: 'https://be.com.vn/{value}',
      icon: 'IconBrandUber'
    }
  }
];
export const iconMap: Record<string, { icon: React.ElementType; color: string }> = {
  phone: { icon: IconPhone, color: '#34A853' }, // xanh Google phone
  email: { icon: IconMail, color: '#EA4335' }, // đỏ Gmail
  facebook: { icon: IconBrandFacebook, color: '#1877F2' },
  messenger: { icon: IconBrandMessenger, color: '#00B2FF' },
  zalo: { icon: IconMessageCircle2, color: '#0068FF' },
  instagram: { icon: IconBrandInstagram, color: '#E4405F' },
  tiktok: { icon: IconBrandTiktok, color: '#000000' },
  youtube: { icon: IconBrandYoutube, color: '#FF0000' },
  twitter: { icon: IconBrandX, color: '#000000' },
  linkedin: { icon: IconBrandLinkedin, color: '#0A66C2' },
  telegram: { icon: IconBrandTelegram, color: '#0088CC' },
  whatsapp: { icon: IconBrandWhatsapp, color: '#25D366' },
  threads: { icon: IconBrandThreads, color: '#000000' },
  snapchat: { icon: IconBrandSnapchat, color: '#FFFC00' },
  website: { icon: IconWorldWww, color: '#0284C7' },
  map: { icon: IconMapPin, color: '#4285F4' },
  shopee: { icon: IconShoppingBag, color: '#EE4D2D' },
  tiki: { icon: IconShoppingCart, color: '#189EFF' },
  lazada: { icon: IconBasket, color: '#F36C21' },
  grab: { icon: IconCar, color: '#00B14F' },
  be: { icon: IconBrandUber, color: '#F7B500' }
};
export function generateSocialUrl(pattern: string, value: string): string {
  return pattern.replace('{value}', value);
}
