import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Link from "next/link";
import { Book, GraduationCap, LayoutPanelLeft, PlayCircle } from "lucide-react";

export default async function UserDashboard() {
    const session = await getServerSession(authOptions as any);

    if (!session) {
        redirect("/auth/login");
    }

    await connectToDatabase();

    const orders = await Order.find({
        userId: session.user.id,
        status: "completed"
    }).sort({ createdAt: -1 }).lean();

    // Extract all product IDs from orders
    const productIds = orders.flatMap(order => order.items.map((item: any) => item.productId));

    // Fetch actual products to show details
    const purchasedProducts = await Product.find({
        _id: { $in: productIds }
    }).lean();

    const books = purchasedProducts.filter(p => p.productType === "book");
    const courses = purchasedProducts.filter(p => p.productType === "course");

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mb-12">
                <h1 className="text-3xl font-black text-gray-900">My Learning Library</h1>
                <p className="text-gray-600">Welcome back, {session.user.name}. Here are your resources.</p>
            </div>

            <div className="space-y-16">
                {/* Courses Section */}
                <section>
                    <div className="flex items-center gap-2 mb-8 border-b pb-4">
                        <GraduationCap className="text-indigo-600 h-6 w-6" />
                        <h2 className="text-2xl font-bold text-gray-900">Enrolled Courses</h2>
                    </div>
                    {courses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {courses.map((course: any) => (
                                <div key={course._id.toString()} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
                                    <div className="relative aspect-video">
                                        <img src={course.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                            <PlayCircle className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity scale-90 group-hover:scale-100" />
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">{course.title}</h3>
                                        <p className="text-sm text-gray-500 mb-6 line-clamp-1">{course.category}</p>
                                        <Link
                                            href={`/shop/${course._id}`}
                                            className="block w-full text-center py-3 rounded-xl bg-gray-50 text-indigo-600 font-bold hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                                        >
                                            Resume Learning
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                            <p className="text-gray-500">You haven't enrolled in any courses yet.</p>
                            <Link href="/shop?type=course" className="text-indigo-600 font-bold hover:underline mt-2 inline-block">Browse Courses</Link>
                        </div>
                    )}
                </section>

                {/* Books Section */}
                <section>
                    <div className="flex items-center gap-2 mb-8 border-b pb-4">
                        <Book className="text-blue-600 h-6 w-6" />
                        <h2 className="text-2xl font-bold text-gray-900">My Bookshelf</h2>
                    </div>
                    {books.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {books.map((book: any) => (
                                <div key={book._id.toString()} className="flex gap-6 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 items-center hover:shadow-lg transition-all">
                                    <img src={book.imageUrl} className="h-24 w-20 rounded-lg object-cover shadow-md" />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-gray-900 truncate">{book.title}</h3>
                                        <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">{book.category}</p>
                                        <a
                                            href={book.fileUrl || "#"}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="mt-4 inline-block text-sm font-bold text-blue-600 hover:text-blue-700"
                                        >
                                            Read Online &rarr;
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                            <p className="text-gray-500">Your bookshelf is empty.</p>
                            <Link href="/shop?type=book" className="text-blue-600 font-bold hover:underline mt-2 inline-block">Browse Books</Link>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
