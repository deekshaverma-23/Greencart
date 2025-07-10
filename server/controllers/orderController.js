//place order COD- /api/order/cod
export const placeOrderCOD = async (req, res) => {
  try {
    const { userId, items, address } = req.body;
    if (!address || items.length === 0) {
      return res.json({ success: false, message: "Invalid data" });
    }

    // Calculate amount using items
    let amount = await items.reduce(async (acc, item) => {
      // instead of mongoose:
      const result = await pool.query(
        'SELECT "offerPrice" FROM product WHERE id = $1',
        [item.product]
      );
      const product = result.rows[0];
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);

    // Add Tax Charge (2%)
    amount += Math.floor(amount * 0.02);
    await pool.query(
      `INSERT INTO "order" 
    ("userId", items, amount, address, "paymentType", "isPaid") 
   VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, JSON.stringify(items), amount, address, "COD", false]
    );

    res.json({ success: true, message: "Order Placed Successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//Get orders by user ID:/api/order/user
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.body;

    const result = await pool.query(
      `SELECT * FROM "order"
   WHERE "userId" = $1
     AND ("paymentType" = 'COD' OR "isPaid" = true)
   ORDER BY "createdAt" DESC`,
      [userId]
    );

    const orders = result.rows;

    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//Get all order (for seller/admin): /api/order/seller
export const getAllOrders = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM "order"
   WHERE "paymentType" = 'COD' OR "isPaid" = true
   ORDER BY "createdAt" DESC`
    );

    const orders = result.rows;

    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
