import type { NextFunction, Request, Response } from "express";

/** Catch-all for unmatched routes. */
export function notFound(_req: Request, res: Response): void {
    res.status(404).json({ success: false, error: "Not found" });
}

/** Central error handler. Must keep four parameters for Express to recognise it. */
export function errorHandler(
    error: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction,
): void {
    console.error("Unhandled error:", error);

    if (res.headersSent) {
        return;
    }

    res.status(500).json({ success: false, error: "Internal server error" });
}
