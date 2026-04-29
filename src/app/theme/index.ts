'use client';

import { Badge, Button, createTheme, MantineColorsTuple } from '@mantine/core';

//Default
const defaultRadius = 'lg';

const primaryColor: MantineColorsTuple = [
  '#ebfbee',
  '#d3f9d8',
  '#a2f1af',
  '#6ee787',
  '#008b4b',
  '#008b4b', //5
  '#007b42',
  '#006b3a',
  '#005b31',
  '#004b28'
];

const secondaryColor: MantineColorsTuple = [
  '#fff9db',
  '#fff3bf',
  '#ffec99',
  '#ffe066',
  '#ffd43b',
  '#f8c144',
  '#f8c144', //6
  '#f59f00',
  '#f08c00',
  '#e67700'
];

export const mainTheme = createTheme({
  colors: {
    primary: primaryColor,
    secondary: secondaryColor
  },
  primaryColor: 'primary',
  defaultRadius,
  components: {
    Button: Button.extend({
      defaultProps: {
        children: 'Mua ngay',
        variant: 'filled',
        loaderProps: {
          type: 'dots'
        }
      },
      vars: (theme, props) => {
        switch (props.variant) {
          case 'danger':
            return {
              root: {
                '--button-bg': theme.colors.red[7],
                '--button-color': theme.white,
                '--button-hover': theme.colors.red[6]
              }
            };
          case 'outline':
            return {
              root: {
                '--button-hover': theme.colors.primary['5'],
                '--button-hover-color': 'white',
                '--button-color': props.active ? 'white' : undefined,
                '--button-bg': props.active ? theme.colors.primary['5'] : undefined
              }
            };
          case 'light':
            return {
              root: {
                '--button-hover': theme.colors.primary['5'],
                '--button-hover-color': 'white',
                '--button-color': props.active ? 'white' : undefined,
                '--button-bg': props.active ? theme.colors.primary['5'] : undefined
              }
            };
          case 'transparent':
            return {
              root: {
                '--button-hover-color': theme.colors.secondary['6'],
                '--button-color': props.active ? theme.colors.secondary['6'] : theme.colors.primary['5']
              }
            };
          case 'filled':
            return {
              root: {
                '--button-bg': theme.colors.primary['5'],
                '--button-hover': props.active ? theme.colors.primary['5'] : theme.colors.secondary['6'],
                '--button-hover-color': props.active ? undefined : 'black'
              }
            };
          default:
            return {
              root: {}
            };
        }
      },
      classNames(theme, props, ctx) {
        const base = 'relative transition-all duration-200 ease-in-out ';
        return {
          root: `${base} ${props.active || props.disabled || props.loading ? '' : 'hover:scale-105'}`
        };
      }
    }),
    Badge: Badge.extend({
      defaultProps: {
        radius: defaultRadius
      }
    })
  }
});
