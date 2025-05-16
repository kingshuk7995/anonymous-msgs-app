import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  messages: [messageSchema],
});

export const User = mongoose.model("User", userSchema);

export const connectDB = async (DB_URL) => {
  try {
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};
