'use client';
import { ActionIcon, Affix, Transition } from '@mantine/core';
import { IconArrowUp } from '@tabler/icons-react';
import useScrollPosition from './Hooks/use-on-scroll';

function ScrollToTop() {
  const scroll = useScrollPosition(10);

  return (
    <Affix position={{ bottom: 80, right: 10 }} zIndex={10003}>
      <Transition transition='slide-up' mounted={scroll > 9}>
        {transitionStyles => (
          <ActionIcon
            variant='filled'
            radius={'xl'}
            classNames={{
              root: 'bg-mainColor'
            }}
            style={transitionStyles}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <IconArrowUp size={30} />
          </ActionIcon>
        )}
      </Transition>
    </Affix>
  );
}

export default ScrollToTop;
