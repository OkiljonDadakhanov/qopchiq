export default function errorHandler(err, req, res, next) {
	const status = err.status || 500;
	const message = err.message || "Server error";
	const payload = { success: false, message };
	if (err.details) payload.details = err.details;
	if (process.env.NODE_ENV !== "production") payload.stack = err.stack;
	return res.status(status).json(payload);
}


