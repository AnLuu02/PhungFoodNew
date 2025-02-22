import { Text } from '@mantine/core';
import { hoursRemainingVoucher } from '~/app/lib/utils/func-handler/vouchers';

const DateVoucher = ({ item }: { item: any }) => {
  return hoursRemainingVoucher(item.startDate, item?.endDate)?.type == 'active' ? (
    <Text color='dimmed' size='xs' pr={4}>
      {hoursRemainingVoucher(item.startDate, item?.endDate)?.value}
    </Text>
  ) : hoursRemainingVoucher(item.startDate, item?.endDate)?.type == 'upcoming' ? (
    <Text color='dimmed' size='xs' pr={4}>
      {hoursRemainingVoucher(item.startDate, item?.endDate)?.value}
    </Text>
  ) : (
    <Text color='dimmed' size='xs' pr={4}>
      {hoursRemainingVoucher(item.startDate, item?.endDate)?.value}
    </Text>
  );
};
export default DateVoucher;
