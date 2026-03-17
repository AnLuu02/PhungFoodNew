import z from 'zod';

export const baseRoleSchema = z.object({
  id: z.string().optional(),
  name: z.string({ required_error: 'Tên vai trò là bắt buộc' }).min(1, 'Tên vai trò là bắt buộc'),
  viName: z.string({ required_error: 'Tên phiên âm vai trò là bắt buộc' }).min(1, 'Tên phiên âm vai trò là bắt buộc'),
  permissionIds: z.array(z.string()).default([])
});

export type RoleInput = z.infer<typeof baseRoleSchema>;
