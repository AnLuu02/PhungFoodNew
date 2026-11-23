'use client';

import { Text } from '@mantine/core';
import { useState } from 'react';

const _ARR_TEXT = ['đặt là có ưu đãi', 'số lượng có hạn', 'giảm đến 40%', 'ưu đãi hôm nay', 'ưu đãi hấp dẫn'];

export const TextTyping = ({ className, text }: { className?: string; text?: string[] }) => {
  const ARR_TEXT = text ?? _ARR_TEXT;
  const [index, setIndex] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);

  const handleAnimationIteration = () => {
    setIndex(prev => (prev + 1) % ARR_TEXT.length);
    setAnimationKey(prev => prev + 1);
  };

  return (
    <Text
      key={animationKey}
      span
      onAnimationIteration={handleAnimationIteration}
      className={`'} inline-block animate-typing overflow-hidden whitespace-nowrap font-quicksand ${
        className
          ? className
          : 'h-[45px] bg-gradient-to-r from-subColor via-orange-300 to-yellow-200 bg-clip-text text-4xl font-black leading-tight text-transparent md:h-[80px] md:text-7xl'
      }`}
    >
      {ARR_TEXT[index]}
    </Text>
  );
};
