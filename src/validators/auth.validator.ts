import z from "zod";

export const loginValidatorSchema = z.object({
  // body
  body: z.object({
    email: z.email("invalid email"),
    password: z.string("password is required"),
  }),
  // params
  // query
});

//* register
export const registerValidatorSchema = z.object({
  // body
  body: z.object({
    email: z.email("invalid email"),
    password: z
      .string("password is required")
      .regex(/[A-Z]/, "password must contain at least one uppercase")
      .regex(/[a-z]/, "password must contain at least one lowercase"),
  }),
  // params
  // query
});

//* change password