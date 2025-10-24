import { IconRotateClockwise } from '@tabler/icons-react';
import BButton from '~/components/Button/Button';
import { NotifySuccess } from '~/lib/func-handler/toast';
import { ThemeConfig, ThemeTemplate } from '~/types/theme';

export const ResetTheme = ({
  templates,
  setTheme
}: {
  templates: ThemeTemplate[];
  setTheme: React.Dispatch<React.SetStateAction<ThemeConfig>>;
}) => {
  const handleReset = () => {
    setTheme(templates.find(t => t.isDefault)?.theme || templates[0]?.theme!);
    NotifySuccess('Theme reset', 'All theme settings have been reset to defaults.');
  };

  return (
    <>
      <BButton variant='outline' leftSection={<IconRotateClockwise size={16} />} onClick={handleReset}>
        Reset
      </BButton>
    </>
  );
};
