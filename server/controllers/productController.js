import { v2 as cloudinary } from "cloudinary";
import { pool } from "../configs/db.js";

//Add Product: /api/product/add
export const addProduct = async (req, res) => {
  try {
    let productData = JSON.parse(req.body.productData);
    const images = req.files;
    let imagesURL = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );
    // console.log("imagesURL", imagesURL);
    // console.log(productData);
    const offer_price = productData.offerPrice;

    await pool.query(
      `INSERT INTO product
    (name, description, price, offer_price, image, category, in_stock) 
   VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        productData.name,
        productData.description,
        productData.price,
        offer_price,
        imagesURL,
        productData.category,
        true,
      ]
    );

    res.json({ success: true, message: "Product Added" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//Get Product: /api/product/list
export const productList = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM product`);
    const products = result.rows;

    res.json({ success: true, products });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//Get single product: /api/product/id
export const productById = async (req, res) => {
  try {
    const { id } = req.body;

    const result = await pool.query(`SELECT * FROM product WHERE id = $1`, [
      id,
    ]);
    const product = result.rows[0];

    res.json({ success: true, product });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//Change Product inStock: /api/product/stock
export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;

    await pool.query(`UPDATE product SET in_stock = $1 WHERE id = $2`, [
      inStock,
      id,
    ]);

    res.json({ success: true, message: "Stock Updated" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
