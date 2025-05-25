import { sql } from "../config/db.js";

// fetch products
export const getProducts = async (req, res) => {
  try {
    const products = await sql`
        SELECT * FROM products
        ORDER BY created_at DESC
    `;

    console.log("Fetched products ", products);
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.log("Error in getProducts function : ", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

// create products
export const createProuduct = async (req, res) => {
  const { name, price, image } = req.body;

  if (!name || !price || !image) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const newProduct = await sql`
        INSERT INTO products (name, price, image)
        VALUES(${name}, ${price}, ${image})
        RETURNING *
    `
    res.status(201).json({
        success : true,
        data: newProduct[0]
    })
  } catch (error) {
    console.log("Error in getProducts function : ", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

// fetch single product
export const getSingleProduct = async (req, res) => {
    const {id} = req.params

    try {
        const singleProduct = await sql `
            SELECT * FROM products WHERE id= ${id}
        `
        res.status(200).json({
            success : true,
            data : singleProduct[0]
        })
        
    } catch (error) {
        console.log("Error in getSingleProduct function", error)
        res.status(500).json({
            success : false,
            message : "Internal Server error"
        })
    }
};

// update product
export const updateProuduct = async (req, res) => {
    const {id} = req.params;
    const {name, price, image} = req.body;

    try {
        const updateProduct = await sql `
            UPDATE products
            SET name=${name}, price= ${price}, image=${image}
            WHERE id = ${id}
            RETURNING *
        `

        if(updateProduct === 0){
            return res.status(404).json({
                success: false,
                message : "Product not found"
            })
        }

        res.status(200).json({
            success : true,
            data : updateProduct[0]
        })
        
    } catch (error) {
        console.log("Error in updateProduct function ",errror)
        res.status(500).json({
            success : false,
            message : "Internal Server Error"
        })
        
    }
};

// delete product
export const deleteProduct = async (req, res) => {
    const {id} = req.params;
    try {
        const deletedProduct = await sql`
            DELTE FROM products WHERE id=${id}
            RETURNING *
        `
        if(deletedProduct === 0){
            res.status(404).json({
                success : false,
                message : "Product not found"
            })
        }

        res.status(200).json({
            success : true,
            data : deletedProduct[0]
        })

    } catch (error) {
        console.log("Error in deleteProduct function", error)
        res.status(500).json({
            success : false,
            message : "Error in Interval Server"
        })
    }

};
