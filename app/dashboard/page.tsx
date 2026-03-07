import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Link from "next/link";
import { Session } from "next-auth";
import { Book, GraduationCap, LayoutPanelLeft, PlayCircle, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import mongoose from "mongoose";

export default async function UserDashboard() {
    const session: any = await getServerSession(authOptions as any);

    if (!session?.user) {
        redirect("/auth/login");
    }

    await connectToDatabase();

    // Fetch ALL orders to debug why some might be missing
    const allOrders = await Order.find({
        userId: new mongoose.Types.ObjectId(session.user.id)
    }).sort({ createdAt: -1 }).lean();

    console.log(`Found ${allOrders.length} total orders for user ${session.user.id}`);

    // Filter for completed orders for the library view
    const completedOrders = allOrders.filter(o => o.status === "completed");

    // Flatten all items from completed orders
    const orderItems = completedOrders.flatMap(order =>
        order.items.map((item: any) => ({
            ...item,
            orderId: order._id.toString(),
            purchaseDate: order.createdAt
        }))
    );

    // Get unique product IDs to fetch images/extra details
    const productIds = Array.from(new Set(orderItems.map(item => item.productId.toString())));

    // Fetch products to get current metadata (images, file URLs)
    const products = await Product.find({
        _id: { $in: productIds }
    }).lean();

    // Map items to their products
    const libraryItems = orderItems.map(item => {
        const product = products.find(p => p._id.toString() === item.productId.toString());
        return {
            ...item,
            imageUrl: product?.imageUrl || "/placeholder.png",
            fileUrl: product?.fileUrl,
            courseUrl: product?.courseUrl,
            category: product?.category || "Uncategorized"
        };
    });

    const books = libraryItems.filter(item => item.productType === "book");
    const courses = libraryItems.filter(item => item.productType === "course");

    return (
        <div className="bg-gray-300 min-h-screen pb-12">
            <div className="container mx-auto px-4 py-12 max-w-7xl">
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Dashboard</h1>
                        <p className="text-gray-500 mt-2 text-lg">Welcome back, <span className="text-gray-900 font-semibold">{session.user.name}</span></p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-indigo-50 px-6 py-3 rounded-2xl border border-indigo-100">
                            <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Enrolled</p>
                            <p className="text-2xl font-black text-indigo-600">{courses.length}</p>
                        </div>
                        <div className="bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100">
                            <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Books</p>
                            <p className="text-2xl font-black text-emerald-600">{books.length}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-12 space-y-16">
                        {/* Courses Section */}
                        <section>
                            <div className="flex items-center justify-between mb-8 border-b pb-4 border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-600 rounded-xl">
                                        <GraduationCap className="text-white h-6 w-6" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">Enrolled Courses</h2>
                                </div>
                                <Link href="/shop?type=course" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                                    Browse More &rarr;
                                </Link>
                            </div>

                            {courses.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {courses.map((course: any, idx: number) => (
                                        <div key={`${course.productId}-${idx}`} className="flex gap-6 bg-white p-5 rounded-3xl shadow-sm border border-gray-100 items-center hover:shadow-lg transition-all group">
                                            <div className="relative h-28 w-40 flex-shrink-0 overflow-hidden rounded-xl">
                                                <img src={course.imageUrl} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                                    <PlayCircle className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] text-indigo-500 font-black uppercase tracking-widest">{course.category}</p>
                                                <h3 className="font-bold text-gray-900 truncate mt-1">{course.title}</h3>
                                                <p className="text-[10px] text-gray-400 mt-1 italic">Order: #{course.orderId.slice(-6)}</p>
                                                <Link
                                                    href={`/shop/${course.productId}`}
                                                    className="mt-4 flex items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                                                >
                                                    Resume Learning <span className="text-lg">&rarr;</span>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-white/50 rounded-[40px] border-2 border-dashed border-gray-200">
                                    <GraduationCap className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 font-medium">You haven't enrolled in any courses yet.</p>
                                    <Link href="/shop?type=course" className="text-indigo-600 font-bold hover:underline mt-4 inline-block">Explore Our Courses</Link>
                                </div>
                            )}
                        </section>

                        {/* Books Section */}
                        <section>
                            <div className="flex items-center justify-between mb-8 border-b pb-4 border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-600 rounded-xl">
                                        <Book className="text-white h-6 w-6" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">My Bookshelf</h2>
                                </div>
                                <Link href="/shop?type=book" className="text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
                                    View Collection &rarr;
                                </Link>
                            </div>

                            {books.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {books.map((book: any, idx) => (
                                        <div key={`${book.productId}-${idx}`} className="flex gap-6 bg-white p-5 rounded-3xl shadow-sm border border-gray-100 items-center hover:shadow-lg transition-all group">
                                            <div className="relative h-28 w-20 flex-shrink-0">
                                                <img src={book.imageUrl} className="h-full w-full rounded-xl object-cover shadow-md group-hover:-rotate-3 transition-transform" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">{book.category}</p>
                                                <h3 className="font-bold text-gray-900 truncate mt-1">{book.title}</h3>
                                                <p className="text-[10px] text-gray-400 mt-1 italic">Order: #{book.orderId.slice(-6)}</p>
                                                <a
                                                    href={book.fileUrl || "#"}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="mt-4 flex items-center gap-1 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                                                >
                                                    Read Now <span className="text-lg">&rarr;</span>
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-white/50 rounded-[40px] border-2 border-dashed border-gray-200">
                                    <Book className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 font-medium">Your bookshelf is empty.</p>
                                    <Link href="/shop?type=book" className="text-emerald-600 font-bold hover:underline mt-4 inline-block">Browse Books</Link>
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
