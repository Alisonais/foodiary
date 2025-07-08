import z from 'zod';

export const updateGoalSchema = z.object({
  calories: z.number(),
  carbohydrates: z.number(),
  proteins: z.number(),
  fats: z.number(),
});

export type UpdateGoalBody = z.infer<typeof updateGoalSchema>;
