import { Text } from '@mantine/core';
import { hoursRemainingVoucher } from '~/lib/func-handler/vouchers-calculate';

const DateVoucher = ({ item }: { item: any }) => {
  return hoursRemainingVoucher(item.startDate, item?.endDate)?.type == 'active' ? (
    <Text c='dimmed' size='xs' pr={4}>
      {hoursRemainingVoucher(item.startDate, item?.endDate)?.value}
    </Text>
  ) : hoursRemainingVoucher(item.startDate, item?.endDate)?.type == 'upcoming' ? (
    <Text c='dimmed' size='xs' pr={4}>
      {hoursRemainingVoucher(item.startDate, item?.endDate)?.value}
    </Text>
  ) : (
    <Text c='dimmed' size='xs' pr={4}>
      {hoursRemainingVoucher(item.startDate, item?.endDate)?.value}
    </Text>
  );
};
export default DateVoucher;
