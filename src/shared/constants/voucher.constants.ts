export const STATUS_VOUCHER = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  EXPIRED: 'expired',
  SCHEDULE: 'schedule'
};

export const STATUS_FILTER_VOUCHER = {
  all: { value: 'all', label: 'Tất cả trạng thái' },
  active: { value: 'active', label: 'Hoạt động' },
  schedule: { value: 'schedule', label: 'Sắp đến' },
  expired: { value: 'expired', label: 'Quá hạn' },
  inactive: { value: 'inactive', label: 'Tạm ẩn' }
};
