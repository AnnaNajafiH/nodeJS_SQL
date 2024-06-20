import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sql from "./db.js";
import usersRoute from "./routes/users/usersRoute.js";
import ordersRoute from "./routes/orders/ordersRoute.js";


const app = express();
dotenv.config();
app.use(cors({ origin: "*" }));
app.use(express.json());

// GET route for fetching all users
app.use("/api/v1/users", usersRoute);

// GET route for fetching all orders
app.use("/api/v1/orders", ordersRoute);

// //get rout for reading one user:
app.get("/api/v1/users/:user_id", usersRoute);

// //get rout for reading one order:
app.get("/api/v1/orders/:order_id", async (req, res) => {
  const { order_id } = req.params;
  try {
    const order = await sql`SELECT * FROM orders WHERE id = ${order_id}`;
    if (order.length === 0) {
      return res.status(404).json({ error: "order not found" });
    }
    res.status(200).json(order[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a user
app.post("/api/v1/users", usersRoute);

// Create an order
app.post("/api/v1/orders", async (req, res) => {
  const { user_id, price } = req.body;
  if (!user_id || !price) {
    return res.status(400).json({ error: "User ID and price are required" });
  }
  const date = new Date().toISOString();
  try {
    const result = await sql`INSERT INTO orders (user_id, price, date)
    VALUES (${user_id}, ${price}, ${date}) RETURNING *`;
    res.status(201).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//delete a user
app.delete("/api/v1/users/:user_id", async (req, res) => {
  const { user_id } = req.params;
  if (!user_id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const result =
      await sql`DELETE FROM users WHERE id = ${user_id} RETURNING *`;
    if (result.count === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res
      .status(200)
      .json({ message: "User deleted successfully", user: result[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//delete an order
app.delete("/api/v1/orders/:order_id", async (req, res) => {
  const { order_id } = req.params;
  if (!order_id) {
    return res.status(400).json({ error: "order ID is required" });
  }

  try {
    const result =
      await sql`DELETE FROM orders WHERE id = ${order_id} RETURNING *`;
    if (result.count === 0) {
      return res.status(404).json({ error: "order not found" });
    }
    res
      .status(200)
      .json({ message: "order deleted successfully", order: result[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT route for updating a user
app.put("/api/v1/users/:user_id", async (req, res) => {
  const { user_id } = req.params;
  const { first_name, last_name, age } = req.body;

  if (!first_name || !last_name || !age) {
    return res
      .status(400)
      .json({ error: "First name, last name, and age are required" });
  }

  try {
    const result = await sql`UPDATE users 
    SET first_name=${first_name}, last_name=${last_name}, age=${age}
    WHERE id=${user_id}
    RETURNING *`;
    if (result.count === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res
      .status(200)
      .json({ message: "User updated successfully", user: result[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//put route for updating an order:
app.put(`/api/v1/orders/:order_id`, async (req, res) => {
  const { order_id } = req.params;
  const { user_id, price } = req.body;

  const date = new Date().toISOString();
  if (!user_id || !price) {
    return res
      .status(400)
      .json({ error: `user id ,price and date are required` });
  }
  try {
    const result = await sql`UPDATE orders
    SET user_id=${user_id}, price=${price}, date=${date}
    WHERE id=${order_id}
    RETURNING *`;
    if (result.count === 0) {
      return res.status(404).json({ error: "order not found" });
    }
    res
      .status(200)
      .json({ message: "order updated successfully", order: result[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


