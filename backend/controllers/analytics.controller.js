import AnalyticsService from "../services/analytics.service.js";
import BaseError from "../errors/base.error.js";

export const getBusinessAnalytics = async (req, res, next) => {
  try {
    if (req.userType !== "business") {
      throw BaseError.ForbiddenError("Only businesses can view analytics");
    }

    const { period = "30d" } = req.query;
    const analytics = await AnalyticsService.getBusinessAnalytics(req.userId, period);
    return res.json({ success: true, analytics });
  } catch (error) {
    return next(error);
  }
};

export const getUserAnalytics = async (req, res, next) => {
  try {
    if (req.userType !== "user") {
      throw BaseError.ForbiddenError("Only users can view analytics");
    }

    const analytics = await AnalyticsService.getUserAnalytics(req.userId);
    return res.json({ success: true, analytics });
  } catch (error) {
    return next(error);
  }
};




