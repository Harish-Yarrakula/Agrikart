import mongoose from "mongoose"

const OrdersSchema=new mongoose.Schema({
  user: { type: String, required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      image: {type:String,required:true},
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      size: { type: String, required: true },
      price: { type: Number, required: true },
    },
  ],
   currentStatus: {
    type: String,
    enum: ["Order Placed", "Processing", "Shipped", "Out for Delivery", "Delivered"],
    default: "Order Placed",
  },
  trackingHistory: {
    type: Array,
    default: [{ status: "Order Placed", date: Date.now() }],
  },
  totalAmount: { type: String, required: true },
  shippingAddress: { type: String, required: true },
  status: { type: String, enum: ["pending", "shipped", "delivered"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
},{
    database: 'Agrikart'
  });

const Orders=mongoose.model("Orders",OrdersSchema);

export default Orders;