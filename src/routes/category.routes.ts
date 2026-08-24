import express from "express";
import { create, getAll, getById, remove, update } from "../controllers/category.controller";
import { createCategoryValidator, deleteCategoryValidator, getCategoryByIdValidator, updateCategoryValidator } from "../validators/category.validator";
import { validate } from "../middlewares/validator.middleware";


const router = express.Router();

//* get all
router.get("/",getAll)


//*getByid
router.get("/:id",validate(getCategoryByIdValidator),getById)


//* create
router.post("/",validate(createCategoryValidator),create)

//* update
router.put("/:id",validate(updateCategoryValidator),update)

//* delete
router.delete("/:id",validate(deleteCategoryValidator),remove)

export default router;
