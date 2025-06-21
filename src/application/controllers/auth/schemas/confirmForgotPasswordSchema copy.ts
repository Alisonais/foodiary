import z from 'zod';

export const confirmForgotPasswordSchema  = z.object({
  email: z.string().min(1, '"email" is required').email('invalid email'),
  confirmationCode: z.string().min(6, '"confirmationCode" is required'),
  password: z.string().min(8, '"password" Should e at least 8 characters long'),
});

export type confirmForgotPasswordBody = z.infer<typeof confirmForgotPasswordSchema >;
