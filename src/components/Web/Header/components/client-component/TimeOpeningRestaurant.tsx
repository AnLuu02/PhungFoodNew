'use client';

import { Button } from '@mantine/core';
import { IconClock } from '@tabler/icons-react';
import { useMemo } from 'react';
import { RestaurantBase } from '~/shared/type-trpc/restaurant.type-trpc';

export const TimeOpeningRestaurant = ({ restaurant }: { restaurant: RestaurantBase }) => {
  const timeOpen = useMemo(() => {
    const timeIndex = new Date().getDay();
    const timeOpens = restaurant?.openingHours ?? [];
    const timeOpen = timeOpens?.find(
      (item: NonNullable<RestaurantBase>['openingHours'][number]) => item?.dayOfWeek === timeIndex?.toString()
    );
    return {
      ...timeOpen,
      timeIndex
    };
  }, [restaurant]);

  return (
    <>
      <Button
        size='xs'
        radius='xl'
        variant='transparent'
        className='hover:text-subColor'
        leftSection={<IconClock size={16} />}
        classNames={{
          root: `font-quicksand hover:text-subColor ${!timeOpen?.isClosed ? 'text-white' : 'text-subColor'}`
        }}
      >
        {!timeOpen?.isClosed && timeOpen?.openTime && timeOpen?.closeTime
          ? `MỞ CỬA: ${timeOpen?.openTime} ĐẾN ${timeOpen?.closeTime}`
          : `ĐÃ ĐÓNG CỬA`}
      </Button>
    </>
  );
};
