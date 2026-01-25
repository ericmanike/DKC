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
        <div className="container mx-auto px-4 py-12 bg-gray-300">
            <div className="mb-12">
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Browse Our Catalog</h1>
                <p className="mt-2 text-gray-600">Discover premium books and comprehensive courses.</p>
            </div>

            <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-8">
                {/* Filters Sidebar */}
                <aside className="lg:col-span-3 space-y-8 mb-8 lg:mb-0">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 mb-6 font-bold text-gray-900 border-b pb-4">
                            <Filter className="h-4 w-4" /> Filters
                        </div>

                        {/* Search */}
                        <form action="/shop" className="relative mb-8">
                            <input
                                type="text"
                                name="q"
                                defaultValue={q}
                                placeholder="Search..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                            />
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            {category && <input type="hidden" name="category" value={category} />}
                            {type && <input type="hidden" name="type" value={type} />}
                        </form>

                        {/* Type Filter */}
                        <div className="space-y-4 mb-8">
                            <h4 className="font-semibold text-sm text-gray-900 uppercase tracking-wider">Product Type</h4>
                            <div className="flex flex-col gap-2">
                                <a
                                    href={`/shop?${new URLSearchParams({ ...(q && { q }), ...(category && { category }) }).toString()}`}
                                    className={`text-sm px-3 py-2 rounded-lg transition-colors ${!type ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    All Types
                                </a>
                                <a
                                    href={`/shop?${new URLSearchParams({ type: 'book', ...(q && { q }), ...(category && { category }) }).toString()}`}
                                    className={`text-sm px-3 py-2 rounded-lg transition-colors ${type === 'book' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    Books
                                </a>
                                <a
                                    href={`/shop?${new URLSearchParams({ type: 'course', ...(q && { q }), ...(category && { category }) }).toString()}`}
                                    className={`text-sm px-3 py-2 rounded-lg transition-colors ${type === 'course' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    Courses
                                </a>
                            </div>
                        </div>

                        {/* Categories Filter */}
                        <div className="space-y-4">
                            <h4 className="font-semibold text-sm text-gray-900 uppercase tracking-wider">Categories</h4>
                            <div className="flex flex-col gap-2">
                                <a
                                    href={`/shop?${new URLSearchParams({ ...(q && { q }), ...(type && { type }) }).toString()}`}
                                    className={`text-sm px-3 py-2 rounded-lg transition-colors ${!category ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    All Categories
                                </a>
                                {categories.map((cat: string) => (
                                    <a
                                        key={cat}
                                        href={`/shop?${new URLSearchParams({ category: cat, ...(q && { q }), ...(type && { type }) }).toString()}`}
                                        className={`text-sm px-3 py-2 rounded-lg transition-colors ${category === cat ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        {cat}
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t">
                            <a href="/shop" className="text-xs font-bold text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors">
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
    );
}
