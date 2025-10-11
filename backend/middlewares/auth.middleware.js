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
		return next();
	} catch (error) {
		return next(error);
	}
}

export { authGuard };
export default authGuard;