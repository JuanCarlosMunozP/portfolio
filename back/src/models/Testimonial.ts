import mongoose, { type InferSchemaType, type Model } from "mongoose";

const testimonialSchema = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: [true, "Full name is required"],
            trim: true,
            maxlength: 120,
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
            maxlength: 200,
        },
        experience: {
            type: String,
            required: [true, "Experience is required"],
            trim: true,
            maxlength: 1000,
        },
    },
    {
        collection: "testimonials",
        timestamps: true,
    },
);

export type TestimonialDoc = InferSchemaType<typeof testimonialSchema>;

export const Testimonial: Model<TestimonialDoc> =
    (mongoose.models.Testimonial as Model<TestimonialDoc> | undefined) ??
    mongoose.model<TestimonialDoc>("Testimonial", testimonialSchema);
