import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    Image:{
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    deal: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    sizes: {
        type: [String],
        enum: ["100ml","250ml","500ml","1L","5L","10L","100g","250g","500g","1kg","5kg","10kg"],
        required: true,
    },
    review: {
        type: [Object],
        default: [],
    },
    ratings: {
        type: [Object],
        default: [],
    },
    label:{
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }}, {
    collection: 'Produts',
    database: 'Agrikart'
});

const Product = mongoose.model("Products", ProductSchema);

export default Product;
