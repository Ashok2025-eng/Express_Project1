import z from "zod";

export const getBrandByIdValidator = z.object({
  body: z.object({}).default({}), // No body data allowed for a GET request
  params: z.object({
    id: z.string({ message: "Brand ID is required in URL" }).min(1),
  }),
  query: z.object().default({}),
});

export const createBrandValidator = z.object({
  name: z.object({
    name: z.string().min(3, "atleast 3 character required").trim,
    description: z.string().min(10, "atleast 10 characters required"),
  }),
  params: z.object().default({}),
  query: z.object().default({}),
});

export const updateBrandValidator = z.object({
  body: z.object({
    name: z.string().min(3, "atleast 3 characters required").trim().optional(),
    description: z
      .string()
      .min(10, "atleast 10 characters required")
      .optional(),
  }),
  params: z.object({
    id: z.string({ message: "Brand ID is required in URL" }),
  }),
  query: z.object().default({}),
});

export const deleteBrandValidator = z.object({
  body: z.object({}).default({}), //no data is needed to delete
  params: z.object({
    id: z.string({ message: "Brand ID is required in URl" }).min(1),
  }),
  query: z.object().default({}),
});
