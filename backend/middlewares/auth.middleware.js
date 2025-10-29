import TokenService from "../services/token.service.js";
import BaseError from "../errors/base.error.js";

function authGuard(req, res, next) {
        try {
                const authHeader = req.headers.authorization || "";
                const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
                if (!token) throw BaseError.UnauthorizedError("Access token not provided");

                const payload = TokenService.validateAccessToken(token);
                if (!payload) throw BaseError.UnauthorizedError("Invalid access token");

                req.userId = payload.id;
                req.userType = payload.type || payload.userType || "user";
                req.auth = payload;

                return next();
        } catch (error) {
                return next(error);
        }
}

function businessGuard(req, res, next) {
        try {
                if (req.userType !== "business") {
                        throw BaseError.ForbiddenError("Business access required");
                }
                return next();
        } catch (error) {
                return next(error);
        }
}

export { authGuard, businessGuard };
export default authGuard;
