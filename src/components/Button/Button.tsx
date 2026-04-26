import { ActionIcon, ActionIconProps, Button, ElementProps, MantineSize, type ButtonProps } from '@mantine/core';
import React from 'react';

interface SharedProps {
  active?: boolean;
  iconOnly?: boolean;
  size?: MantineSize | (string & {}) | number;
}

export type IBButtonProps =
  | (Omit<ButtonProps, 'size'> & ElementProps<'button', keyof ButtonProps> & SharedProps & { iconOnly?: false })
  | (Omit<ActionIconProps, 'size'> & ElementProps<'button', keyof ActionIconProps> & SharedProps & { iconOnly: true });

const BButton: React.FC<IBButtonProps> = ({
  children = 'Mua hàng',
  radius = 'md',
  size = 'sm',
  type = 'button',
  variant = 'filled',
  disabled,
  loading,
  active,
  onClick,
  className,
  iconOnly = false,
  ...rest
}) => {
  const commonClassNames = `relative transition-all duration-200 ease-in-out hover:scale-105 ${
    variant === 'outline' && !disabled && !loading
      ? 'border-mainColor text-mainColor hover:border-mainColor hover:bg-mainColor hover:text-white'
      : variant === 'filled' && !disabled && !loading
        ? 'bg-mainColor text-white hover:bg-subColor hover:text-black'
        : ''
  } ${active ? 'bg-mainColor text-white' : ''} ${className || ''}`;
  return iconOnly ? (
    <ActionIcon
      radius={radius}
      size={size}
      type={type}
      variant={variant}
      disabled={disabled}
      loading={loading}
      onClick={onClick}
      className={commonClassNames}
      {...(rest as ActionIconProps)}
    >
      {children}
    </ActionIcon>
  ) : (
    <Button
      radius={radius}
      size={size as MantineSize}
      type={type}
      variant={variant}
      disabled={disabled}
      loading={loading}
      onClick={onClick}
      className={commonClassNames}
      {...(rest as ButtonProps)}
    >
      {children}
    </Button>
  );
};

export default BButton;
