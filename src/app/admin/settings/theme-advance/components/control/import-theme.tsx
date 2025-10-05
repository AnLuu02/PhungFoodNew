import { Button } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import { useState } from 'react';
import { NotifyError, NotifySuccess } from '~/lib/func-handler/toast';
import { ThemeConfig } from '~/types/theme';

export const ImportTheme = ({
  theme,
  setTheme
}: {
  theme: ThemeConfig;
  setTheme: React.Dispatch<React.SetStateAction<ThemeConfig>>;
}) => {
  const [isImporting, setIsImporting] = useState(false);

  const handleImportTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const importedTheme = JSON.parse(e.target?.result as string);
        setTheme({ ...theme, ...importedTheme });
        NotifySuccess('Theme imported successfully', 'Your theme configuration has been loaded.');
      } catch (error) {
        NotifyError('Import failed', 'Invalid theme file format.');
      } finally {
        setIsImporting(false);
      }
    };
    reader.readAsText(file);
  };
  return (
    <>
      <Button variant='outline' disabled={isImporting} component='label' leftSection={<IconUpload size={16} />}>
        Import
        <input type='file' accept='.json' hidden onChange={e => handleImportTheme(e)} />
      </Button>
    </>
  );
};
