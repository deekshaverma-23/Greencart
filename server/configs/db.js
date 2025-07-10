import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "greencart_db",
  password: process.env.DB_PASSWORD || "Deeksha21#",
  port: process.env.DB_PORT || 5432,
});

const connectDB = async () => {
  try {
    await pool.query("SELECT NOW()"); // test query
    console.log("Database Connected");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

export { connectDB, pool };
