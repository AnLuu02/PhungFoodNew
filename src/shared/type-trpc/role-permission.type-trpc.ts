import { RouterOutputs } from '~/trpc/react';

export type FindRole = RouterOutputs['RolePermission']['find'];
export type FindPermission = RouterOutputs['RolePermission']['findPermission'];
export type GetAllPermission = RouterOutputs['RolePermission']['getAllPermission'];
export type GetAllRole = RouterOutputs['RolePermission']['getAllRole'];
export type GetOneRole = RouterOutputs['RolePermission']['getOne'];
export type GetOnePermission = RouterOutputs['RolePermission']['getOnePermission'];
