import Order from "../models/order";
import OrderItem from "../models/orderitem";
import User from "../models/User";
import Product from "../models/Products";

import { BadRequestError, UnauthorizedError, ValidationError, sendSuccessResponse } from "../utils/ApiError";

const orderController = {
  // Create a new order
  createOrder: async (req, res, next) => {
    try {
      const { userId, status, totalPrice, orderItems } = req.body;

      // Validation for required fields
      if (!userId || !totalPrice || !orderItems || orderItems.length === 0) {
        return new BadRequestError("Invalid input data");
      }

      // Check if the user exists
      const user = await User.findByPk(userId); // Assuming 'User' is your Sequelize model for users
      if (!user) {
        return new BadRequestError(`User with ID ${userId} does not exist`);
      }

      // Validate productIds in orderItems
      const productIds = orderItems.map((item) => item.productId);
      const existingProducts = await Product.findAll({
        where: { id: productIds },
        attributes: ["id"],
      });
      const existingProductIds = new Set(existingProducts.map((product) => product.id));

      // Check for missing product IDs
      const missingProductIds = productIds.filter((id) => !existingProductIds.has(id));
      if (missingProductIds.length > 0) {
        return new BadRequestError(`The following product IDs do not exist: ${missingProductIds.join(", ")}`);
      }

      // Create the new order
      const order = await Order.create({
        userId,
        status: status || "pending",
        totalPrice,
      });

      // Map order items for creation
      const orderItemsToAdd = orderItems.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      }));

      // Add order items to the database
      await OrderItem.bulkCreate(orderItemsToAdd);
      sendSuccessResponse(res, order, "Order created successfully");
      // Send a response with the newly created order
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  // Get all orders (Admin view)
  getAllOrders: async (req, res, next) => {
    try {
      const orders = await Order.findAll({
        include: [
          {
            model: OrderItem,
            as: "orderItems",
            include: [
              {
                model: Product,
                as: "product",
                attributes: ["id", "name"],
              },
            ],
            attributes: ["productId", "quantity", "price"],
          },
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "email"],
          },
        ],
        attributes: ["id", "status", "totalPrice", "createdAt", "declineReason"],
        order: [["createdAt", "DESC"]],
      });

      sendSuccessResponse(res, orders, "All orders fetched successfully.");
    } catch (error) {
      next(error);
    }
  },

  // Get a specific order by ID
  getOrderById: async (req, res, next) => {
    try {
      const { id } = req.params;

      const order = await Order.findByPk(id, {
        include: [
          {
            model: OrderItem,
            as: "orderItems",
            include: [
              {
                model: Product,
                as: "product",
                attributes: ["id", "name"],
              },
            ],
            attributes: ["productId", "quantity", "price"],
          },
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "email"],
          },
        ],
        attributes: ["id", "status", "totalPrice", "createdAt"],
      });

      if (!order) throw new ValidationError(`Order with ID ${id} not found.`);

      sendSuccessResponse(res, order, "Order fetched successfully.");
    } catch (error) {
      next(error);
    }
  },

  // Update an order
  updateOrder: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status, declineReason, orderItems } = req.body;

      // Step 1: Check if the order exists
      const order = await Order.findByPk(id);
      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }

      // Step 2: Check if the order is associated with the logged-in user (optional)
      // For example, if you're managing users and associating orders to them
      if (order.userId !== req.userId) {
        return res.status(403).json({ success: false, message: "You are not authorized to update this order" });
      }

      // Step 3: Validate status and declineReason if status is "declined"
      if (status === "declined" && !declineReason) {
        return res.status(400).json({ success: false, message: "Decline reason is required when declining an order" });
      }

      // Step 4: Update the order status and declineReason if necessary
      order.status = status || order.status;
      if (status === "declined") {
        order.declineReason = declineReason;
      }
      await order.save();

      // Step 5: Update order items if provided
      if (orderItems && Array.isArray(orderItems)) {
        // Step 5.1: Remove any existing order items that are no longer part of the order
        const existingOrderItems = await OrderItem.findAll({ where: { orderId: order.id } });
        const existingProductIds = existingOrderItems.map((item) => item.productId);

        // Identify items that need to be deleted
        const itemsToDelete = existingOrderItems.filter(
          (item) => !orderItems.some((newItem) => newItem.productId === item.productId)
        );
        await Promise.all(itemsToDelete.map((item) => item.destroy()));

        // Step 5.2: Update or add new items
        const updatedItems = orderItems.map((item) => {
          // If the product exists in the existing order items, update it
          const existingItem = existingOrderItems.find((orderItem) => orderItem.productId === item.productId);
          if (existingItem) {
            existingItem.quantity = item.quantity;
            existingItem.price = item.price;
            return existingItem.save();
          } else {
            // If it's a new item, create it
            return OrderItem.create({
              orderId: order.id,
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            });
          }
        });

        await Promise.all(updatedItems);
      }

      // Step 6: Respond with the updated order
      return res.status(200).json({
        success: true,
        message: "Order updated successfully",
        data: order,
      });
    } catch (error) {
      next(error);
    }
  },

  // Delete an order
  // Delete an order
  deleteOrder: async (req, res, next) => {
    try {
      const { id } = req.params;

      // Find the order by ID
      const order = await Order.findByPk(id);
      if (!order) {
        throw new ValidationError(`Order with ID ${id} not found.`);
      }

      // Optionally, delete related order items if required
      await OrderItem.destroy({ where: { orderId: id } });

      // Now delete the order
      await Order.destroy({ where: { id } });

      // Send the success response
      sendSuccessResponse(res, null, "Order deleted successfully.");
    } catch (error) {
      next(error);
    }
  },
};

export default orderController;
