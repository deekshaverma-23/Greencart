//add address: /api/address/add
export const addAddress = async (req, res) => {
  try {
    const { address, userId } = req.body;
    const {
      firstName,
      lastName,
      email,
      street,
      city,
      state,
      zipcode,
      country,
      phone,
    } = address;

    await pool.query(
      `INSERT INTO address 
     (user_id, first_name, last_name, email, street, city, state, zipcode, country, phone)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        userId,
        firstName,
        lastName,
        email,
        street,
        city,
        state,
        zipcode,
        country,
        phone,
      ]
    );

    res.json({ success: true, message: "Address added successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// get address- /api/address/get
export const getAddress = async (req, res) => {
  const { userId } = req.body;
  try {
    const result = await pool.query(
      `SELECT * FROM address WHERE user_id = $1`,
      [userId]
    );
    const addresses = result.rows;
    res.json({ success: true, addresses });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
