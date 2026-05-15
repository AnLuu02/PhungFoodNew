export type FilterPermission =
  | 'view'
  | 'update'
  | 'delete'
  | 'create'
  | 'hasNotPermission'
  | 'hasPermission'
  | undefined;

export type SelectedPermissions = {
  id: string;
  name: string;
  description: string | null;
};
