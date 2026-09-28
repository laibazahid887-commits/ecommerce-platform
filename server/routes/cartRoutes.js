const express = require("express");
const pool = require("../config/db");
const { protect } = require("../middleware/authMiddleware");
const {
  addCartItemSchema,
  updateCartItemSchema,
} = require("../validation/cartValidation");
const { successResponse, errorResponse } = require("../utils/response");
const router = express.Router();
router.post("/", protect, async (req, res) => {
  try {
    const existingCart = await pool.query(
      `SELECT * FROM cart WHERE user_id = $1`,
      [req.user.id],
    );
    if (existingCart.rows.length > 0) {
      return successResponse(
        res,
        200,
        "Cart already exists",
        existingCart.rows[0],
      );
    }
    const result = await pool.query(
      `INSERT INTO cart (user_id) VALUES ($1) RETURNING *`,
      [req.user.id],
    );
    return successResponse(
      res,
      201,
      "Cart created successfully",
      result.rows[0],
    );
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Failed to create cart");
  }
});
router.post("/items", protect, async (req, res) => {
  const client = await pool.connect();
  try {
    const { error, value } = addCartItemSchema.validate(req.body);
    if (error) {
      return errorResponse(res, 400, error.details[0].message);
    }
    const { product_id, quantity } = value;
    await client.query("BEGIN");
    const cartResult = await client.query(
      `SELECT * FROM cart WHERE user_id = $1`,
      [req.user.id],
    );
    if (cartResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return errorResponse(res, 404, "Cart not found");
    }
    const cart = cartResult.rows[0];
    const productResult = await client.query(
      `SELECT * FROM products WHERE id = $1 FOR UPDATE`,
      [product_id],
    );
    if (productResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return errorResponse(res, 404, "Product not found");
    }
    const product = productResult.rows[0];
    const existingItemResult = await client.query(
      `SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2`,
      [cart.id, product_id],
    );
    let cartItem;
    if (existingItemResult.rows.length > 0) {
      const existingItem = existingItemResult.rows[0];
      const newQuantity = existingItem.quantity + quantity;
      if (product.stock < newQuantity) {
        await client.query("ROLLBACK");
        return errorResponse(res, 400, "Not enough stock");
      }
      const updatedItem = await client.query(
        `UPDATE cart_items SET quantity = $1 WHERE id = $2 RETURNING *`,
        [newQuantity, existingItem.id],
      );
      cartItem = updatedItem.rows[0];
    } else {
      if (product.stock < quantity) {
        await client.query("ROLLBACK");
        return errorResponse(res, 400, "Not enough stock");
      }
      const newItem = await client.query(
        `INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *`,
        [cart.id, product_id, quantity],
      );
      cartItem = newItem.rows[0];
    }
    await client.query("COMMIT");
    return successResponse(res, 201, "Product added to cart successfully", {
      cart_item: cartItem,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return errorResponse(res, 500, "Failed to add product to cart");
  } finally {
    client.release();
  }
});
router.get("/", protect, async (req, res) => {
  try {
    const cartResult = await pool.query(
      `SELECT * FROM cart WHERE user_id = $1`,
      [req.user.id],
    );
    if (cartResult.rows.length === 0) {
      return errorResponse(res, 404, "Cart not found");
    }
    const cart = cartResult.rows[0];
    const itemsResult = await pool.query(
      `SELECT cart_items.id, cart_items.product_id, cart_items.quantity, products.name, products.description, products.price, products.image, products.stock FROM cart_items JOIN products ON cart_items.product_id = products.id WHERE cart_items.cart_id = $1 ORDER BY cart_items.id ASC`,
      [cart.id],
    );
    let totalAmount = 0;
    itemsResult.rows.forEach((item) => {
      totalAmount += Number(item.price) * Number(item.quantity);
    });
    return successResponse(res, 200, "Cart fetched successfully", {
      cart,
      items: itemsResult.rows,
      total_items: itemsResult.rows.length,
      total_amount: totalAmount.toFixed(2),
    });
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Failed to fetch cart");
  }
});
router.put("/items/:itemId", protect, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { error, value } = updateCartItemSchema.validate(req.body);
    if (error) {
      return errorResponse(res, 400, error.details[0].message);
    }
    const { quantity } = value;
    const result = await pool.query(
      `SELECT cart_items.id, cart_items.cart_id, cart_items.product_id, products.name, products.stock FROM cart_items JOIN cart ON cart_items.cart_id = cart.id JOIN products ON cart_items.product_id = products.id WHERE cart_items.id = $1 AND cart.user_id = $2`,
      [itemId, req.user.id],
    );
    if (result.rows.length === 0) {
      return errorResponse(res, 404, "Cart item not found");
    }
    const item = result.rows[0];
    if (quantity > item.stock) {
      return errorResponse(res, 400, "Not enough stock");
    }
    const updatedItem = await pool.query(
      `UPDATE cart_items SET quantity = $1 WHERE id = $2 RETURNING *`,
      [quantity, itemId],
    );
    return successResponse(
      res,
      200,
      "Cart item quantity updated successfully",
      { cart_item: updatedItem.rows[0] },
    );
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Failed to update cart item");
  }
});
router.delete("/items/:itemId", protect, async (req, res) => {
  try {
    const { itemId } = req.params;
    const result = await pool.query(
      `SELECT cart_items.id, cart_items.product_id, cart_items.quantity, products.name FROM cart_items JOIN cart ON cart_items.cart_id = cart.id JOIN products ON cart_items.product_id = products.id WHERE cart_items.id = $1 AND cart.user_id = $2`,
      [itemId, req.user.id],
    );
    if (result.rows.length === 0) {
      return errorResponse(res, 404, "Cart item not found");
    }
    const item = result.rows[0];
    await pool.query(`DELETE FROM cart_items WHERE id = $1`, [itemId]);
    return successResponse(res, 200, "Product removed from cart successfully", {
      removed_item: item,
    });
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Failed to remove product from cart");
  }
});
router.delete("/", protect, async (req, res) => {
  try {
    const cartResult = await pool.query(
      `SELECT id FROM cart WHERE user_id = $1`,
      [req.user.id],
    );
    if (cartResult.rows.length === 0) {
      return errorResponse(res, 404, "Cart not found");
    }
    const cartId = cartResult.rows[0].id;
    const result = await pool.query(
      `DELETE FROM cart_items WHERE cart_id = $1 RETURNING *`,
      [cartId],
    );
    return successResponse(res, 200, "Cart cleared successfully", {
      removed_items: result.rows.length,
    });
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Failed to clear cart");
  }
});
router.post("/checkout", protect, async (req, res) => {
  const client = await pool.connect();
  try {
    const {
      full_name,
      email,
      phone,
      address,
      city,
      postal_code,
      payment_method,
    } = req.body;
    if (
      !full_name ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !postal_code ||
      !payment_method
    ) {
      return errorResponse(res, 400, "All checkout fields are required");
    }
    if (payment_method !== "cash_on_delivery") {
      return errorResponse(res, 400, "Invalid payment method");
    }
    await client.query("BEGIN");
    const cartResult = await client.query(
      `SELECT id FROM cart WHERE user_id = $1`,
      [req.user.id],
    );
    if (cartResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return errorResponse(res, 404, "Cart not found");
    }
    const cartId = cartResult.rows[0].id;
    const itemsResult = await client.query(
      `SELECT cart_items.id, cart_items.product_id, cart_items.quantity, products.name, products.price, products.stock FROM cart_items JOIN products ON cart_items.product_id = products.id WHERE cart_items.cart_id = $1 FOR UPDATE`,
      [cartId],
    );
    if (itemsResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return errorResponse(res, 400, "Cart is empty");
    }
    let totalAmount = 0;
    for (const item of itemsResult.rows) {
      const quantity = Number(item.quantity);
      if (!Number.isInteger(quantity) || quantity <= 0) {
        await client.query("ROLLBACK");
        return errorResponse(res, 400, `Invalid quantity for ${item.name}`);
      }
      if (quantity > Number(item.stock)) {
        await client.query("ROLLBACK");
        return errorResponse(res, 400, `Not enough stock for ${item.name}`);
      }
      totalAmount += Number(item.price) * quantity;
    }
    const orderResult = await client.query(
      `INSERT INTO orders ( user_id, total_amount, status, full_name, email, phone, address, city, postal_code, payment_method ) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10 ) RETURNING *`,
      [
        req.user.id,
        totalAmount,
        "pending",
        full_name.trim(),
        email.trim(),
        phone.trim(),
        address.trim(),
        city.trim(),
        postal_code.trim(),
        payment_method,
      ],
    );
    const order = orderResult.rows[0];
    for (const item of itemsResult.rows) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)`,
        [order.id, item.product_id, item.quantity, item.price],
      );
      await client.query(
        `UPDATE products SET stock = stock - $1 WHERE id = $2`,
        [item.quantity, item.product_id],
      );
    }
    await client.query(`DELETE FROM cart_items WHERE cart_id = $1`, [cartId]);
    await client.query("COMMIT");
    return successResponse(res, 201, "Checkout successful", {
      order: {
        id: order.id,
        user_id: order.user_id,
        total_amount: Number(totalAmount).toFixed(2),
        status: order.status,
        full_name: order.full_name,
        email: order.email,
        phone: order.phone,
        address: order.address,
        city: order.city,
        postal_code: order.postal_code,
        payment_method: order.payment_method,
        created_at: order.created_at,
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return errorResponse(res, 500, "Checkout failed");
  } finally {
    client.release();
  }
});
module.exports = router;
