import express from "express";
import sql from "../../db.js"; // Import the database connection

const usersRoute = express.Router();


usersRoute
  .route(`/`)
  .get(async (req, res) => {
    try {
      const users = await sql`SELECT * FROM users`;
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  })
  .post(async (req, res) => {
    const { first_name, last_name, age } = req.body;
    if (!first_name || !last_name || !age) {
      return res
        .status(400)
        .json({ error: "First name, last name, and age are required" });
    }

    try {
      const result = await sql`INSERT INTO users (first_name, last_name, age) 
        VALUES (${first_name}, ${last_name}, ${age}) RETURNING *`;
      res.status(201).json(result[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

usersRoute.route(`/:user_id`).get(async (req, res) => {
  const { user_id } = req.params;
  try {
    const user = await sql`SELECT * FROM users WHERE id = ${user_id}`;
    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
export default usersRoute;
