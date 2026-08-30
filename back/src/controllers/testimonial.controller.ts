import type { Request, Response } from "express";
import { Testimonial } from "../models/Testimonial.ts";

const MAX_FULLNAME = 120;
const MAX_DESCRIPTION = 200;
const MAX_EXPERIENCE = 1000;

function asTrimmedString(value: unknown): string {
    return typeof value === "string" ? value.trim() : "";
}

/**
 * POST /api/testimonials
 * Admin only. Adds a testimonial to be shown on the site.
 */
export async function createTestimonial(req: Request, res: Response): Promise<void> {
    const fullname = asTrimmedString(req.body?.fullname);
    const description = asTrimmedString(req.body?.description);
    const experience = asTrimmedString(req.body?.experience);

    if (!fullname || !description || !experience) {
        res.status(400).json({ success: false, error: "All fields are required." });
        return;
    }

    if (
        fullname.length > MAX_FULLNAME ||
        description.length > MAX_DESCRIPTION ||
        experience.length > MAX_EXPERIENCE
    ) {
        res.status(400).json({ success: false, error: "One or more fields are too long." });
        return;
    }

    try {
        const testimonial = await Testimonial.create({ fullname, description, experience });
        res.status(201).json({ success: true, testimonial });
    } catch (error) {
        console.error("Error creating testimonial:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
}

/**
 * GET /api/testimonials
 * Public. Returns testimonials, newest first.
 */
export async function getTestimonials(_req: Request, res: Response): Promise<void> {
    try {
        const testimonials = await Testimonial.find().sort({ createdAt: -1 }).lean();
        res.status(200).json({ success: true, count: testimonials.length, testimonials });
    } catch (error) {
        console.error("Error fetching testimonials:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
}
