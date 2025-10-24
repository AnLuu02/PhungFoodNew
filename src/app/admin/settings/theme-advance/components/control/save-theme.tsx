import { IconDeviceFloppy } from '@tabler/icons-react';
import { useState } from 'react';
import BButton from '~/components/Button/Button';
import { NotifyError, NotifySuccess } from '~/lib/func-handler/toast';
import { ThemeConfig } from '~/types/theme';

export const SaveTheme = ({
  theme,
  setTheme
}: {
  theme: ThemeConfig;
  setTheme: React.Dispatch<React.SetStateAction<ThemeConfig>>;
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      NotifySuccess('Theme saved successfully', 'Your theme changes have been applied.');
    } catch (error) {
      NotifyError('Error saving theme', 'Please try again later.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <BButton onClick={handleSave} leftSection={<IconDeviceFloppy size={16} />} loading={isSaving}>
        Lưu thay đổi
      </BButton>
    </>
  );
};
