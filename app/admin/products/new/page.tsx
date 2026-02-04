"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, X } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

export default function NewProductPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [productType, setProductType] = useState<"book" | "course">("book");
    const [imageUrl, setImageUrl] = useState("");



    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!imageUrl) {
            toast.error("Please upload a cover image");
            return;
        }

        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const data: any = {
            title: formData.get("title"),
            description: formData.get("description"),
            price: Number(formData.get("price")),
            category: formData.get("category"),
            productType: productType,
            imageUrl: imageUrl,
            isPublished: formData.get("isPublished") === "on",
        };

        if (productType === "book") {
            data.fileUrl = formData.get("fileUrl");
        } else {
            data.courseUrl = formData.get("courseUrl");
        }

        try {
            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error("Failed to create product");

            toast.success("Product created successfully!");
            router.push("/admin/dashboard");
            router.refresh();
        } catch (error) {
            toast.error("Error creating product");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="mb-12 flex items-center justify-between">
                <div>
                    <button onClick={() => router.back()} className="text-sm font-bold text-gray-400 hover:text-gray-900 mb-2 flex items-center gap-1">
                        &larr; Back to Dashboard
                    </button>
                    <h1 className="text-3xl font-black text-gray-900">Add New Product</h1>
                </div>
                <div className="flex bg-gray-100 p-1 rounded-xl">
                    <button
                        onClick={() => setProductType("book")}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${productType === 'book' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Book
                    </button>
                    <button
                        onClick={() => setProductType("course")}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${productType === 'course' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Course
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Product Title</label>
                            <input
                                name="title"
                                required
                                placeholder="e.g. Master Clean Code"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Category</label>
                            <input
                                name="category"
                                required
                                placeholder="e.g. Programming"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Description</label>
                        <textarea
                            name="description"
                            required
                            rows={4}
                            placeholder="Detailed description of the product..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Price ($)</label>
                            <input
                                name="price"
                                type="number"
                                required
                                step="0.01"
                                placeholder="29.99"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                            />
                        </div>
                        <ImageUpload
                            label="Cover Image"
                            value={imageUrl}
                            onChange={setImageUrl}
                            
                        />
                    </div>

                    {productType === "book" ? (
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">PDF File URL</label>
                            <input
                                name="fileUrl"
                                required={productType === "book"}
                                placeholder="https://..."
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                            />
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Course URL</label>
                            <input
                                name="courseUrl"
                                required={productType === "course"}
                                placeholder="https://..."
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                            />
                        </div>
                    )}

                    <div className="flex items-center gap-2 pt-4">
                        <input type="checkbox" name="isPublished" id="isPublished" defaultChecked className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <label htmlFor="isPublished" className="text-sm font-bold text-gray-700">Publish immediately</label>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-4 py-1 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-12 py-4 rounded-2xl font-bold bg-gray-900 text-white hover:bg-black transition-all shadow-xl active:scale-95 disabled:opacity-50 flex items-center gap-2"
                    >
                        {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Save Product"}
                    </button>
                </div>
            </form>
        </div>
    );
}
