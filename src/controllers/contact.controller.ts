import type { Request, Response } from "express";
import validator from "validator";
import { Contact } from "../models/Contact.ts";
import { sendContactNotification } from "../services/email.service.ts";

const MAX_NAME = 100;
const MAX_MESSAGE = 5000;

function asTrimmedString(value: unknown): string {
    return typeof value === "string" ? value.trim() : "";
}

/**
 * POST /api/contact
 * Public endpoint. Stores the message and (best effort) emails the site owner.
 */
export async function createContact(req: Request, res: Response): Promise<void> {
    const name = asTrimmedString(req.body?.name);
    const surname = asTrimmedString(req.body?.surname);
    const email = asTrimmedString(req.body?.email).toLowerCase();
    const message = asTrimmedString(req.body?.message);

    if (!name || !surname || !email || !message) {
        res.status(400).json({ success: false, error: "All fields are required." });
        return;
    }

    if (!validator.isEmail(email)) {
        res.status(400).json({ success: false, error: "A valid email address is required." });
        return;
    }

    if (name.length > MAX_NAME || surname.length > MAX_NAME || message.length > MAX_MESSAGE) {
        res.status(400).json({ success: false, error: "One or more fields are too long." });
        return;
    }

    try {
        await Contact.create({ name, surname, email, message });
    } catch (error) {
        console.error("Error saving contact message:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
        return;
    }

    // Email delivery must not fail the request: the message is already stored.
    try {
        await sendContactNotification({ name, surname, email, message });
    } catch (error) {
        console.error("Error sending contact notification email:", error);
    }

    res.status(201).json({ success: true, message: "Message sent successfully." });
}

/**
 * GET /api/contact
 * Admin only. Returns stored messages, newest first, paginated.
 */
export async function getContacts(req: Request, res: Response): Promise<void> {
    try {
        const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 200);
        const page = Math.max(Number(req.query.page) || 1, 1);

        const [contacts, total] = await Promise.all([
            Contact.find()
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            Contact.estimatedDocumentCount(),
        ]);

        res.status(200).json({ success: true, page, limit, total, contacts });
    } catch (error) {
        console.error("Error fetching contact messages:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
}
