import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import Link from "next/link";
import { Layers, Package, Plus, Search, Trash2 } from "lucide-react";

export default async function AdminProductsPage() {
    const session = await getServerSession(authOptions as any);

    if (!session || session.user.role !== "admin") {
        redirect("/auth/login");
    }

    await connectToDatabase();
    const products = await Product.find().sort({ createdAt: -1 }).lean();

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Product Catalog</h1>
                    <p className="text-gray-600 mt-1">Manage every book and course available in your store.</p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
                >
                    <Plus className="h-5 w-5" />
                    Add New Product
                </Link>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr className="text-left">
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {products.map((p: any) => (
                                <tr key={p._id.toString()} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={p.imageUrl} className="h-12 w-12 rounded-lg object-cover" />
                                            <span className="font-bold text-gray-900">{p.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-600">{p.category}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded ${p.productType === 'book' ? 'bg-blue-50 text-blue-600' : 'bg-indigo-50 text-indigo-600'}`}>
                                            {p.productType}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-900">${p.price}</td>
                                    <td className="px-6 py-4">
                                        {p.isPublished ? (
                                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">Published</span>
                                        ) : (
                                            <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full border border-gray-200">Draft</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link
                                            href={`/admin/products/${p._id}`}
                                            className="text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-lg transition-all"
                                        >
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {products.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 mt-8">
                    <Package className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">No products found in the catalog.</p>
                    <Link href="/admin/products/new" className="text-blue-600 font-bold hover:underline mt-2 inline-block">Create your first product</Link>
                </div>
            )}
        </div>
    );
}
