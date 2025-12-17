import "dotenv/config";
import bcrypt from "bcrypt";
import pool from "./db.js";

const seedAdminUser = async () => {
  try {
    // Check if admin user already exists
    const [existingUsers] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      ["admin@example.com"]
    );

    if (existingUsers.length > 0) {
      console.log("Admin user already exists");
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash("Admin@123", 10);
    console.log(hashedPassword);
    

    // Insert admin user
    await pool.query("INSERT INTO users (email, password) VALUES (?, ?)", [
      "admin@example.com",
      hashedPassword,
    ]);

    console.log("Admin user seeded successfully");
    console.log("Email: admin@example.com");
    console.log("Password: Admin@123");
  } catch (error) {
    console.error("Error seeding admin user:", error);
    throw error;
  } finally {
    await pool.end();
  }
};

// Run the seed function
seedAdminUser()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });
