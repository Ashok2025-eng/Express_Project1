import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const toggleWishlistValidator = z.object({
  body: z.object({
    user: z.string({ message: "user ID is required" }).regex(objectIdRegex, "invalid user ID format"),
    product: z.string({ message: "product ID is required" }).regex(objectIdRegex, "invalid product ID format"),
  }),
});

export const getWishlistValidator = z.object({
  params: z.object({
    userId: z.string().regex(objectIdRegex, "invalid user ID format"),
  }),
});

export const clearWishlistValidator = z.object({
  params: z.object({
    userId: z.string().regex(objectIdRegex, "invalid user ID format"),
  }),
});
