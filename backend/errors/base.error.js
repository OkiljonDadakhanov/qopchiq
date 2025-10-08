export default class BaseError extends Error {
	constructor(message, status = 500, details = undefined) {
		super(message);
		this.name = this.constructor.name;
		this.status = status;
		this.details = details;
		Error.captureStackTrace?.(this, this.constructor);
	}

	static BadRequestError(message = "Bad Request", details = undefined) {
		return new BaseError(message, 400, details);
	}

	static UnauthorizedError(message = "Unauthorized", details = undefined) {
		return new BaseError(message, 401, details);
	}

	static ForbiddenError(message = "Forbidden", details = undefined) {
		return new BaseError(message, 403, details);
	}

	static NotFoundError(message = "Not Found", details = undefined) {
		return new BaseError(message, 404, details);
	}
}


