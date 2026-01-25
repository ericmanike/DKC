import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
    try {
        await connectToDatabase();
        // Allow filtering by query params
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");
        const type = searchParams.get("type"); // book or course
        const q = searchParams.get("q");

        const query: any = { isPublished: true };
        if (category) query.category = category;
        if (type) query.productType = type;
        if (q) {
            query.$or = [
                { title: { $regex: q, $options: "i" } },
                { description: { $regex: q, $options: "i" } },
            ];
        }

        const products = await Product.find(query).sort({ createdAt: -1 });
        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching products" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions as any);

        // if (!session || session.user.role !== "admin") {
        //     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        // }

        const body = await req.json();
        await connectToDatabase();

        const product = await Product.create(body);
        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error creating product" }, { status: 500 });
    }
}
