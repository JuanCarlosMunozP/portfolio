import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "./config/env.ts";
import { apiLimiter } from "./middleware/rateLimit.ts";
import { errorHandler, notFound } from "./middleware/errorHandler.ts";
import contactRoutes from "./routes/contact.routes.ts";

const app = express();

if (env.trustProxy !== false) {
    app.set("trust proxy", env.trustProxy);
}

app.use(helmet());
app.use(cors({ origin: env.corsOrigin }));
app.use(morgan(env.isProduction ? "combined" : "dev"));
app.use(express.json({ limit: "10kb" }));

app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
});

app.use("/api", apiLimiter);
app.use("/api/contact", contactRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
