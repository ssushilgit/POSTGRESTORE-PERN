// const express = require("express")
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import productRoutes from "./routes/productRoutes.js";
import { sql } from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 3000;
console.log(PORT);

app.use(express.json());
app.use(cors());
app.use(helmet()); // helmet is a security middleware that helps you protect your app by setting various HTTP headers
app.use(morgan("dev")); // log the requests -> GET / 304 5.001 ms - -

app.use("/api/products", productRoutes);

async function initDB() {
  try {
    await sql`
        CREATE TABLE IF NOT EXISTS products(
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NUll,
            image VARCHAR(255) NOT NUll,
            price DECIMAL(10, 2) NOT NUll,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
    console.log("Database initialized successfully")
  } catch (error) {
    console.log("Error initDB", error);
  }
}

initDB().then(() => {
  app.listen(PORT, function () {
    console.log("server is running on port " + PORT);
  });
});
