import pool from "../config/db.js";
import bcrypt from "bcrypt";

export const findUserByEmail = async (email) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return rows[0] || null;
};

export const findUserById = async (id) => {
  const [rows] = await pool.query(
    "SELECT id, email, created_at, updated_at FROM users WHERE id = ?",
    [id]
  );
  return rows[0] || null;
};

export const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};
