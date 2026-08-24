
import express from "express";
import { create, getAll, getById, update } from "../controllers/brand.controller";
import { validate } from "../middlewares/validator.middleware";
import { createBrandValidator, deleteBrandValidator, getBrandByIdValidator, updateBrandValidator } from "../validators/brand.validator";
import { remove } from "../controllers/brand.controller";

const router =express.Router()


router.get("/",getAll)


router.get("/:id",validate(getBrandByIdValidator),getById)

router.post("/",validate(createBrandValidator),create)

router.put("/:id",validate(updateBrandValidator),update)

router.delete("/:id",validate(deleteBrandValidator),remove)


export default router;