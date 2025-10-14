import mongoose from "mongoose";

const cached = globalThis.mongooseConnection ?? {
        conn: null,
        promise: null,
};

export const connectDB = async () => {
        if (cached.conn) {
                return cached.conn;
        }

        if (!process.env.MONGO_URI) {
                throw new Error("MONGO_URI environment variable is not defined");
        }

        if (!cached.promise) {
                cached.promise = mongoose.connect(process.env.MONGO_URI, {
                        bufferCommands: false,
                });
        }

        try {
                cached.conn = await cached.promise;
                console.log(`MongoDB Connected: ${cached.conn.connection.host}`);
                globalThis.mongooseConnection = cached;
                return cached.conn;
        } catch (error) {
                cached.promise = null;
                console.error("Error connecting to MongoDB:", error.message);
                throw error;
        }
};
