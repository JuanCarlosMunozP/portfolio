import { timingSafeEqual } from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.ts";

function safeEquals(a: string, b: string): boolean {
    const bufferA = Buffer.from(a);
    const bufferB = Buffer.from(b);
    if (bufferA.length !== bufferB.length) {
        return false;
    }
    return timingSafeEqual(bufferA, bufferB);
}

/**
 * Guards admin-only routes. Expects `Authorization: Bearer <ADMIN_TOKEN>`.
 * Compares the token in constant time to avoid leaking it via timing.
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
    const header = req.get("authorization");

    if (!header?.startsWith("Bearer ") || !safeEquals(header.slice(7), env.adminToken)) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
    }

    next();
}
