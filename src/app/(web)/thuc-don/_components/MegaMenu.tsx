import { Box, Grid, Image, Stack, Text, UnstyledButton } from '@mantine/core';
export function MegaMenu({ categories }: any) {
  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 8 }}>
        <Grid>
          {categories.map((category: any) => (
            <Grid.Col key={category?.id} span={{ base: 12, sm: 6, md: 4 }}>
              <Box className='p-4 transition-colors hover:bg-gray-50'>
                <Text className={`mb-3 font-medium`} size='md' c={'green.9'}>
                  {category?.name}
                </Text>
                <Stack gap='xs'>
                  {category?.subCategory?.map((item: any) => (
                    <UnstyledButton
                      size={'md'}
                      key={item?.id}
                      className='text-gray-600 transition-colors hover:text-[#008b4b]'
                    >
                      {item?.name}
                    </UnstyledButton>
                  ))}
                </Stack>
              </Box>
            </Grid.Col>
          ))}
        </Grid>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 4 }}>
        <Image
          loading='lazy'
          src='/images/webp/megamenu_banner.webp'
          h={'100%'}
          w={'100%'}
          alt='Fresh produce'
          className='h-full w-full object-cover p-2'
        />
      </Grid.Col>
    </Grid>
  );
}
