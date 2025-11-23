import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  userId: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  size: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
},{
    database: 'Agrikart'
  });

const Cart = mongoose.model("Cart", CartItemSchema);
export default Cart;

