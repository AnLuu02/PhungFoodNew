import { Button, ElementProps, type ButtonProps } from '@mantine/core';
import React from 'react';

export interface IBButton extends ButtonProps, ElementProps<'button', keyof ButtonProps> {
  active?: boolean;
}

const BButton: React.FC<IBButton> = ({
  children = 'Mua hàng',
  radius = 'xl',
  type = 'button',
  size = 'xs',
  fullWidth = false,
  variant = 'filled',
  disabled,
  loading,
  active,
  onClick,
  className,
  ...rest
}) => {
  return (
    <Button
      radius={radius}
      size={size}
      type={type}
      fullWidth={fullWidth}
      variant={variant}
      disabled={disabled}
      loading={loading}
      onClick={onClick}
      className={`relative transition-all duration-200 ease-in-out ${
        variant === 'outline' && !disabled && !loading
          ? 'border-mainColor text-mainColor hover:border-mainColor hover:bg-mainColor hover:text-white'
          : variant === 'filled' && !disabled && !loading
            ? 'bg-mainColor text-white hover:bg-subColor hover:text-black'
            : ''
      } ${active ? 'bg-mainColor text-white' : ''} ${className || ''}`}
      {...rest}
    >
      {children}
    </Button>
  );
};

export default BButton;
