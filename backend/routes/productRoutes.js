import express from "express"
import { createProuduct, getAllProducts } from "../controllers/productController.js"
const router = express.Router()

router.get("/", getAllProducts)
router.post("/", createProuduct ) 

export default router