import mongoose from "mongoose";
import { env } from "../config/env.ts";

mongoose.connection.on("connected", () => console.log("MongoDB connected"));
mongoose.connection.on("error", (error) => console.error("MongoDB connection error:", error));
mongoose.connection.on("disconnected", () => console.warn("MongoDB disconnected"));

let connecting: Promise<typeof mongoose> | null = null;

/**
 * Opens the MongoDB connection once and reuses it for the lifetime of the process.
 * Safe to call concurrently: overlapping calls share the same in-flight promise.
 */
export async function connectDB(): Promise<typeof mongoose> {
    if (mongoose.connection.readyState === 1) {
        return mongoose;
    }

    if (!connecting) {
        connecting = mongoose.connect(env.mongodbUri, {
            serverSelectionTimeoutMS: 5000,
        });
    }

    try {
        return await connecting;
    } finally {
        connecting = null;
    }
}

export async function disconnectDB(): Promise<void> {
    await mongoose.disconnect();
}
