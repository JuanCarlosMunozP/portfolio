import rateLimit from "express-rate-limit";

/** Broad limit for every /api route. */
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false,
});

/** Strict limit for the public contact form, which triggers an email. */
export const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { success: false, error: "Too many messages sent. Please try again later." },
});
