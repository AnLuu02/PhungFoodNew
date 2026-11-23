import { Box, Text, Title } from '@mantine/core';

export const SectionHeading = ({
  index,
  title,
  description,
  center = false,
  classNames
}: {
  index: string;
  title: string;
  description?: string;
  center?: boolean;
  classNames?: {
    title?: string;
    des?: string;
  };
}) => {
  return (
    <Box pos='relative' className={center ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      <Text className='pointer-events-none absolute -top-12 left-0 select-none font-quicksand text-[96px] font-black leading-none text-mainColor/[0.08] md:text-[130px]'>
        {index}
      </Text>

      <Title
        className={`relative z-10 text-balance font-quicksand text-4xl font-black text-mainColor md:text-5xl ${classNames?.title ?? ''}`}
      >
        {title}
      </Title>

      {description ? (
        <Text mt='md' c='dimmed' className={`relative z-10 text-pretty text-lg leading-8 ${classNames?.des ?? ''}`}>
          {description}
        </Text>
      ) : null}
    </Box>
  );
};
