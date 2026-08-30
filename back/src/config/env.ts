/**
 * Centralised, validated access to environment variables.
 * Importing this module throws immediately if a required variable is missing,
 * so the process fails fast with a clear message instead of crashing later.
 */

function required(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

function toNumber(value: string | undefined, fallback: number): number {
    if (value === undefined || value.trim() === "") {
        return fallback;
    }
    const parsed = Number(value);
    if (Number.isNaN(parsed)) {
        throw new Error(`Environment variable must be a number, received: ${value}`);
    }
    return parsed;
}

const smtpHost = process.env.SMTP_HOST?.trim() || undefined;
const smtpUser = process.env.SMTP_USER?.trim() || undefined;
const smtpPass = process.env.SMTP_PASS || undefined;

export const env = {
    nodeEnv: process.env.NODE_ENV?.trim() || "development",
    isProduction: process.env.NODE_ENV?.trim() === "production",
    port: toNumber(process.env.PORT, 3201),
    mongodbUri: required("MONGODB_URI"),
    adminToken: required("ADMIN_TOKEN"),
    corsOrigin: process.env.CORS_ORIGIN?.trim() || "http://localhost:5173",
    /** Set to a number (hop count) when the app runs behind a reverse proxy. */
    trustProxy: process.env.TRUST_PROXY ? toNumber(process.env.TRUST_PROXY, 1) : false,
    smtp: {
        host: smtpHost,
        port: toNumber(process.env.SMTP_PORT, 587),
        secure: process.env.SMTP_SECURE?.trim() === "true",
        user: smtpUser,
        pass: smtpPass,
    },
    /** Where contact-form notifications are delivered. Falls back to the SMTP user. */
    contactTo: process.env.CONTACT_TO?.trim() || smtpUser,
} as const;
