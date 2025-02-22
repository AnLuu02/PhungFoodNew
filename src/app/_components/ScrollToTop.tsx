'use client';
import { ActionIcon, Affix, Transition } from '@mantine/core';
import { useWindowScroll } from '@mantine/hooks';
import { IconArrowUp } from '@tabler/icons-react';

function ScrollToTop() {
  const [scroll, scrollTo] = useWindowScroll();

  return (
    <Affix position={{ bottom: 20, right: 20 }}>
      <Transition transition='slide-up' mounted={scroll.y > 150}>
        {transitionStyles => (
          <ActionIcon color='indigo' variant='filled' style={transitionStyles} onClick={() => scrollTo({ y: 0 })}>
            <IconArrowUp size={30} />
          </ActionIcon>
        )}
      </Transition>
    </Affix>
  );
}

export default ScrollToTop;
