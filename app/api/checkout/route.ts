import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { sendEmail } from "@/lib/resend";
import ReceiptEmail from "@/components/emails/ReceiptEmail";
import React from "react";

export async function POST(req: Request) {
    try {
        const session = (await getServerSession(authOptions as any)) as any;
        const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

        if (!session) {
            return NextResponse.json({ message: "Login required" }, { status: 401 });
        }

        const { productId, reference, phoneNumber, location } = await req.json();

        console.log("checkout details",{ productId, reference, phoneNumber, location });

        if (!productId || !reference) {
         console.log("Product ID and reference required");
            return NextResponse.json({ message: "Product ID and reference required" }, { status: 400 });
       
        }

        const verifyResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            },
        });

        const data = await verifyResponse.json();
  

        if (!verifyResponse.ok || data.data.status !== 'success' ) {
            console.log("Payment verification failed");
            return NextResponse.json({ message: "Payment verification failed" }, { status: 400 });
           
        }

        await connectToDatabase();

        const product = await Product.findById(productId);
        if (!product) {
            console.log("Product not found on db");
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

      


        // Create the order
        const order = await Order.create({
            userId: session.user.id,
            items: [{
                productId: product._id,
                title: product.title,
                price: product.price,
                productType: product.productType
            }],
            totalAmount: product.price,
            status: "completed",
            phoneNumber,
            location,
            deliveryStatus: product.productType === "book" ? "pending" : "none",
        });
        console.log("Order created", order);

        // Send Receipt Email
       const emailResponse =  await sendEmail({
            to: session.user.email,
            subject: `Receipt for your order #${order._id.toString().slice(-6)}`,
            component: React.createElement(ReceiptEmail, {
                userName: session.user.name || "Customer",
                items: [{
                    title: product.title,
                    price: product.price,
                    productType: product.productType
                }],
                total: product.price,
                orderId: order._id.toString()
            })
        });

        console.log("Email response", emailResponse);

        return NextResponse.json({ message: "Purchase successful", orderId: order._id }, { status: 201 });
    } catch (error) {
        console.error("Checkout error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
