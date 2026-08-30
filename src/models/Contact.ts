import mongoose, { type InferSchemaType, type Model } from "mongoose";

const contactSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            maxlength: 100,
        },
        surname: {
            type: String,
            required: [true, "Surname is required"],
            trim: true,
            maxlength: 100,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            lowercase: true,
            maxlength: 254,
        },
        message: {
            type: String,
            required: [true, "Message is required"],
            trim: true,
            maxlength: 5000,
        },
    },
    {
        collection: "contact",
        timestamps: true,
    },
);

export type ContactDoc = InferSchemaType<typeof contactSchema>;

export const Contact: Model<ContactDoc> =
    (mongoose.models.Contact as Model<ContactDoc> | undefined) ??
    mongoose.model<ContactDoc>("Contact", contactSchema);
