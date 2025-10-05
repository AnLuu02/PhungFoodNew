'use client';

import {
  Box,
  Button,
  Divider,
  Grid,
  GridCol,
  Group,
  Paper,
  Select,
  Stack,
  Switch,
  Text,
  Textarea,
  TextInput,
  Title
} from '@mantine/core';
import { IconBuildingStore, IconRestore, IconSettings, IconSpacingVertical, IconUpload } from '@tabler/icons-react';
import { Controller } from 'react-hook-form';
export default function GeneralTab({ control }: any) {
  const handleLogoUpload = () => {
    //notify
  };

  return (
    <>
      <Paper radius={'md'} shadow='md' p={'lg'} className='bg-gray-100 dark:bg-dark-card'>
        <Box mb={'md'}>
          <Title order={4} className='flex items-center gap-2 font-quicksand'>
            <IconRestore className='h-5 w-5' />
            Thông tin cơ bản
          </Title>
          <Text fw={600} size={'sm'} c={'dimmed'}>
            Cập nhật tên, mô tả và thương hiệu của nhà hàng
          </Text>
        </Box>
        <Box className='space-y-6'>
          <Box className='grid gap-4'>
            <Stack>
              <Controller
                control={control}
                name='name'
                render={({ field, fieldState }) => (
                  <TextInput
                    {...field}
                    radius={'md'}
                    label='Tên nhà hàng'
                    size='sm'
                    placeholder='Nhập tên nhà hàng'
                    required
                    error={fieldState.error?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name='description'
                render={({ field, fieldState }) => (
                  <Textarea
                    {...field}
                    radius={'md'}
                    label='Mô tả nhà hàng'
                    placeholder='Enter restaurant description'
                    minRows={4}
                    error={fieldState.error?.message}
                  />
                )}
              />
            </Stack>

            <Box className='space-y-4'>
              <Text fw={600}>Logo nhà hàng</Text>
              <Box className='flex items-center gap-4'>
                <Box className='bg-muted flex h-20 w-20 items-center justify-center rounded-lg'>
                  <IconBuildingStore className='text-muted-foreground h-8 w-8' />
                </Box>
                <Box className='space-y-2'>
                  <Button
                    variant='subtle'
                    size='sm'
                    onClick={handleLogoUpload}
                    styles={{
                      root: {
                        border: '1px solid '
                      }
                    }}
                    classNames={{
                      root: `!rounded-md !border-gray-300 !font-bold text-black hover:bg-mainColor/10 hover:text-black data-[active=true]:!border-mainColor data-[active=true]:!bg-mainColor data-[active=true]:!text-white dark:!border-dark-dimmed dark:text-white`
                    }}
                  >
                    <IconUpload className='mr-2 h-4 w-4' />
                    Upload logo
                  </Button>
                  <p className='text-muted-foreground text-xs'>Khuyến khích: 200x200px, PNG or JPG</p>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>

      <Paper radius={'md'} shadow='md' p={'lg'} className='bg-gray-100 dark:bg-dark-card'>
        <Box mb={'md'}>
          <Title order={4} className='flex items-center gap-2 font-quicksand'>
            <IconSettings className='h-5 w-5' />
            Tình trạng nhà hàng
          </Title>
          <Text fw={600} size={'sm'} c={'dimmed'}>
            Kiểm soát tình trạng hoạt động của nhà hàng của bạn
          </Text>
        </Box>
        <Box className='space-y-4'>
          <Box className='flex items-center justify-between'>
            <Box className='space-y-1'>
              <label>
                <Text fw={700}>Nhà hàng mở</Text>
              </label>
              <Text size='sm' c={'dimmed'}>
                Chuyển đổi nếu nhà hàng của bạn hiện đang mở cửa
              </Text>
            </Box>
            <Switch />
          </Box>

          <Divider />

          <Box className='flex items-center justify-between'>
            <Box className='space-y-1'>
              <label>
                <Text fw={700}>Chấp nhận đơn đặt hàng</Text>
              </label>
              <Text size='sm' c={'dimmed'}>
                Cho phép khách hàng đặt hàng mới
              </Text>
            </Box>
            <Switch />
          </Box>

          <Divider />

          <Box className='flex items-center justify-between'>
            <Box className='space-y-1'>
              <label>
                <Text fw={700}>Có sẵn giao hàng</Text>
              </label>
              <Text size='sm' c={'dimmed'}>
                Cung cấp dịch vụ giao hàng cho khách hàng
              </Text>
            </Box>
            <Switch />
          </Box>

          <Divider />

          <Box className='flex items-center justify-between'>
            <Box className='space-y-1'>
              <label>
                <Text fw={700}>Có sẵn xe đón</Text>
              </label>
              <Text size='sm' c={'dimmed'}>
                Cho phép khách hàng nhận đơn hàng
              </Text>
            </Box>
            <Switch />
          </Box>
        </Box>
      </Paper>
      <Paper radius={'md'} shadow='md' p={'lg'} className='bg-gray-100 dark:bg-dark-card'>
        <Title className='font-quicksand' order={4} mb={'md'}>
          Cài đặt khu vực
        </Title>
        <Grid>
          <GridCol span={6}>
            <Select
              radius={'md'}
              label='Cài đặt múi giờ'
              size='sm'
              defaultValue={'7'}
              placeholder='Nhập tên nhà hàng'
              data={[
                {
                  label: 'GMT +7 (Việt Nam)',
                  value: '7'
                },
                {
                  label: 'GMT +8 (Việt Nam)',
                  value: '8'
                },
                {
                  label: 'GMT +9 (Việt Nam)',
                  value: '9'
                }
              ]}
            />
          </GridCol>
          <GridCol span={6}>
            <Select
              radius={'md'}
              label='Ngôn ngữ mặc định'
              size='sm'
              placeholder='Nhập tên nhà hàng'
              defaultValue={'vi'}
              data={[
                {
                  label: 'Việt Nam',
                  value: 'vi'
                },
                {
                  label: 'English',
                  value: 'en'
                },
                {
                  label: 'Trung Quốc',
                  value: 'zh'
                },
                {
                  label: 'Nga',
                  value: 'ru'
                }
              ]}
            />
          </GridCol>
          <GridCol span={6}>
            <Select
              radius={'md'}
              label='Định dạng ngày'
              size='sm'
              defaultValue={'dd/mm/yyyy'}
              placeholder='Nhập tên nhà hàng'
              data={[
                {
                  label: 'DD/MM/YYYY',
                  value: 'dd/mm/yyyy'
                },
                {
                  label: 'MM/DD/YYYY',
                  value: 'mm/dd/yyyy'
                },
                {
                  label: 'YYYY/MM/DD',
                  value: 'yyyy/mm/dd'
                }
              ]}
            />
          </GridCol>
        </Grid>
      </Paper>

      <Paper radius={'md'} shadow='md' p={'lg'} className='bg-gray-100 dark:bg-dark-card'>
        <Title className='font-quicksand' order={4} mb={'md'}>
          Trạng thái hệ thống
        </Title>
        <Grid>
          <GridCol span={6}>
            <Stack gap={4}>
              <Text size='sm' fw={700}>
                Chế độ bảo trì
              </Text>
              <Switch size='sm' />
              <Text size='xs' c={'dimmed'}>
                Tạm dừng truy cập website
              </Text>
            </Stack>
          </GridCol>
          <GridCol span={6}>
            <Stack gap={4}>
              <Text size='sm' fw={700}>
                Đăng ký mới
              </Text>
              <Switch size='sm' />
              <Text size='xs' c={'dimmed'}>
                Cho phép người dùng đăng ký
              </Text>
            </Stack>
          </GridCol>
          <GridCol span={6}>
            <Stack gap={4}>
              <Text size='sm' fw={700}>
                Chế độ gỡ lỗi
              </Text>
              <Switch size='sm' />
              <Text size='xs' c={'dimmed'}>
                Hiển thị thông tin debug
              </Text>
            </Stack>
          </GridCol>
        </Grid>
      </Paper>

      <Group justify='flex-start'>
        <Button
          type='submit'
          leftSection={<IconSpacingVertical size={16} />}
          className='bg-mainColor duration-100 hover:bg-subColor hover:text-black'
          radius={'md'}
        >
          Lưu thay đổi
        </Button>
      </Group>
    </>
  );
}
