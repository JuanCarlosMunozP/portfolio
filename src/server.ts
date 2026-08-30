import app from "./app.ts";
import { env } from "./config/env.ts";
import { connectDB, disconnectDB } from "./db/db.ts";

async function start(): Promise<void> {
    await connectDB();

    const server = app.listen(env.port, () => {
        console.log(`Server listening on port ${env.port}`);
    });

    server.on("error", (error) => {
        console.error("Server error:", error);
        process.exit(1);
    });

    async function shutdown(signal: string): Promise<void> {
        console.log(`${signal} received, shutting down gracefully...`);
        server.close(async () => {
            await disconnectDB();
            process.exit(0);
        });
        // Force exit if connections do not drain in time.
        setTimeout(() => process.exit(1), 10_000).unref();
    }

    process.on("SIGINT", () => void shutdown("SIGINT"));
    process.on("SIGTERM", () => void shutdown("SIGTERM"));
}

start().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
});
