import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    Mobile: {
        type: Number,
        maxLength: 10,
        minLength: 10,
        required: true,
        unique: true,
    },
    Address:{
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
},{
    database: 'Agrikart'
  });

const User = mongoose.model("User", userSchema);

export default User;
