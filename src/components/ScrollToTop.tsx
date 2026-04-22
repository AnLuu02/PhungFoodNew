'use client';
import { ActionIcon, Box, Transition } from '@mantine/core';
import { IconArrowUp } from '@tabler/icons-react';
import useScrollPosition from './Hooks/use-on-scroll';

function ScrollToTop() {
  const scroll = useScrollPosition(10);

  return (
    <Box pos={'fixed'} right={{ base: 10, sm: 20 }} bottom={{ base: 80, sm: 20 }} className='z-[10003] duration-150'>
      <Transition transition='slide-up' mounted={scroll > 9}>
        {transitionStyles => (
          <ActionIcon
            variant='filled'
            radius={'xl'}
            classNames={{
              root: 'bg-mainColor hover:bg-subColor hover:text-black'
            }}
            style={transitionStyles}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <IconArrowUp size={30} />
          </ActionIcon>
        )}
      </Transition>
    </Box>
  );
}

export default ScrollToTop;
