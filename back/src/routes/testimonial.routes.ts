import { Router } from "express";
import { createTestimonial, getTestimonials } from "../controllers/testimonial.controller.ts";
import { requireAdmin } from "../middleware/auth.ts";

const router = Router();

router.get("/", getTestimonials);
router.post("/", requireAdmin, createTestimonial);

export default router;
