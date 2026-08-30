import { z } from "zod";

// Helper regex to validate Mongoose hexadecimal ObjectId structures
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createProductValidator = z.object({
  body: z.object({
    name: z
      .string({ message: "name is required" }) // ✅ Universally supported syntax
      .min(3, "name must be at least 3 characters long"),

    description: z
      .string({ message: "description is required" }) // ✅ Universally supported syntax
      .min(10, "description must be at least 10 characters long"),

    // Price arrives as a form-data string
    price: z.string({ message: "price is required" }),

    // Stock arrives as a form-data string
    stock: z.string({ message: "stock is required" }),

    category: z
      .string({ message: "category ID is required" })
      .regex(objectIdRegex, "invalid category ID format"),

    brand: z
      .string({ message: "brand ID is required" })
      .regex(objectIdRegex, "invalid brand ID format"),

    is_featured: z.string().optional(),
    new_arrival: z.string().optional(),
  }),
});

export const updateProductValidator = z.object({
  body: z.object({
    name: z
      .string()
      .min(3, "name must be at least 3 characters long")
      .optional(),
    description: z
      .string()
      .min(10, "description must be at least 10 characters long")
      .optional(),
    price: z.string().optional(),
    stock: z.string().optional(),
    category: z
      .string()
      .regex(objectIdRegex, "invalid category ID format")
      .optional(),
    brand: z
      .string()
      .regex(objectIdRegex, "invalid brand ID format")
      .optional(),
    is_featured: z.string().optional(),
    new_arrival: z.string().optional(),
  }),
  params: z.object({
    id: z.string().regex(objectIdRegex, "invalid product ID format"),
  }),
});

export const getProductByIdValidator = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, "invalid product ID format"),
  }),
});

export const deleteProductValidator = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, "invalid product ID format"),
  }),
});
