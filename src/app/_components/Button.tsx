import { Button } from '@mantine/core';
import clsx from 'clsx';

type IBButton = {
  title?: String;
  radius?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  w?: any;
  h?: any;
  variant?: 'filled' | 'light' | 'outline' | 'default';
  disabled?: boolean;
  loading?: boolean;
  active?: boolean;
  type?: 'button' | 'submit' | 'reset' | undefined;
  onClick?: () => void;
};
const BButton = ({
  title = 'Mua hàng',
  radius = 'xl',
  type = 'button',
  size = 'xs',
  fullWidth = false,
  w,
  h,
  variant = 'filled',
  disabled,
  loading,
  active,
  onClick
}: IBButton) => {
  return (
    <Button
      radius={radius}
      size={size}
      w={w}
      type={type}
      disabled={disabled}
      loading={loading}
      h={h}
      fullWidth={fullWidth}
      variant={variant}
      onClick={onClick}
      className={clsx(
        'transition-all duration-200 ease-in-out',
        variant === 'outline'
          ? 'border-[#008b4b] text-[#008b4b] hover:border-[#008b4b] hover:bg-[#008b4b] hover:text-white'
          : disabled || loading
            ? ''
            : 'bg-[#008b4b] text-white hover:bg-[#f8c144] hover:text-black',
        active && 'bg-[#008b4b] text-white'
      )}
    >
      {/*
        hover:border-[#f8c144],
        */}
      {title}
    </Button>
  );
};
export default BButton;
