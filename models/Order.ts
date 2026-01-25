import mongoose, { Schema, model, models } from "mongoose";

const OrderSchema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                title: { type: String, required: true },
                price: { type: Number, required: true },
                productType: { type: String, enum: ["book", "course"], required: true },
            },
        ],
        totalAmount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "completed", "failed"],
            default: "pending",
        },
    },
    { timestamps: true }
);

const Order = models.Order || model("Order", OrderSchema);

export default Order;
