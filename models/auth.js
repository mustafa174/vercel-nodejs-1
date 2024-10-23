import mongoose from "mongoose";

const UserTokens = new mongoose.Schema({
  email: { type: String, required: true },
  username: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  token: { type: String }, // Add token field directly in the user model
  token_type: { type: String }, // Add token field directly in the user model
  token_expiration: { type: Date }, // Optionally store token expiration
  role: { type: String, enum: ["customer", "admin"], default: "customer" },
});

export default mongoose.model("UserTokens", UserTokens);
