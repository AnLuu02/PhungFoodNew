'use client';

import { Button, Card } from '@mantine/core';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import BButton from '~/components/Button';

type ReusablePromoBannerProps = {
  title: string;
  subtitle?: React.ReactNode | string;
  buttonText?: string;
  buttonLink?: string;
  layout?: 'center' | 'left' | 'right' | 'split';
  variant?: 'default' | 'gradient' | 'minimal' | 'bold';
  overlayColor?: string;
  height?: number;
  backgroundImage?: string;
  image?: string;
  reverse?: boolean;
  bgColor?: string;
  textColor?: string;
};

export default function ReusablePromoBanner({
  title,
  subtitle,
  buttonText = 'Khám phá ngay',
  buttonLink = '/',
  layout = 'center',
  variant = 'default',
  overlayColor = 'rgba(0,0,0,0.6)',
  height = 400,
  backgroundImage,
  image,
  reverse = false,
  bgColor = '#f8f9fa',
  textColor = 'text-gray-900'
}: ReusablePromoBannerProps) {
  if (backgroundImage) {
    return (
      <Card className='relative overflow-hidden rounded-2xl border-0 shadow-2xl' p={0}>
        <div className='relative w-full' style={{ height: `${height < 400 ? 400 : height}px` }}>
          <Image
            src={backgroundImage || '/placeholder.svg'}
            fill
            className='object-cover transition-transform duration-700 hover:scale-105'
            alt='Banner Background'
          />

          {/* Overlay */}
          <div className='absolute inset-0 flex items-center justify-center' style={{ backgroundColor: overlayColor }}>
            <div
              className={`max-w-4xl px-8 text-center ${layout === 'left' ? 'mr-auto text-left' : ''} ${layout === 'right' ? 'ml-auto text-right' : ''} `}
            >
              <div className='space-y-6'>
                <h1 className='text-4xl font-bold leading-tight text-white md:text-6xl lg:text-6xl'>{title}</h1>
                {subtitle && <p className='text-xl leading-tight text-white/90 md:text-2xl lg:text-3xl'>{subtitle}</p>}
                {buttonText && (
                  <div className='pt-4'>
                    <Link href={buttonLink}>
                      <BButton size='lg' title={buttonText} />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Split layout variants
  const getVariantStyles = () => {
    switch (variant) {
      case 'gradient':
        return 'bg-gradient-to-br from-blue-50 via-white to-purple-50';
      case 'minimal':
        return 'bg-white border border-gray-200';
      case 'bold':
        return 'bg-gradient-to-r from-purple-600 to-blue-600';
      default:
        return '';
    }
  };

  const getTextColor = () => {
    if (variant === 'bold') return 'text-white';
    return textColor;
  };

  return (
    <Card
      className={`overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl ${getVariantStyles()} `}
      style={{
        backgroundColor: variant === 'default' ? bgColor : undefined,
        minHeight: `${height}px`
      }}
    >
      <div
        className={`flex min-h-full items-center ${layout === 'split' ? 'flex-col lg:flex-row' : 'flex-col md:flex-row'} ${reverse ? 'md:flex-row-reverse lg:flex-row-reverse' : ''} ${!image ? 'justify-center text-center' : ''} `}
      >
        {/* Content Section */}
        <div
          className={`flex-1 p-8 lg:p-12 ${layout === 'split' ? 'lg:p-16' : ''} ${!image ? 'flex flex-col items-center justify-center' : ''} `}
        >
          <div className={`max-w-2xl space-y-6 ${layout === 'center' && !image ? 'text-center' : ''} `}>
            <h1
              className={`text-3xl font-bold leading-tight md:text-4xl lg:text-5xl ${getTextColor()} ${layout === 'split' ? 'lg:text-6xl' : ''} `}
            >
              {title}
            </h1>

            {subtitle && (
              <p
                className={`text-lg md:text-xl lg:text-2xl ${variant === 'bold' ? 'text-white/90' : 'text-gray-600'} `}
              >
                {subtitle}
              </p>
            )}

            {buttonText && (
              <div className='pt-4'>
                <Link href={buttonLink}>
                  <Button
                    size='lg'
                    className={`rounded-full px-8 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105 ${
                      variant === 'bold'
                        ? 'bg-white text-purple-600 hover:bg-gray-100'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    } `}
                  >
                    {buttonText}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Image Section */}
        {image && (
          <div className={`flex-1 p-8 lg:p-12 ${layout === 'split' ? 'lg:p-16' : ''} flex items-center justify-center`}>
            <div className='relative w-full max-w-lg'>
              <Image
                src={image || '/placeholder.svg'}
                alt='Banner Visual'
                width={500}
                height={400}
                className='h-auto w-full rounded-xl shadow-lg transition-transform duration-300 hover:scale-105'
              />
              {/* Decorative elements */}
              <div className='absolute -right-4 -top-4 h-24 w-24 animate-pulse rounded-full bg-blue-200 opacity-20'></div>
              <div className='absolute -bottom-4 -left-4 h-16 w-16 animate-pulse rounded-full bg-purple-200 opacity-30 delay-1000'></div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
