import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import { formatPrice } from "@/lib/utils";
import { BadgeCheck, BookOpen, Clock, Globe, GraduationCap, PlayCircle, Share2, ShoppingCart } from "lucide-react";
import { notFound } from "next/navigation";


interface ProductDetailsPageProps {
    params: Promise<{ id: string }>;
}

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
    const { id } = await params;

    await connectToDatabase();

    const product = await Product.findById(id).lean();

    if (!product) {
        return notFound();
    }

    const isCourse = product.productType === "course";

    return (
        <div className="container mx-auto px-4 py-8 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

                {/* Left Column: Image/Banner & Content */}
                <div className="lg:col-span-8 space-y-12">
                    {/* Banner */}
                    <div className="relative aspect-video rounded-3xl overflow-hidden  ">
                        <img
                            src={product.imageUrl}
                            alt={product.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-slate-600/60 flex flex-col justify-end p-8 text-white">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="bg-blue-600/90 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                                    {product.productType}
                                </span>
                                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                                    {product.category}
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black">{product.title}</h1>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">About this {product.productType}</h2>
                        <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed space-y-4">
                            {product.description.split('\n').map((para: string, i: number) => (
                                <p key={i}>{para}</p>
                            ))}
                        </div>


                    </div>


                </div>

                {/* Right Column: Pricing & Actions UI */}
                <aside className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 space-y-8">
                        <div className="space-y-2">
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Full Access Price</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-extrabold text-gray-900">{formatPrice(product.price)}</span>
                            </div>
                            <button className="w-full mt-4 bg-orange-600 text-white 
                            font-bold py-3 rounded-xl hover:bg-orange-700 transition-all shadow-lg
                             active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                Buy Now
                            </button>
                        </div>



                        <div className="space-y-4 pt-8 border-t border-gray-50">
                            <h4 className="font-bold text-gray-900 text-sm italic">This {product.productType} includes:</h4>
                            <ul className="space-y-3">

                                <li className="flex items-center gap-3 text-sm text-gray-600">
                                    <Clock className="h-4 w-4 text-gray-400" />
                                    <span>Self-Paced Learning</span>
                                </li>
                                <li className="flex items-center gap-3 text-sm text-gray-600">
                                    <GraduationCap className="h-4 w-4 text-gray-400" />
                                    <span>Certificate of Completion</span>
                                </li>
                            </ul>
                        </div>

                        <p className="text-center text-xs text-gray-400 font-medium">
                            30-Day Money-Back Guarantee
                        </p>
                    </div>

                    <div className="mt-8 bg-indigo-50 p-6 rounded-3xl border border-indigo-100 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                            <BadgeCheck className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-indigo-900">Official DKC Course</p>
                            <p className="text-xs text-orange-700 opacity-80">Verified educational content</p>
                        </div>
                    </div>
                </aside>

            </div>
        </div>
    );
}
