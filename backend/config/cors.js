const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map(o => o.trim())
  : [];

export const corsOptions = {
  origin: (origin, callback) => {
    // Development yoki Postman kabi no-origin so'rovlar uchun ruxsat
    if (!origin || process.env.NODE_ENV === "development") {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    if (process.env.NODE_ENV !== "production") {
      console.warn(`🚫 CORS blocked for: ${origin}`);
      console.warn("✅ Allowed origins:", allowedOrigins);
    }

    return callback(new Error(`Origin ${origin} not allowed by CORS policy`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Origin", "Content-Type", "Accept", "Authorization"],
  exposedHeaders: ["X-Total-Count", "X-Page-Count", "X-Request-ID"],
  maxAge: 86400,
};