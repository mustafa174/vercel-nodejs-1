import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Address Sub-schema
const AddressSchema = new Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
});

// Order History Sub-schema
const OrderHistorySchema = new Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  status: { type: String, enum: ["pending", "shipped", "delivered", "cancelled"], default: "pending" },
  orderDate: { type: Date, default: Date.now },
});

// Cart Sub-schema
const CartItemSchema = new Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

// Review Sub-schema
const ReviewSchema = new Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: false },
  date: { type: Date, default: Date.now },
});

// User Schema
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone_number: { type: Number, required: true, unique: true },
  password: { type: String, required: true },
  city: { type: String, required: true, unique: true },
  country: { type: String, required: true, unique: true },
  postal_code: { type: Number, required: true, unique: true },
  address: { type: AddressSchema, required: false },
  //
  role: { type: String, enum: ["customer", "admin"], default: "customer" },

  profileImage: { type: String, default: null }, // URL to the profile image
  orderHistory: [OrderHistorySchema],
  cart: [CartItemSchema],
  reviews: [ReviewSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Middleware to update the 'updatedAt' field on save
UserSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// module.exports = mongoose.model("User", UserSchema);
export default mongoose.model("User", UserSchema);
