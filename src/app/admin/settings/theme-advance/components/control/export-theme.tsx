import { Button } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import { useState } from 'react';
import { NotifyError, NotifySuccess } from '~/lib/func-handler/toast';
import { ThemeConfig } from '~/types/theme';

export const ExportTheme = ({ theme }: { theme: ThemeConfig }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportTheme = async () => {
    setIsExporting(true);
    try {
      const themeData = JSON.stringify(theme, null, 2);
      const blob = new Blob([themeData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `restaurant-theme-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      NotifySuccess('Theme exported successfully', 'Your theme configuration has been downloaded.');
    } catch (error) {
      NotifyError('Export failed', 'Failed to export theme configuration.');
    } finally {
      setIsExporting(false);
    }
  };
  return (
    <>
      <Button
        variant='outline'
        leftSection={<IconDownload size={16} />}
        loading={isExporting}
        onClick={() => handleExportTheme()}
      >
        Export
      </Button>
    </>
  );
};
