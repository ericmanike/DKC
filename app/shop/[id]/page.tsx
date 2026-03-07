import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { formatPrice } from "@/lib/utils";
import { BadgeCheck, BookOpen, Clock, Globe, GraduationCap, PlayCircle, Share2, ShoppingCart } from "lucide-react";
import { notFound } from "next/navigation";
import { PaymentBtn } from "@/components/paymentBtn";
import type { Metadata } from 'next';

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function generateMetadata({ params }: ProductDetailsPageProps): Promise<Metadata> {
    const { id } = await params;
    await connectToDatabase();
    const product = await Product.findById(id).lean() as any;

    if (!product) return {};

    return {
        title: `${product.title} - DKC Books & Courses`,
        description: product.description.slice(0, 160),
        openGraph: {
            title: `${product.title} - DKC Books & Courses`,
            description: product.description.slice(0, 160),
            url: `https://dkcbooksandcourses.com/shop/${id}`,
            images: [
                {
                    url: product.imageUrl,
                    width: 1200,
                    height: 630,
                    alt: product.title,
                },
            ],
            type: 'website',
        },
    };
}

interface ProductDetailsPageProps {
    params: Promise<{ id: string }>;
}

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
    const { id } = await params;
    const session = (await getServerSession(authOptions as any)) as any;

    await connectToDatabase();

    const product = await Product.findById(id).lean() as any;

    if (!product) {
        return notFound();
    }







    const isCourse = product.productType === "course";

    return (
        <div className="bg-gray-300 min-h-screen">
            <div className="container mx-auto px-4 py-8 lg:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">

                    {/* Left Column: Image/Banner & Content */}
                    <div className="lg:col-span-8 space-y-8 lg:space-y-12">
                        {/* Banner Card */}
                        <div className="relative aspect-[4/3] md:aspect-video group rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-2xl ring-1 ring-black/5 transition-all duration-700 hover:shadow-blue-500/20">
                            <img
                                src={product.imageUrl}
                                alt={product.title}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            />

                            {/* Premium Gradient Overlay */}
                            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent opacity-85 transition-opacity duration-500 group-hover:opacity-95" />

                            {/* Content Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 space-y-4">
                                <div className="flex flex-wrap items-center gap-3">
                                    <div className="flex items-center gap-2 bg-blue-600 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-blue-400/30 backdrop-blur-md shadow-xl">
                                        <span className="text-white text-[9px] md:text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                            {isCourse ? <PlayCircle className="h-3 w-3 md:h-4 md:w-4 text-blue-200" /> : <BookOpen className="h-3 w-3 md:h-4 md:w-4 text-blue-200" />}
                                            {product.productType}
                                        </span>
                                    </div>
                                    <div className="bg-white/10 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-white/20 backdrop-blur-md">
                                        <span className="text-white/90 text-[9px] md:text-xs font-bold uppercase tracking-widest italic">
                                            {product.category}
                                        </span>
                                    </div>
                                </div>

                                <h1 className="text-xl md:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tighter drop-shadow-2xl max-w-xl">
                                    {product.title}
                                </h1>

                                <div className="flex flex-wrap items-center gap-3 md:gap-4 text-white/70 text-[9px] md:text-xs font-bold uppercase tracking-widest">
                                    <div className="flex items-center gap-2 backdrop-blur-md bg-white/5 py-1.5 px-3 md:py-2 md:px-4 rounded-xl border border-white/10 group-hover:bg-white/10 transition-colors">
                                        <Globe className="h-3 w-3 md:h-4 md:w-4 text-blue-400" />
                                        <span>English Content</span>
                                    </div>
                                    <div className="flex items-center gap-2 backdrop-blur-md bg-white/5 py-1.5 px-3 md:py-2 md:px-4 rounded-xl border border-white/10 group-hover:bg-white/10 transition-colors">
                                        <BadgeCheck className="h-3 w-3 md:h-4 md:w-4 text-orange-400" />
                                        <span>Readily Available</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white p-6 md:p-10 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100">
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">About this {product.productType}</h2>
                            <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed space-y-4">
                                {product.description.split('\n').map((para: string, i: number) => (
                                    <p key={i}>{para}</p>
                                ))}
                            </div>


                        </div>


                    </div>

                    {/* Right Column: Pricing & Actions UI */}
                    <aside className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
                        <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-xl border border-gray-100 space-y-8">
                            <div className="space-y-2">
                                <p className="text-[10px] md:text-sm font-bold text-gray-400 uppercase tracking-widest">Full Access Price</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl md:text-4xl font-extrabold text-gray-900">{formatPrice(product.price)}</span>
                                </div>

                                {session?.user?.id && (await Order.findOne({ userId: session.user.id, "items.productId": product._id, status: "completed" })) ? (
                                    <div className={`mt-4 p-4 ${isCourse ? 'bg-indigo-50 border-indigo-100' : 'bg-emerald-50 border-emerald-100'} border rounded-xl space-y-3`}>
                                        <p className={`text-sm font-bold ${isCourse ? 'text-indigo-700' : 'text-emerald-700'} flex items-center gap-2`}>
                                            <BadgeCheck size={18} /> You already own this {product.productType}
                                        </p>
                                        <a
                                            href={(product.productType === 'book' ? product.fileUrl : product.courseUrl) || "#"}
                                            target="_blank"
                                            rel="noreferrer"
                                            className={`w-full ${isCourse ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'} text-white font-bold py-3.5 rounded-xl transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2`}
                                        >
                                            Access Your {product.productType === 'book' ? 'Book' : 'Course'} &rarr;
                                        </a>
                                    </div>
                                ) : (
                                    <PaymentBtn
                                        email={session?.user?.email}
                                        price={product.price}
                                        id={product._id.toString()}
                                        productType={product.productType}
                                    />
                                )}


                            </div>



                            <div className="space-y-4 pt-6 border-t border-gray-50">
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

                        <div className="mt-6 lg:mt-8 bg-indigo-50 p-6 rounded-2xl md:rounded-3xl border border-indigo-100 flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                                <BadgeCheck className="h-6 w-6 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-xs md:text-sm font-bold text-indigo-900">Official DKC Course</p>
                                <p className="text-[10px] md:text-xs text-orange-700 opacity-80">Verified educational content</p>
                            </div>
                        </div>
                    </aside>

                </div>
            </div>
        </div>
    );
}
