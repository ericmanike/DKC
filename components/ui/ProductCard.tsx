import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
    id: string;
    title: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
    productType: "book" | "course";
}

export function ProductCard({
    id,
    title,
    description,
    price,
    imageUrl,
    category,
    productType,
}: ProductCardProps) {
    return (
        <div className="group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
            <Link href={`/shop/${id}`} className="relative aspect-4/3 w-full overflow-hidden bg-gray-100 sm:aspect-4/3 lg:aspect-video block">
                {/* Using standard img for simplicity, next/image recommended for prod */}
                <img
                    src={imageUrl || "https://placehold.co/600x400?text=No+Image"}
                    alt={title}
                    className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-gray-900 shadow-sm backdrop-blur-sm uppercase tracking-wider border border-white/50">
                    {productType}
                </div>
            </Link>
            <div className="flex flex-1 flex-col p-5 space-y-3">
                <div className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                    {category}
                </div>
                <h3 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    <Link href={`/shop/${id}`}>
                        {title}
                    </Link>
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 flex-1 leading-relaxed">{description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                    <p className="text-xl font-bold text-gray-900">{formatPrice(price)}</p>
                    <Link href={`/shop/${id}`} className="text-sm font-bold text-orange-600 group-hover:translate-x-1 transition-transform flex items-center hover:text-orange-700">
                        View Details &rarr;
                    </Link>
                </div>
            </div>
        </div>
    );
}
