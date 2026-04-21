export const getActionDetails = (log: any) => {
  const { action, metadata } = log;
  const before = metadata?.before;
  const after = metadata?.after;
  const isCreate = !before || Object.keys(before).length === 0;
  const isDelete = !after || Object.keys(after).length === 0;
  const isUpdate = before?.id === after?.id;

  if (action.includes('deleted') || isDelete) {
    return { label: 'đã thực hiện xóa', color: 'red', icon: '🗑️' };
  }
  if (isCreate) {
    return { label: 'đã thực hiện tạo mới', color: 'green', icon: '✨' };
  }
  if (isUpdate) {
    return { label: 'đã thực hiện cập nhật', color: 'blue', icon: '✏️' };
  }
  return { label: 'đã thực hành động trên ', color: 'violet', icon: '⚙️' };
};
