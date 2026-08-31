import z from 'zod';

export const baseRoleSchema = z.object({
  id: z.string().optional(),
  name: z.string({ required_error: 'Tên vai trò là bắt buộc' }).min(1, 'Tên vai trò là bắt buộc'),
  default: z.boolean().default(false),
  viName: z.string({ required_error: 'Tên phiên âm vai trò là bắt buộc' }).min(1, 'Tên phiên âm vai trò là bắt buộc'),
  permissionPayload: z
    .array(
      z.object({
        id: z.string(),
        type: z.enum(['deleted', 'added', 'default'])
      })
    )
    .default([])
});

export type RoleInput = z.infer<typeof baseRoleSchema>;
