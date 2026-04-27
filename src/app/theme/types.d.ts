import { ButtonVariant, DefaultMantineColor, MantineColorsTuple } from '@mantine/core';

declare module '@mantine/core' {
  export interface MantineThemeColorsOverride {
    colors: {
      primary: MantineColorsTuple;
      secondary: MantineColorsTuple;
    } & Record<DefaultMantineColor, MantineColorsTuple>;
  }

  export interface ButtonProps {
    active?: boolean;
    variant?: 'danger' | ButtonVariant;
  }
}
