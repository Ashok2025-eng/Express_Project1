import z from "zod";

export const getUserByIdValidator = z.object({
  body: z.object({}).default({}),
  params: z.object({
    id: z.string({ message: "Category ID  is required in URL" }),
  }),
  query: z.object({}).default({}),
});

export const deactivateUserValidator = z.object({
  body: z.object({}).default({}), 
  params: z.object({ // Added the missing params wrapper here
    id: z.string({ message: "User ID is required in URL" }),
  }),
  query: z.object().default({}),
});