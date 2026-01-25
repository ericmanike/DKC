import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";

export async function POST(req: Request) {
    try {
        const session = (await getServerSession(authOptions as any)) as any;

        if (!session) {
            return NextResponse.json({ message: "Login required" }, { status: 401 });
        }

        const { productId } = await req.json();

        if (!productId) {
            return NextResponse.json({ message: "Product ID required" }, { status: 400 });
        }

        await connectToDatabase();

        const product = await Product.findById(productId);
        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        // Check if user already purchased this (Optional for MVP, but good practice)
        const existingOrder = await Order.findOne({
            userId: session.user.id,
            "items.productId": productId,
            status: "completed"
        });

        if (existingOrder) {
            return NextResponse.json({ message: "You already own this item" }, { status: 400 });
        }

        // Create a mock order
        const order = await Order.create({
            userId: session.user.id,
            items: [{
                productId: product._id,
                title: product.title,
                price: product.price,
                productType: product.productType
            }],
            totalAmount: product.price,
            status: "completed", // Auto-complete for mock
        });

        return NextResponse.json({ message: "Purchase successful", orderId: order._id }, { status: 201 });
    } catch (error) {
        console.error("Checkout error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
