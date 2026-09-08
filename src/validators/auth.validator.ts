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
export const changePasswordValidatorSchema = z.object({
  body: z.object({
    old_password: z.string("old password is required"),
    new_password: z
      .string("new password is required")
      .regex(/[A-Z]/, "password must contain at least one uppercase")
      .regex(/[a-z]/, "password must contain at least one lowercase"),
  }),
});

//* forgot password
export const forgotPasswordValidatorSchema = z.object({
  body: z.object({
    email: z.string().email("invalid email"),
  }),
});

//* reset password
export const resetPasswordValidatorSchema = z.object({
  body: z.object({
    password: z
      .string("password is required")
      .regex(/[A-Z]/, "password must contain at least one uppercase")
      .regex(/[a-z]/, "password must contain at least one lowercase"),
    otp: z
      .string("otp is required")
      .length(6, "otp must be exactly 6 characters long"),
  }),
});

//* request change email
export const requestChangeEmailSchema = z.object({
  body: z.object({
    new_email: z.string().email("invalid email format"),
  }),
});

//* confirm change email
export const confirmChangeEmailSchema = z.object({
  body: z.object({
    new_email: z.string().email("invalid email format"),
    otp: z
      .string("otp is required")
      .length(6, "otp must be exactly 6 characters long"),
  }),
});
