import nodemailer, { type Transporter } from "nodemailer";
import validator from "validator";
import { env } from "../config/env.ts";

function createTransporter(): Transporter | null {
    const { host, port, secure, user, pass } = env.smtp;
    if (!host || !user || !pass) {
        console.warn("SMTP is not fully configured; contact notification emails are disabled.");
        return null;
    }
    return nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
    });
}

const transporter = createTransporter();

export interface ContactNotification {
    name: string;
    surname: string;
    email: string;
    message: string;
}

/**
 * Notifies the site owner about a new contact message.
 * The visitor's address is only used as `replyTo`, never as a recipient,
 * so the endpoint cannot be abused to send mail to arbitrary people.
 * Resolves silently when SMTP is not configured.
 */
export async function sendContactNotification(payload: ContactNotification): Promise<void> {
    if (!transporter || !env.contactTo) {
        return;
    }

    const { name, surname, email, message } = payload;
    const fullName = `${name} ${surname}`.trim();

    await transporter.sendMail({
        from: `"Portfolio contact form" <${env.smtp.user}>`,
        to: env.contactTo,
        replyTo: email,
        subject: `New contact message from ${fullName}`,
        text: `From: ${fullName} <${email}>\n\n${message}`,
        html: `<h2>New contact message</h2>
            <p><strong>From:</strong> ${validator.escape(fullName)} &lt;${validator.escape(email)}&gt;</p>
            <blockquote>${validator.escape(message)}</blockquote>`,
    });
}
