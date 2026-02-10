import z from "zod";

export const SignInSchema = z.object({
  email: z.email({ message: "Invalid email" }).nonempty(),
  password: z
    .string()
    .min(8, { message: "Password should have minimun length of 8" })
    .max(15, { message: "Password is too long" })
    .regex(/^(?=.*[A-Za-z]).{8,}$/, {
      message:
        "Should Contain at least one uppercase letter and have a minimum length of 8 characters.",
    })
    .nonempty(),
});

export type SignInDTO = z.infer<typeof SignInSchema>;
