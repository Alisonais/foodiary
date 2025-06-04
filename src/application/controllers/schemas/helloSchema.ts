import z from 'zod';

export const helloSchema = z.object({
  account: z.object({
    name: z.string().min(1, 'name is required'),
    email: z.string().min(1, 'email is required').email('invalid email'),
  }),
});

export type helloBody = z.infer<typeof helloSchema>;
