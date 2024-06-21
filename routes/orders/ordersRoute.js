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
ordersRoute.route(`/:order_id`).get(async (req, res) => {
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
})

export default ordersRoute;
