import arcjet, { tokenBucket, shield, detectBot } from "@arcjet/node";

import "dotenv/config";

// init arcjet

export const aj = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ["ip.src"], // Track requests by IP
  rules: [
    // shield protects your app from common attacks eg. SQL Injection, XDD, CSRF attacks
    shield({ mode: "LIVE" }),

    // detect bot
    detectBot({
      mode: "LIVE",
      // block all bots except search englines
      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),

    // rate limiting
    tokenBucket({
      mode: "LIVE",
      refillRate: 5, // Refill 5 tokens per interval
      interval: 10, // Refill every 10 seconds
      capacity: 10, // Bucket capacity of 10 tokens
    }),
  ],
});
