const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map(o => o.trim())
  : [
      "https://qopchiq.vercel.app", // Production frontend
      "http://localhost:3000",      // Development React
      "http://localhost:5173",      // Development Vite
      "http://localhost:8080",      // Development Vue
    ];

export const corsOptions = {
  origin: (origin, callback) => {
    console.log(`🌐 CORS request from origin: ${origin}`);
    console.log(`✅ Allowed origins:`, allowedOrigins);
    console.log(`🔧 CORS_ORIGIN env:`, process.env.CORS_ORIGIN);
    console.log(`🔧 NODE_ENV:`, process.env.NODE_ENV);
    
    // Development yoki Postman kabi no-origin so'rovlar uchun ruxsat
    if (!origin) {
      console.log(`✅ Allowing request (no origin)`);
      return callback(null, true);
    }

    // Development mode'da hamma origin'ga ruxsat berish
    if (process.env.NODE_ENV === "development") {
      console.log(`✅ Allowing request (development mode)`);
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      console.log(`✅ Origin ${origin} is allowed`);
      return callback(null, true);
    }

    console.error(`🚫 CORS blocked for: ${origin}`);
    console.error("✅ Allowed origins:", allowedOrigins);
    return callback(new Error(`Origin ${origin} not allowed by CORS policy`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Origin", "Content-Type", "Accept", "Authorization"],
  exposedHeaders: ["X-Total-Count", "X-Page-Count", "X-Request-ID"],
  maxAge: 86400,
  
};