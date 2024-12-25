import { BadRequestError, sendSuccessResponse, ValidationError } from "../utils/ApiError";
import Cart from "../models/cart";
import CartItem from "../models/cartitems";
import Product from "../models/Products";

let cartController = {
  // Add a product to the cart
  // Add multiple products to the cart
  add: async (req, res, next) => {
    try {
      const products = req.body.products; // Expecting an array of products in the request body
      console.log("Products:", products);

      if (!products || !Array.isArray(products) || products.length === 0) {
        throw new ValidationError("Products array is required and should not be empty.");
      }

      // Validate each product in the array
      for (const productItem of products) {
        const { productId, quantity } = productItem;

        if (!productId || !quantity || quantity <= 0) {
          throw new ValidationError("Each product must have a valid productId and quantity greater than 0.");
        }
      }

      const userId = req.userId; // Protected route, user ID is from req.user

      const [cart] = await Cart.findOrCreate({
        where: { userId },
        defaults: { userId },
      });

      // Process each product
      for (const { productId, quantity } of products) {
        const product = await Product.findByPk(productId);
        if (!product) throw new ValidationError(`Product with ID ${productId} does not exist.`);

        const existingItem = await CartItem.findOne({
          where: { cartId: cart.id, productId },
        });

        if (existingItem) {
          existingItem.quantity += quantity;
          await existingItem.save();
        } else {
          await CartItem.create({ cartId: cart.id, productId, quantity });
        }
      }

      const updatedCart = await cartController.fetchCart(userId);
      sendSuccessResponse(res, updatedCart, "Cart updated successfully");
    } catch (error) {
      next(error);
    }
  },

  // Get the user's cart
  get: async (req, res, next) => {
    try {
      const userId = req.userId; // Protected route, user ID is from req.user

      const cart = await cartController.fetchCart(userId);
      if (!cart) {
        throw new BadRequestError("Cart not found.");
      }

      return res.status(200).json(cart);
    } catch (error) {
      next(error);
    }
  },

  // Update cart items (increment or decrement)
  update: async (req, res, next) => {
    try {
      const { productId, action } = req.body; // action = 'increment' or 'decrement'
      if (!productId || !["increment", "decrement"].includes(action)) {
        throw new ValidationError("Product ID and valid action ('increment' or 'decrement') are required.");
      }

      const userId = req.user.id;

      const cart = await Cart.findOne({ where: { userId } });
      if (!cart) throw new ValidationError("Cart not found.");

      const cartItem = await CartItem.findOne({
        where: { cartId: cart.id, productId },
      });

      if (!cartItem) throw new ValidationError("Product not found in the cart.");

      if (action === "increment") {
        cartItem.quantity += 1;
      } else if (action === "decrement") {
        if (cartItem.quantity > 1) {
          cartItem.quantity -= 1;
        } else {
          await cartItem.destroy(); // Remove the item if the quantity becomes 0
        }
      }
      await cartItem.save();

      const updatedCart = await cartController.fetchCart(userId);
      return res.status(200).json(updatedCart);
    } catch (error) {
      next(error);
    }
  },

  // Utility function to fetch the cart
  fetchCart: async (userId) => {
    return await Cart.findOne({
      where: { userId },
      include: [
        {
          model: CartItem,
          as: "cartItems",
          include: [{ model: Product, as: "product" }],
        },
      ],
    });
  },
  delete: async (req, res, next) => {
    try {
      const { cartItemId } = req.body; // Assuming frontend sends the cartItemId

      if (!cartItemId) throw new ValidationError("Cart item ID is required.");

      const userId = req.userId;

      const cart = await Cart.findOne({ where: { userId } });
      if (!cart) throw new ValidationError("Cart not found.");

      // Find the cart item based on cartItemId
      const cartItem = await CartItem.findOne({
        where: { id: cartItemId, cartId: cart.id },
      });

      if (!cartItem) throw new ValidationError("Cart item not found.");

      await cartItem.destroy();

      const updatedCart = await cartController.fetchCart(userId); // Fetch updated cart
      return res.status(200).json(updatedCart);
    } catch (error) {
      next(error);
    }
  },
};

export default cartController;
