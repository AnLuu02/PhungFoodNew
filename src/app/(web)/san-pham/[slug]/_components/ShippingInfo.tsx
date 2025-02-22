'use client';

import { Group, Stack, Text, rem } from '@mantine/core';
import { IconRefresh, IconShieldCheck, IconTruck } from '@tabler/icons-react';

export function ShippingInfo() {
  return (
    <Group mt={{ base: 20, sm: 'xs', md: 'xs', lg: 'xl' }} grow>
      <Stack align='center' gap={5}>
        <IconTruck style={{ width: rem(24), height: rem(24) }} stroke={1.5} />
        <Text size='xs' ta='center'>
          Miễn phí vận chuyển tại TPHCM
        </Text>
      </Stack>
      <Stack align='center' gap={5}>
        <IconShieldCheck style={{ width: rem(24), height: rem(24) }} stroke={1.5} />
        <Text size='xs' ta='center'>
          Bảo hành chính hãng toàn quốc
        </Text>
      </Stack>
      <Stack align='center' gap={5}>
        <IconRefresh style={{ width: rem(24), height: rem(24) }} stroke={1.5} />
        <Text size='xs' ta='center'>
          1 đổi 1 nếu sản phẩm lỗi
        </Text>
      </Stack>
    </Group>
  );
}
