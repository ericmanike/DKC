import { ProductCard } from "@/components/ui/ProductCard";
import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import { Filter, Search } from "lucide-react";

interface ShopPageProps {
    searchParams: Promise<{
        category?: string;
        type?: string;
        q?: string;
    }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
    const { category, type, q } = await searchParams;

    await connectToDatabase();

    const query: any = { isPublished: true };
    if (category) query.category = category;
    if (type) query.productType = type;
    if (q) {
        query.$or = [
            { title: { $regex: q, $options: "i" } },
            { description: { $regex: q, $options: "i" } },
        ];
    }

    const products = await Product.find(query).sort({ createdAt: -1 }).lean();
    const categories = await Product.distinct("category", { isPublished: true });

    return (
        <div className="bg-gray-300 min-h-screen">
            <div className="container mx-auto px-4 py-8 lg:py-16">
                <div className="mb-8 lg:mb-12">
                    <h1 className="text-3xl lg:text-5xl font-black text-gray-900 tracking-tight leading-none">Browse Our Catalog</h1>
                    <p className="mt-3 text-gray-500 text-sm lg:text-base font-medium">Discover premium books and comprehensive courses.</p>
                </div>

                <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-8">
                    {/* Filters Section */}
                    <aside className="lg:col-span-3 space-y-6 lg:space-y-8 mb-8 lg:mb-0">
                        <div className="bg-white p-5 lg:p-6 rounded-2xl lg:rounded-3xl shadow-sm border border-gray-100">
                            {/* Desktop Header */}
                            <div className="hidden lg:flex items-center gap-2 mb-6 font-bold text-gray-900 border-b pb-4">
                                <Filter className="h-4 w-4" /> Filters
                            </div>

                            {/* Search Bar - Always Visible */}
                            <form action="/shop" className="relative mb-6 lg:mb-8">
                                <input
                                    type="text"
                                    name="q"
                                    defaultValue={q}
                                    placeholder="Search products..."
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm outline-none"
                                />
                                <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                                {category && <input type="hidden" name="category" value={category} />}
                                {type && <input type="hidden" name="type" value={type} />}
                            </form>

                            <div className="space-y-6 lg:space-y-8">
                                {/* Type Filter */}
                                <div className="space-y-3 lg:space-y-4">
                                    <h4 className="font-bold text-[10px] lg:text-xs text-gray-400 uppercase tracking-widest">Product Type</h4>
                                    <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide -mx-1 px-1 lg:mx-0 lg:px-0">
                                        <a
                                            href={`/shop?${new URLSearchParams({ ...(q && { q }), ...(category && { category }) }).toString()}`}
                                            className={`whitespace-nowrap text-xs lg:text-sm px-4 lg:px-3 py-2 rounded-xl transition-all border ${!type ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-md shadow-blue-500/20' : 'text-gray-600 hover:bg-gray-50 border-gray-100 hover:border-gray-200'}`}
                                        >
                                            All Types
                                        </a>
                                        <a
                                            href={`/shop?${new URLSearchParams({ type: 'book', ...(q && { q }), ...(category && { category }) }).toString()}`}
                                            className={`whitespace-nowrap text-xs lg:text-sm px-4 lg:px-3 py-2 rounded-xl transition-all border ${type === 'book' ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-md shadow-blue-500/20' : 'text-gray-600 hover:bg-gray-50 border-gray-100 hover:border-gray-200'}`}
                                        >
                                            Books
                                        </a>
                                        <a
                                            href={`/shop?${new URLSearchParams({ type: 'course', ...(q && { q }), ...(category && { category }) }).toString()}`}
                                            className={`whitespace-nowrap text-xs lg:text-sm px-4 lg:px-3 py-2 rounded-xl transition-all border ${type === 'course' ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-md shadow-blue-500/20' : 'text-gray-600 hover:bg-gray-50 border-gray-100 hover:border-gray-200'}`}
                                        >
                                            Courses
                                        </a>
                                    </div>
                                </div>

                                {/* Categories Filter */}
                                <div className="space-y-3 lg:space-y-4">
                                    <h4 className="font-bold text-[10px] lg:text-xs text-gray-400 uppercase tracking-widest">Categories</h4>
                                    <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide -mx-1 px-1 lg:mx-0 lg:px-0">
                                        <a
                                            href={`/shop?${new URLSearchParams({ ...(q && { q }), ...(type && { type }) }).toString()}`}
                                            className={`whitespace-nowrap text-xs lg:text-sm px-4 lg:px-3 py-2 rounded-xl transition-all border ${!category ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-md shadow-blue-500/20' : 'text-gray-600 hover:bg-gray-50 border-gray-100 hover:border-gray-200'}`}
                                        >
                                            All Categories
                                        </a>
                                        {categories.map((cat: string) => (
                                            <a
                                                key={cat}
                                                href={`/shop?${new URLSearchParams({ category: cat, ...(q && { q }), ...(type && { type }) }).toString()}`}
                                                className={`whitespace-nowrap text-xs lg:text-sm px-4 lg:px-3 py-2 rounded-xl transition-all border ${category === cat ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-md shadow-blue-500/20' : 'text-gray-600 hover:bg-gray-50 border-gray-100 hover:border-gray-200'}`}
                                            >
                                                {cat}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-50 hidden lg:block">
                                <a href="/shop" className="text-[10px] font-bold text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors">
                                    Clear All Filters
                                </a>
                            </div>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <main className="lg:col-span-9">
                        {products.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {products.map((product: any) => (
                                    <ProductCard
                                        key={product._id.toString()}
                                        id={product._id.toString()}
                                        title={product.title}
                                        description={product.description}
                                        price={product.price}
                                        imageUrl={product.imageUrl}
                                        category={product.category}
                                        productType={product.productType}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100">
                                <Search className="h-12 w-12 text-gray-200 mb-4" />
                                <p className="text-gray-500 font-medium">No products found matching your criteria.</p>
                                <a href="/shop" className="mt-4 text-blue-600 font-bold hover:underline">Clear all filters</a>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
