import OrderService from "../services/order.service.js";
import BaseError from "../errors/base.error.js";

export const createOrder = async (req, res, next) => {
  try {
    if (req.userType !== "user") {
      throw BaseError.ForbiddenError("Only users can create orders");
    }

    const body = { ...req.body };
    body.user = req.userId;

    const order = await OrderService.create(body);
    return res.status(201).json({ success: true, order });
  } catch (error) {
    return next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    if (req.userType === "user") {
      const orders = await OrderService.getByUser(req.userId, req.query);
      return res.json({ success: true, orders });
    } else if (req.userType === "business") {
      const orders = await OrderService.getByBusiness(req.userId, req.query);
      return res.json({ success: true, orders });
    } else {
      const orders = await OrderService.getAll(req.query);
      return res.json({ success: true, orders });
    }
  } catch (error) {
    return next(error);
  }
};

export const getOrder = async (req, res, next) => {
  try {
    const order = await OrderService.getById(req.params.id);
    if (!order) throw BaseError.NotFoundError("Order not found");
    return res.json({ success: true, order });
  } catch (error) {
    return next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    if (req.userType !== "business") {
      throw BaseError.ForbiddenError("Only businesses can update order status");
    }

    const { status } = req.body;
    if (!status) throw BaseError.BadRequestError("Status is required");

    const order = await OrderService.updateStatus(req.params.id, status, req.userId);
    return res.json({ success: true, order });
  } catch (error) {
    return next(error);
  }
};

export const getOrderByQrToken = async (req, res, next) => {
  try {
    const { qrToken } = req.params;
    const order = await OrderService.getByQrToken(qrToken);
    if (!order) throw BaseError.NotFoundError("Order not found");
    return res.json({ success: true, order });
  } catch (error) {
    return next(error);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    if (req.userType !== "user") {
      throw BaseError.ForbiddenError("Only users can cancel orders");
    }

    await OrderService.remove(req.params.id, req.userId);
    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
};




