import { Button } from '@mantine/core';
import clsx from 'clsx';

export type IBButton = {
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
          ? 'border-mainColor text-mainColor hover:border-mainColor hover:bg-mainColor hover:text-white'
          : disabled || loading
            ? ''
            : 'bg-mainColor text-white hover:bg-subColor hover:text-black',
        active && 'bg-mainColor text-white'
      )}
    >
      {title}
    </Button>
  );
};
export default BButton;
