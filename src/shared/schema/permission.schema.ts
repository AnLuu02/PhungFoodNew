import z from 'zod';

export const basePermissionSchema = z
  .object({
    id: z.string().optional(),
    name: z.string({ required_error: 'Tên quyền là bắt buộc' }).min(1, 'Tên quyền là bắt buộc'),
    viName: z.string({ required_error: 'Tên phiên âm là bắt buộc' }).min(1, 'Tên phiên âm là bắt buộc'),
    description: z.string().optional()
  })
  .transform(data => ({
    ...data,
    name: data.name.replace(/\s+/g, '')
  }));

export type PermissionInput = z.infer<typeof basePermissionSchema>;
