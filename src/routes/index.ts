import express from "express";

import authRoutes from "./auth.routes";
import brandRoutes from "./brand.routes";
import categoryRoutes from "./category.routes";
import productRoutes from "./product.routes";
import wishlistRoutes from "./wishlist.routes";

const router = express.Router();

router.use("/auth", authRoutes); /// done in this file instead of app.ts
router.use("/categories", categoryRoutes); // same here
router.use("/brands", brandRoutes);
router.use("/products", productRoutes);
router.use("/wishlist", wishlistRoutes);

export default router;
