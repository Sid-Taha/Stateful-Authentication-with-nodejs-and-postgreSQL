// db/connection.js

// .env file ko load karne ke liye
require('dotenv').config();

const { drizzle } = require("drizzle-orm/node-postgres");
const { Pool } = require('pg'); // 'pg' library se Pool import karein

// buhut sarre clients ke liye ek naya pool banayein
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // .env file se URL read kar rahe hain
});


// Drizzle ko 'pg' Pool ke saath initialize karein
const db = drizzle(pool);

// 'db' object ko export karein taaki doosri files use kar sakein
module.exports = db;