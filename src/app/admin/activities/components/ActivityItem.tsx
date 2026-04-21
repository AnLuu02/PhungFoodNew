'use client';

import { ActionIcon, Badge, Box, Checkbox, Group, Text } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';

import dayjs from 'dayjs';
import { useState } from 'react';
import { formatTimeAgo } from '~/lib/FuncHandler/Format';
import { getActionDetails } from '~/lib/FuncHandler/getThemeActivity';
import { DiffChange } from './DiffChange';

interface ActivityItemProps {
  log: any;
  checked?: boolean;
  onCheckboxChange?: (id: string, checked: boolean) => void;
}

export const ActivityItem = ({ log, checked, onCheckboxChange }: ActivityItemProps) => {
  const [expanded, setExpanded] = useState(false);
  const actionDetail = getActionDetails(log);

  return (
    <Box
      className='transition-colors hover:bg-gray-50'
      style={{
        borderLeft: `4px solid var(--mantine-color-${actionDetail.color}-5)`,
        paddingTop: 'var(--mantine-spacing-md)',
        paddingBottom: 'var(--mantine-spacing-md)',
        paddingLeft: 'var(--mantine-spacing-md)'
      }}
    >
      <Group align='flex-start' wrap='nowrap' gap='md'>
        <Box pt={4}>
          <Checkbox
            size='xs'
            checked={checked}
            onChange={event => onCheckboxChange?.(log.id, event.currentTarget.checked)}
            styles={{ input: { cursor: 'pointer' } }}
          />
        </Box>

        <Box className='flex-1'>
          <Group justify='space-between' align='flex-start' wrap='nowrap'>
            <Box className='flex-1'>
              <Group gap='sm' mb={6}>
                <Text size='lg'>{actionDetail.icon}</Text>
                <Badge color={actionDetail.color} variant='light'>
                  {log.action}
                </Badge>
                <Text size='xs' c='dimmed' ff='monospace'>
                  #{log.entityId.slice(-8)}
                </Text>
              </Group>

              <Box mb={4} style={{ fontSize: 'var(--mantine-font-size-sm)' }}>
                <Text fw={700} component='span' c='dark.4'>
                  {log.user.name || log.user.email}
                </Text>
                <Text component='span' mx={4} c='dimmed'>
                  {actionDetail.label}
                </Text>
                <Text fw={600} component='span' c={actionDetail.color}>
                  {log.metadata?.after?.name || log?.entityType?.toUpperCase() || ''}
                </Text>
              </Box>

              <Text size='xs' c='dimmed' suppressHydrationWarning>
                {dayjs(log.createdAt).format('MMM DD, YYYY HH:mm:ss')} ({formatTimeAgo(log.createdAt)})
              </Text>
            </Box>

            <ActionIcon variant='subtle' color='gray' onClick={() => setExpanded(!expanded)}>
              <IconChevronDown size={18} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
            </ActionIcon>
          </Group>

          <DiffChange log={log} expanded={expanded} />
        </Box>
      </Group>
    </Box>
  );
};
