import express from "express"
import {getProducts, getSingleProduct, createProuduct, updateProuduct, deleteProduct   } from "../controllers/productController.js"
const router = express.Router()

router.get("/", getProducts)
router.get("/:id", getSingleProduct)
router.post("/", createProuduct ) 
router.put("/:id", updateProuduct ) 
router.delete("/:id", deleteProduct ) 


export default router