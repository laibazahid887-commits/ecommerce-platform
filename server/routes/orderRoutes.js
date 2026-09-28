const express = require("express");
const pool = require("../config/db");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  addOrderItemSchema,
  updateOrderStatusSchema,
} = require("../validation/orderValidation");
const { successResponse, errorResponse } = require("../utils/response");
const router = express.Router();
router.get("/", protect, authorize("admin"), async (req, res) => {
  try {
    const result = await pool.query(
      ` SELECT orders.id, orders.user_id, users.name AS customer_name, users.email AS customer_email, orders.total_amount, orders.status, orders.created_at FROM orders JOIN users ON orders.user_id = users.id ORDER BY orders.id DESC `,
    );
    return successResponse(
      res,
      200,
      "Orders fetched successfully",
      result.rows,
    );
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Failed to fetch orders");
  }
});
router.get("/my-orders", protect, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, total_amount, status, created_at FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
      [req.user.id],
    );
    return successResponse(
      res,
      200,
      "Your orders fetched successfully",
      result.rows,
    );
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Failed to fetch your orders");
  }
});
router.post("/", protect, async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return errorResponse(res, 400, "Order must contain at least one item");
    }
    let totalAmount = 0;
    for (const item of items) {
      const { error, value } = addOrderItemSchema.validate(item);
      if (error) {
        return errorResponse(res, 400, error.details[0].message);
      }
      const { product_id, quantity } = value;
      const productResult = await pool.query(
        `SELECT id, price, stock FROM products WHERE id = $1`,
        [product_id],
      );
      if (productResult.rows.length === 0) {
        return errorResponse(res, 404, `Product ${product_id} not found`);
      }
      const product = productResult.rows[0];
      if (product.stock < quantity) {
        return errorResponse(
          res,
          400,
          `Not enough stock for product ${product_id}`,
        );
      }
      totalAmount += Number(product.price) * quantity;
    }
    const result = await pool.query(
      `INSERT INTO orders (user_id, total_amount, status) VALUES ($1, $2, $3) RETURNING *`,
      [req.user.id, totalAmount, "pending"],
    );
    return successResponse(
      res,
      201,
      "Order created successfully",
      result.rows[0],
    );
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Failed to create order");
  }
});
router.post("/:orderId/items", protect, async (req, res) => {
  const client = await pool.connect();
  try {
    const { orderId } = req.params;
    const { error, value } = addOrderItemSchema.validate(req.body);
    if (error) {
      return errorResponse(res, 400, error.details[0].message);
    }
    const { product_id, quantity } = value;
    await client.query("BEGIN");
    const orderResult = await client.query(
      `SELECT * FROM orders WHERE id = $1 AND user_id = $2 AND status = 'pending'`,
      [orderId, req.user.id],
    );
    if (orderResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return errorResponse(res, 404, "Order not found or cannot be modified");
    }
    const productResult = await client.query(
      `SELECT * FROM products WHERE id = $1 FOR UPDATE`,
      [product_id],
    );
    if (productResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return errorResponse(res, 404, "Product not found");
    }
    const product = productResult.rows[0];
    if (product.stock < quantity) {
      await client.query("ROLLBACK");
      return errorResponse(res, 400, "Not enough stock");
    }
    const orderItemResult = await client.query(
      `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4) RETURNING *`,
      [orderId, product_id, quantity, product.price],
    );
    const updatedProduct = await client.query(
      `UPDATE products SET stock = stock - $1 WHERE id = $2 RETURNING *`,
      [quantity, product_id],
    );
    const totalResult = await client.query(
      `SELECT COALESCE( SUM(quantity * price), 0 ) AS total FROM order_items WHERE order_id = $1`,
      [orderId],
    );
    const total = totalResult.rows[0].total;
    const updatedOrder = await client.query(
      `UPDATE orders SET total_amount = $1 WHERE id = $2 RETURNING *`,
      [total, orderId],
    );
    await client.query("COMMIT");
    return successResponse(res, 201, "Product added to order successfully", {
      order_item: orderItemResult.rows[0],
      remaining_stock: updatedProduct.rows[0].stock,
      order_total: updatedOrder.rows[0].total_amount,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return errorResponse(res, 500, "Failed to add product to order");
  } finally {
    client.release();
  }
});
router.delete("/:orderId/items/:itemId", protect, async (req, res) => {
  const client = await pool.connect();
  try {
    const { orderId, itemId } = req.params;
    await client.query("BEGIN");
    const itemResult = await client.query(
      `SELECT order_items.* FROM order_items JOIN orders ON order_items.order_id = orders.id WHERE order_items.id = $1 AND order_items.order_id = $2 AND orders.user_id = $3 AND orders.status = 'pending'`,
      [itemId, orderId, req.user.id],
    );
    if (itemResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return errorResponse(
        res,
        404,
        "Order item not found or cannot be modified",
      );
    }
    const item = itemResult.rows[0];
    if (item.product_id) {
      await client.query(
        `UPDATE products SET stock = stock + $1 WHERE id = $2`,
        [item.quantity, item.product_id],
      );
    }
    await client.query(`DELETE FROM order_items WHERE id = $1`, [itemId]);
    const totalResult = await client.query(
      `SELECT COALESCE( SUM(quantity * price), 0 ) AS total FROM order_items WHERE order_id = $1`,
      [orderId],
    );
    const total = totalResult.rows[0].total;
    const updatedOrder = await client.query(
      `UPDATE orders SET total_amount = $1 WHERE id = $2 RETURNING *`,
      [total, orderId],
    );
    await client.query("COMMIT");
    return successResponse(
      res,
      200,
      "Product removed from order successfully",
      {
        returned_quantity: item.quantity,
        order_total: updatedOrder.rows[0].total_amount,
      },
    );
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return errorResponse(res, 500, "Failed to remove product from order");
  } finally {
    client.release();
  }
});
router.get("/:orderId/items", protect, async (req, res) => {
  try {
    const { orderId } = req.params;
    const result = await pool.query(
      `SELECT order_items.id AS item_id, order_items.order_id, order_items.product_id, products.name AS product_name, order_items.quantity, order_items.price, (order_items.quantity * order_items.price) AS subtotal FROM order_items JOIN orders ON order_items.order_id = orders.id LEFT JOIN products ON order_items.product_id = products.id WHERE order_items.order_id = $1 AND orders.user_id = $2 ORDER BY order_items.id ASC`,
      [orderId, req.user.id],
    );
    if (result.rows.length === 0) {
      return errorResponse(res, 404, "No items found for this order");
    }
    return successResponse(
      res,
      200,
      "Order items fetched successfully",
      result.rows,
    );
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Failed to fetch order items");
  }
});
router.get("/:orderId", protect, async (req, res) => {
  try {
    const { orderId } = req.params;
    const result = await pool.query(
      `SELECT orders.id AS order_id, orders.user_id, orders.full_name, orders.email, orders.phone, orders.address, orders.city, orders.postal_code, orders.payment_method, orders.total_amount, orders.status, orders.created_at, products.id AS product_id, products.name AS product_name, order_items.id AS order_item_id, order_items.quantity, order_items.price FROM orders LEFT JOIN order_items ON orders.id = order_items.order_id LEFT JOIN products ON order_items.product_id = products.id WHERE orders.id = $1 AND orders.user_id = $2`,
      [orderId, req.user.id],
    );
    if (result.rows.length === 0) {
      return errorResponse(res, 404, "Order not found");
    }
    const orderData = {
      order: {
        id: result.rows[0].order_id,
        user_id: result.rows[0].user_id,
        full_name: result.rows[0].full_name,
        email: result.rows[0].email,
        phone: result.rows[0].phone,
        address: result.rows[0].address,
        city: result.rows[0].city,
        postal_code: result.rows[0].postal_code,
        payment_method: result.rows[0].payment_method,
        total_amount: result.rows[0].total_amount,
        status: result.rows[0].status,
        created_at: result.rows[0].created_at,
      },
      items: result.rows
        .filter((item) => item.product_id !== null)
        .map((item) => ({
          id: item.order_item_id,
          product_id: item.product_id,
          product_name: item.product_name,
          quantity: item.quantity,
          price: item.price,
        })),
    };
    return successResponse(res, 200, "Order fetched successfully", orderData);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Failed to fetch order");
  }
});
router.put("/:orderId/cancel", protect, async (req, res) => {
  const client = await pool.connect();
  try {
    const { orderId } = req.params;
    await client.query("BEGIN");
    const orderResult = await client.query(
      `SELECT * FROM orders WHERE id = $1 AND user_id = $2 AND status = 'pending'`,
      [orderId, req.user.id],
    );
    if (orderResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return errorResponse(res, 404, "Order not found or cannot be cancelled");
    }
    const itemsResult = await client.query(
      `SELECT product_id, quantity FROM order_items WHERE order_id = $1 FOR UPDATE`,
      [orderId],
    );
    for (const item of itemsResult.rows) {
      if (item.product_id) {
        await client.query(
          `UPDATE products SET stock = stock + $1 WHERE id = $2`,
          [item.quantity, item.product_id],
        );
      }
    }
    const result = await client.query(
      `UPDATE orders SET status = 'cancelled' WHERE id = $1 RETURNING *`,
      [orderId],
    );
    await client.query("COMMIT");
    return successResponse(
      res,
      200,
      "Order cancelled successfully",
      result.rows[0],
    );
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return errorResponse(res, 500, "Failed to cancel order");
  } finally {
    client.release();
  }
});
router.put(
  "/:orderId/status",
  protect,
  authorize("admin"),
  async (req, res) => {
    try {
      const { orderId } = req.params;
      const { error, value } = updateOrderStatusSchema.validate(req.body);
      if (error) {
        return errorResponse(res, 400, error.details[0].message);
      }
      const { status } = value;
      const orderResult = await pool.query(
        `SELECT * FROM orders WHERE id = $1`,
        [orderId],
      );
      if (orderResult.rows.length === 0) {
        return errorResponse(res, 404, "Order not found");
      }
      const order = orderResult.rows[0];
      const allowedTransitions = {
        pending: ["processing", "cancelled"],
        processing: ["shipped", "cancelled"],
        shipped: ["delivered"],
        delivered: [],
        cancelled: [],
      };
      const currentStatus = order.status;
      if (currentStatus === status) {
        return errorResponse(res, 400, `Order is already ${currentStatus}`);
      }
      if (!allowedTransitions[currentStatus].includes(status)) {
        return errorResponse(
          res,
          400,
          `Cannot change order status from ${currentStatus} to ${status}`,
        );
      }
      const result = await pool.query(
        `UPDATE orders SET status = $1 WHERE id = $2 RETURNING *`,
        [status, orderId],
      );
      return successResponse(
        res,
        200,
        "Order status updated successfully",
        result.rows[0],
      );
    } catch (error) {
      console.error(error);
      return errorResponse(res, 500, "Failed to update order status");
    }
  },
);

router.delete("/:orderId", protect, authorize("admin"), async (req, res) => {
  try {
    const { orderId } = req.params;
    const orderResult = await pool.query(
      `SELECT id, status FROM orders WHERE id = $1`,
      [orderId],
    );
    if (orderResult.rows.length === 0) {
      return errorResponse(res, 404, "Order not found");
    }
    if (orderResult.rows[0].status !== "cancelled") {
      return errorResponse(res, 400, "Only cancelled orders can be deleted");
    }
    const result = await pool.query(
      `DELETE FROM orders WHERE id = $1 RETURNING id`,
      [orderId],
    );
    return successResponse(
      res,
      200,
      "Cancelled order deleted successfully",
      result.rows[0],
    );
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Failed to delete order");
  }
});
module.exports = router;
