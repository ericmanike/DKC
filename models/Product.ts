import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Please provide a title"],
        },
        description: {
            type: String,
            required: [true, "Please provide a description"],
        },
        price: {
            type: Number,
            required: [true, "Please provide a price"],
            min: 0,
        },
        category: {
            type: String,
            required: [true, "Please provide a category"],
        },
        productType: {
            type: String,
            enum: ["book", "course"],
            required: [true, "Please indicate if this is a book or a course"],
        },
        imageUrl: {
            type: String,
            required: [true, "Please provide a cover image URL"],
        },
        // For Books: Link to the PDF
        fileUrl: {
            type: String,
        },
        // For Courses: Link to the Course
        courseUrl: {
            type: String,
        },
        isPublished: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Product = models.Product || model("Product", ProductSchema);

export default Product;
