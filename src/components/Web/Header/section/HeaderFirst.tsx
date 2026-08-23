import { Box, Flex, Group, Text } from '@mantine/core';
import NotificationDialog from '~/components/NotificationDialog';
import UserSection from '~/components/UserSection';
import { RestaurantBase } from '~/shared/type-trpc/restaurant.type-trpc';
import ButtonControlModeTheme from '../../../Button/ButtonControlModeTheme';
import { TimeOpeningRestaurant } from '../components/client-component/TimeOpeningRestaurant';
import { ToggleLanguage } from '../components/client-component/ToggleLanguage';

export const HeaderClient = ({ restaurant }: { restaurant: RestaurantBase }) => {
  return (
    <>
      <NotificationDialog />
      <Flex
        direction={{ base: 'column', sm: 'row', md: 'row' }}
        h={{ base: 'max-content', md: 40 }}
        pos={'relative'}
        pl={{ base: 20, lg: 130 }}
        pr={{ base: 20, lg: 130 }}
        pb={{ base: 4, sm: 0 }}
        align={'center'}
        justify={{ base: 'flex-start', sm: 'space-between', md: 'space-between' }}
        className='z-[100] bg-mainColor text-white'
      >
        <Box>
          <Text
            size='sm'
            className='inline-block animate-typing overflow-hidden whitespace-nowrap'
            style={{ maxWidth: 'fit-content' }}
          >
            Phụng Food! xin chào quý khách!
          </Text>
        </Box>

        <Group align={'center'} justify='center' gap={0}>
          <Group gap='md' align={'center'} justify='center' h={{ base: 40, sm: 'max-content' }}>
            <TimeOpeningRestaurant restaurant={restaurant} />
            <ToggleLanguage />
            <UserSection responsive={true} />
            <Box
              pos={{ base: 'fixed', sm: 'unset', md: 'unset', lg: 'fixed' }}
              left={{ base: 5, sm: 0, md: 0, lg: 5 }}
              top={{ base: 8, sm: 15, md: 0, lg: 8 }}
              className='sm:hidden md:block'
              pr={10}
            >
              <ButtonControlModeTheme />
            </Box>
          </Group>
        </Group>
      </Flex>
    </>
  );
};
