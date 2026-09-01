import z from "zod";

export const getBrandByIdValidator = z.object({
  body: z.object({}).default({}),
  params: z.object({
    id: z.string({ message: "Brand ID is required in URL" }).min(1),
  }),
  query: z.object({}).default({}),
});

export const createBrandValidator = z.object({
  // ✅ FIX 1: Changed key from "name" to "body" to match Express architecture
  body: z.object({
    // ✅ FIX 2: Added parentheses () to invoke .trim() correctly
    name: z.string().min(3, "atleast 3 character required").trim(),
    description: z.string().min(10, "atleast 10 characters required"),
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
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
  query: z.object({}).default({}),
});

export const deleteBrandValidator = z.object({
  body: z.object({}).default({}),
  params: z.object({
    id: z.string({ message: "Brand ID is required in URl" }).min(1),
  }),
  query: z.object({}).default({}),
});
