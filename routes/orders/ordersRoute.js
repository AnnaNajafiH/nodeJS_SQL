import express from "express";
import sql from "../../db.js";

const ordersRoute = express.Router();

ordersRoute.route(`/`).get(async (req, res) => {
  try {
    const orders = await sql`SELECT * FROM orders`;
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default ordersRoute;
