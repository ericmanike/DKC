import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import { ShoppingBag, Tag, CreditCard, CheckCircle, Clock, XCircle } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default async function AdminOrdersPage() {
    const session = await getServerSession(authOptions as any);

    // if (!session || session.user.role !== "admin") {
    //     redirect("/auth/login");
    // }

    await connectToDatabase();
    const orders = await Order.find().populate("userId", "name email").sort({ createdAt: -1 }).lean();

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mb-12">
                <h1 className="text-3xl font-black text-gray-900">Recent Sales</h1>
                <p className="text-gray-600">Track and manage every purchase on your platform.</p>
            </div>

            <div className="grid gap-6">
                {orders.map((order: any) => (
                    <div key={order._id.toString()} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between hover:border-blue-100 transition-all group">
                        <div className="space-y-4 md:space-y-0 md:flex md:items-center md:gap-8">
                            <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                <ShoppingBag className="h-6 w-6" />
                            </div>

                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Customer</p>
                                <p className="font-bold text-gray-900">{(order.userId as any)?.name || "Guest"}</p>
                                <p className="text-xs text-gray-500">{(order.userId as any)?.email}</p>
                            </div>

                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Item</p>
                                <p className="text-sm font-semibold text-gray-700">{order.items[0]?.title}</p>
                                <span className="text-[10px] font-bold text-gray-400 border border-gray-200 px-1.5 py-0.5 rounded uppercase">
                                    {order.items[0]?.productType}
                                </span>
                            </div>

                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                                <div className="flex items-center gap-1.5">
                                    {order.status === 'completed' && <CheckCircle className="h-4 w-4 text-emerald-500" />}
                                    {order.status === 'pending' && <Clock className="h-4 w-4 text-orange-500" />}
                                    {order.status === 'failed' && <XCircle className="h-4 w-4 text-red-500" />}
                                    <span className={`text-sm font-bold capitalize ${order.status === 'completed' ? 'text-emerald-700' : order.status === 'pending' ? 'text-orange-700' : 'text-red-700'}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 md:mt-0 text-right md:shrink-0 flex items-center justify-between md:block">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Amount</p>
                            <p className="text-2xl font-black text-gray-900">{formatPrice(order.totalAmount)}</p>
                        </div>
                    </div>
                ))}

                {orders.length === 0 && (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <ShoppingBag className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-500">No orders recorded yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
