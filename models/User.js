import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  text: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password_hashed: { type: String, required: true },
  salt: { type: String, required: true },
  messages: [messageSchema]
});

const User = mongoose.model("User", userSchema);

export default User;
