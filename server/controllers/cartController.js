//Update user cart data- /api/ccart/update

export const updateCart = async (req, res) => {
  try {
    const { userId, cartItems } = req.body;
    await pool.query(`UPDATE users SET cart_items = $1 WHERE id = $2`, [
      cartItems,
      userId,
    ]);

    res.json({ success: true, message: "Cart Updated" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
