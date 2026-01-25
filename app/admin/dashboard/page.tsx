import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import User from "@/models/User";
import Order from "@/models/Order";
import Link from "next/link";
import { BookMarked, Layers, Package, ShoppingBag, Users } from "lucide-react";

export default async function AdminDashboard() {
    const session = await getServerSession(authOptions as any);

   

    await connectToDatabase();

    const stats = {
        products: await Product.countDocuments(),
        users: await User.countDocuments(),
        orders: await Order.countDocuments(),
        totalRevenue: await Order.aggregate([
            { $match: { status: "completed" } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]).then(res => res[0]?.total || 0),
    };

    const recentProducts = await Product.find().sort({ createdAt: -1 }).limit(5);

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h1>
                    <p className="text-gray-600 mt-1">Monitor and manage your shop's performance.</p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold
                     hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
                >
                    <Package className="h-5 w-5" />
                    Add New Product
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <StatCard title="Total Revenue" value={`$${stats.totalRevenue}`} icon={<ShoppingBag className="text-emerald-600" />} color="bg-emerald-50" />
                <StatCard title="All Products" value={stats.products} icon={<Layers className="text-blue-600" />} color="bg-blue-50" />
                <StatCard title="Total Users" value={stats.users} icon={<Users className="text-indigo-600" />} color="bg-indigo-50" />
                <StatCard title="Orders" value={stats.orders} icon={<BookMarked className="text-orange-600" />} color="bg-orange-50" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Recent Products */}
                <div className="lg:col-span-8 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b">
                        <h3 className="text-xl font-bold text-gray-900">Recently Added Products</h3>
                        <Link href="/admin/products" className="text-sm font-bold text-blue-600 hover:underline">View All</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    <th className="pb-4">Product</th>
                                    <th className="pb-4">Type</th>
                                    <th className="pb-4">Price</th>
                                    <th className="pb-4">Status</th>
                                    <th className="pb-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recentProducts.map((p) => (
                                    <tr key={p._id.toString()} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4">
                                            <div className="flex items-center gap-3">
                                                <img src={p.imageUrl} className="h-10 w-10 rounded-lg object-cover" />
                                                <span className="font-bold text-gray-900">{p.title}</span>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <span className="text-xs font-bold px-2 py-1 rounded bg-gray-100 text-gray-500 uppercase">{p.productType}</span>
                                        </td>
                                        <td className="py-4 font-semibold">${p.price}</td>
                                        <td className="py-4">
                                            {p.isPublished ? (
                                                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Published</span>
                                            ) : (
                                                <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">Draft</span>
                                            )}
                                        </td>
                                        <td className="py-4 text-right">
                                            <Link href={`/admin/products/${p._id}`} className="text-xs
                                             font-bold text-gray-400 hover:text-blue-600 uppercase tracking-widest">Edit</Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b">System Insights</h3>
                        <div className="space-y-4">
                            <Link href="/admin/users" className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex
                             items-center justify-between hover:bg-white hover:border-blue-100 transition-all group">
                                <span className="text-sm text-gray-600 font-medium">Manage Users</span>
                                <Users className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                            </Link>
                            <Link href="/admin/orders" className="p-4 rounded-2xl bg-gray-50 border
                             border-gray-100 flex items-center justify-between hover:bg-white hover:border-blue-100 transition-all group">
                                <span className="text-sm text-gray-600 font-medium">View Purchases</span>
                                <ShoppingBag className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                            </Link>
                            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                                <span className="text-sm text-gray-600">Avg. Order Value</span>
                                <span className="font-bold text-gray-900">${(stats.totalRevenue / (stats.orders || 1)).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color }: any) {
    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5">
            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-black text-gray-900">{value}</p>
            </div>
        </div>
    );
}
