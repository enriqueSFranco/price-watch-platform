import { z } from 'zod';

export const UserSchema = z.object({
  id: z.uuid(),
  email: z.email().nonempty(),
  password: z.string().nonempty(),
});

export type UserType = z.infer<typeof UserSchema>;
