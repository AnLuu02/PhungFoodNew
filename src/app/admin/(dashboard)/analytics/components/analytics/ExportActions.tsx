'use client';

import { ActionIcon, Button, Divider, Group, Paper, Stack, Text, Title, Tooltip } from '@mantine/core';
import {
  IconFileExcel,
  IconFileTypeCsv,
  IconFileTypePdf,
  IconInfoCircle,
  IconMail,
  IconPrinter,
  IconShare
} from '@tabler/icons-react';

interface ExportActionsProps {
  onExport: (format: 'pdf' | 'excel' | 'csv') => void;
  onShare?: () => void;
  onEmail?: () => void;
  onPrint?: () => void;
  loading?: boolean;
}

export function ExportActions({ onExport, onShare, onEmail, onPrint, loading }: ExportActionsProps) {
  return (
    <Paper p='md' withBorder>
      <Group justify='space-between' mb='md'>
        <Group>
          <IconFileTypePdf size={24} />
          <Title order={3}>Xuất & Báo cáo</Title>
          <Tooltip label='Xuất báo cáo và chia sẻ dữ liệu'>
            <IconInfoCircle size={18} style={{ opacity: 0.6 }} />
          </Tooltip>
        </Group>
      </Group>

      <Stack gap='sm'>
        <Group grow>
          <Button
            leftSection={<IconFileTypePdf size={18} />}
            variant='light'
            onClick={() => onExport('pdf')}
            loading={loading}
          >
            PDF
          </Button>
          <Button
            leftSection={<IconFileExcel size={18} />}
            variant='light'
            color='green'
            onClick={() => onExport('excel')}
            loading={loading}
          >
            Excel
          </Button>
          <Button
            leftSection={<IconFileTypeCsv size={18} />}
            variant='light'
            color='blue'
            onClick={() => onExport('csv')}
            loading={loading}
          >
            CSV
          </Button>
        </Group>

        <Divider label='Share' labelPosition='center' />

        <Group grow>
          <Tooltip label='Share report link'>
            <ActionIcon variant='light' size='lg' onClick={onShare}>
              <IconShare size={18} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label='Email report'>
            <ActionIcon variant='light' size='lg' onClick={onEmail}>
              <IconMail size={18} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label='Print'>
            <ActionIcon variant='light' size='lg' onClick={onPrint}>
              <IconPrinter size={18} />
            </ActionIcon>
          </Tooltip>
        </Group>

        <Text size='xs' c='dimmed' ta='center' mt='sm'>
          Generate reports in multiple formats. Share with stakeholders securely.
        </Text>
      </Stack>
    </Paper>
  );
}
