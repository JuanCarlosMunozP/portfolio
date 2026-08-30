import { Router } from "express";
import { createContact, getContacts } from "../controllers/contact.controller.ts";
import { requireAdmin } from "../middleware/auth.ts";
import { contactLimiter } from "../middleware/rateLimit.ts";

const router = Router();

router.post("/", contactLimiter, createContact);
router.get("/", requireAdmin, getContacts);

export default router;
