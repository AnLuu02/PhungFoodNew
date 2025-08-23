import { Prisma } from '@prisma/client';
import { RouterOutputs } from '~/trpc/react';
type RoleWithPermissions = Prisma.RoleGetPayload<{
  include: { permissions: true };
}>;

export type RolePermissionFindOutput = RouterOutputs['RolePermission']['find'];
export type RolePermissionGetAllRoleOutput = RouterOutputs['RolePermission']['getAllRole'];
export type RolePermissionGetOneOutput = RouterOutputs['RolePermission']['getOne'];
export type RolePermissionGetOnePermissionOutput = RouterOutputs['RolePermission']['getOnePermission'];
export type RolePermissionCreateRoleOutput = RouterOutputs['RolePermission']['createRole'];
export type RolePermissioncreateManyRoleOutput = RouterOutputs['RolePermission']['createManyRole'];
export type RolePermissionUpdateRoleOutput = RouterOutputs['RolePermission']['updateRole'];
export type RolePermissionDeleteRoleOutput = RouterOutputs['RolePermission']['deleteRole'];
export type RolePermissionFindPermissionOutput = RouterOutputs['RolePermission']['findPermission'];
export type RolePermissionGetPermissionsOutput = RouterOutputs['RolePermission']['getPermissions'];
export type RolePermissionCreatePermissionOutput = RouterOutputs['RolePermission']['createPermission'];
export type RolePermissionCreateManyPermissionOutput = RouterOutputs['RolePermission']['createManyPermission'];
export type RolePermissionUpdatePermissionOutput = RouterOutputs['RolePermission']['updatePermission'];
export type RolePermissionDeletePermissionOutput = RouterOutputs['RolePermission']['deletePermission'];
export type RolePermissionGetAllPermissionOutput = RouterOutputs['RolePermission']['getAllPermission'];
