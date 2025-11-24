import express from "express"
import connectDB from "../db/db.js"
import cors from "cors"
import User from "../models/UserSchema.js";
import Product from "../models/ProductSchema.js";
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser"
import CartProduct from "../models/CartSchema.js";
import Orders from "../models/OrdersSchems.js";


const port=5000;
const app=express();


app.use(cors({
  origin: 'https://eagrikart.vercel.app',  
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.get('/',(req,res)=>{
    res.send(`API is Running`);
});

app.get('/deleteAllProducts', async (req, res) => {
  try {
    await Product.deleteMany({});
    res.status(200).send("All products deleted successfully.");
  } catch (error) {
    console.error("Error deleting products:", error);
    res.status(500).send("Server error while deleting products.");
  }
});



app.post('/verify-otp', async (req, res) => {
  const DEMO_OTP = 123456; 
  try {
    const { mobile, otp } = req.body;
    
    if (String(otp) !== String(DEMO_OTP)) {
      return res.status(400).json({ message: "Invalid OTP. Please try again." });
    }
    console.log(mobile, otp);
    
    const user = await User.findOne({ Mobile: mobile });
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const payload = {
      sub: user._id,
      name: user.username,
    };

    const secret = process.env.JWT_TOKEN || 'dev-secret';
    const token = jwt.sign(payload, secret, { expiresIn: "1d" });

    res.cookie('auth_token', token, { httpOnly: true, secure: false, sameSite: 'lax' });
    res.status(200).json({ user, message: "OTP verified successfully!" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post('/signup', async (req, res) => {
  try {
    const existingUser = await User.findOne({ Mobile: req.body.mobile });
    if (existingUser) {
      return res.status(400).json({ message: "User with this mobile number already exists." });
    }
    
    const user = new User({
      username: req.body.name,
      Mobile: req.body.mobile,
      Address: req.body.Address,
      createdAt: new Date() 
    });

    await user.save();

    const payload = {
      sub: user._id,
      name: user.username
    };

    const secret = process.env.JWT_TOKEN;
    const token = jwt.sign(payload, secret, { expiresIn: "1d" });
    
    res.cookie('auth_token', token, { httpOnly: true, secure: false, sameSite: 'lax' });
    res.status(201).json({ message: "User registered successfully!", user });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error!" });
  }
});

app.get("/products", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);

  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Server error while fetching products.");
  }
});

app.get("/featured",async (req,res)=>{
  try {
    const products = await Product.find({label:"featured"});
    res.json(products);

  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Server error while fetching products.");
  }  
})

app.get("/trending",async (req,res)=>{
  try {
    const products = await Product.find({label:"trending"});
    
    res.json(products);

  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Server error while fetching products.");
  }  
})

app.get("/latest",async (req,res)=>{
  try {
    const products = await Product.find({label:"latest"});
    
    res.json(products);

  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Server error while fetching products.");
  }  
})

app.get("/product/:id", async (req, res) => {
  try {
    // 1. Get the ID from the URL parameters
    const productId = req.params.id;
    console.log(productId)
    const product = await Product.findById(productId);

    // 3. Handle the case where the product is not found
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 4. Send the found product as a JSON response
    res.json(product);

  } catch (error) {
    console.error("Error fetching single product:", error);
    res.status(500).send("Server error while fetching the product.");
  }
});

app.patch("/cartProducts/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const { quantity } = req.body;

    const updatedProduct = await CartProduct.findByIdAndUpdate(
      productId,
      { quantity },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating cart product:", error);
    res.status(500).send("Server error while updating cart product.");
  }
});

app.get("/cartProducts", async (req, res) => {
  try {
    const cartProducts = await CartProduct.find({});
    res.json(cartProducts);
  } catch (error) {
    console.error("Error fetching cart products:", error);
    res.status(500).send("Server error while fetching cart products.");
  }
});

app.delete("/cartProducts/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    const deletedProduct = await CartProduct.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(deletedProduct);
  } catch (error) {
    console.error("Error deleting cart product:", error);
    res.status(500).send("Server error while deleting cart product.");
  }
});

app.post("/cartProducts", async (req, res) => {
  try {
    console.log(req.body);
    const newCartProduct = new CartProduct(req.body);
    await newCartProduct.save();
    res.status(201).json(newCartProduct);
  } catch (error) {
    console.error("Error adding cart product:", error);

    // Check if the error is a Mongoose validation error
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message, details: error.errors });
    }

    // For any other unexpected error, return a generic 500
    res.status(500).send("Server error while adding cart product.");
  }
}); 

app.get("/products/category", async (req, res) => {
  const { category } = req.query;
  try {
    const products = await Product.find({ category }).limit(12);
    res.json(products);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).send("Server error while fetching products.");
  }
});

app.post("/CheckOut", async (req,res)=>{
    try{
      console.log(req.body)
    const Order=new Orders(req.body)
    await Order.save()
    console.log(req.body.user)
    await CartProduct.deleteMany({ userId: (req.body.user).toString()})
    res.status(201).json({ message: "Order placed successfully!", orderId: Order._id });
    }catch{
      res.status(500).json("Server error while placing the order.");
    }
});

// Fetch orders for a user
app.get("/Orders/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    console.log('fetching orders for user', userId);
    const orders = await Orders.find({ user: userId });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error while fetching orders.");
  }
});

// Fetch single order by its id
app.get("/Orders/order/:orderId", async (req, res) => {
  try {
    const order = await Orders.findById(req.params.orderId);
    if (!order) return res.status(404).send('Order not found');
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error while fetching order.");
  }
});

// Backwards-compatible endpoint (optional)
app.get("/OrderDetails/:orderId", async (req, res) => {
  try {
    const order = await Orders.findById(req.params.orderId);
    if (!order) return res.status(404).send('Order not found');
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error while fetching order.");
  }
});

// Start server only after DB connection
const start = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();


