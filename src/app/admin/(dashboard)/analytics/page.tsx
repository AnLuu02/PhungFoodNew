import type { Metadata } from 'next';
import ComingSoon from '~/components/ComingSoon';

export const metadata: Metadata = {
  title: 'Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template',
  description: 'This is Next.js Home for TailAdmin Dashboard Template'
};

export default async function AnalyticsPage() {
  // return (
  //   <>
  //     <Divider my={'md'} />
  //     <Stack gap={'lg'} pb={'xl'} mb={'xl'}>
  //       <Flex align={'center'} justify={'space-between'}>
  //         <Box>
  //           <Title mb={4} className='font-quicksand' order={2}>
  //             Trang tổng quan phân tích
  //           </Title>
  //           <Text size='sm' c={'dimmed'}>
  //             Phân tích hành vi trong hệ thống PhungFood
  //           </Text>
  //         </Box>
  //         <DatePickerInput type='range' size='xs' leftSection={<IconCalendar size={20} />} placeholder='Pick a date' />
  //       </Flex>
  //       <ReportsOther />
  //     </Stack>
  //   </>
  // );

  return (
    <>
      <ComingSoon variant='page' />
    </>
  );
}
