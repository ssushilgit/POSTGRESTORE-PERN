// const express = require("express")
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import productRoutes from "./routes/productRoutes.js";
import { sql } from "./config/db.js";
import { aj } from "./lib/arcjet.js";

const app = express();
const PORT = process.env.PORT || 3000;
// console.log(PORT);

app.use(express.json());
app.use(cors());
app.use(helmet()); // helmet is a security middleware that helps you protect your app by setting various HTTP headers
app.use(morgan("dev")); // log the requests -> GET / 304 5.001 ms - -

// apply arcjet rate-limit to all routes
app.use(async (req, res, next) =>{
  try {
    const decision = await aj.protect(req, {
      requested : 1
    })

    if(decision.isDenied()){
      if(decision.reason.isRateLimit()){
        res.status(429).json({
          error : "Too many requests"
        })
      } else if(decision.reason.isBot()){
        res.status(403).json({
          error : "No bots allowed"
        })
      } else {
        res.status(403).json({
          message : "Forbidden"
        })
      }
      return
    }

    // check for spoofed bots - bots acts like they are not bots
    if(decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed() )){
      res.status(403).json({
        error :"Spoofed bot detected"
      })
    }

    next()

  } catch (error) {
    console.log("Arcjet error ", error)
    next(error);
  }
})


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
