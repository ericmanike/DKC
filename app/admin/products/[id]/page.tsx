"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Save, ArrowLeft } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: PageProps) {
    const router = useRouter();
    const { id } = use(params);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [productType, setProductType] = useState<"book" | "course">("book");
    const [productData, setProductData] = useState<any>(null);
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${id}`);
                if (!res.ok) throw new Error("Failed to fetch product");
                const data = await res.json();
                setProductData(data);
                setProductType(data.productType);
                setImageUrl(data.imageUrl || "");
            } catch (error) {
                toast.error("Error loading product");
                router.push("/admin/dashboard");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProduct();
    }, [id, router]);



    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!imageUrl) {
            toast.error("Please upload a cover image");
            return;
        }

        setIsSaving(true);

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
            data.courseUrl = "";
        } else {
            data.courseUrl = formData.get("courseUrl");
            data.fileUrl = "";
        }

        try {
            const res = await fetch(`/api/products/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error("Failed to update product");

            toast.success("Product updated successfully!");
            router.push("/admin/dashboard");
            router.refresh();
        } catch (error) {
            toast.error("Error updating product");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        setIsSaving(true);
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete product");

            toast.success("Product deleted successfully");
            router.push("/admin/dashboard");
            router.refresh();
        } catch (error) {
            toast.error("Error deleting product");
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
            </div>
        );
    }

    if (!productData) return null;

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="mb-12 flex items-center justify-between">
                <div>
                    <button onClick={() => router.back()} className="text-sm font-bold text-gray-400 hover:text-gray-900 mb-2 flex items-center gap-1 group transition-all">
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1" /> Back
                    </button>
                    <h1 className="text-3xl font-black text-gray-900">Edit Product</h1>
                </div>
                <div className="flex bg-gray-100 p-1 rounded-xl">
                    <button
                        type="button"
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${productType === 'book' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}
                        disabled // Don't allow changing type easily in edit mode for now
                    >
                        {productType === 'book' ? 'Book' : 'Course'}
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Product Title</label>
                            <input
                                name="title"
                                required
                                defaultValue={productData.title}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Category</label>
                            <input
                                name="category"
                                required
                                defaultValue={productData.category}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Description</label>
                        <textarea
                            name="description"
                            required
                            rows={6}
                            defaultValue={productData.description}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Price ($)</label>
                            <input
                                name="price"
                                type="number"
                                required
                                step="0.01"
                                defaultValue={productData.price}
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
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">PDF File URL</label>
                            <input
                                name="fileUrl"
                                required={productType === "book"}
                                defaultValue={productData.fileUrl}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                            />
                        </div>
                    ) : (
                        <div className="space-y-4 pt-4 border-t border-gray-50">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Course URL</label>
                            <input
                                name="courseUrl"
                                required={productType === "course"}
                                defaultValue={productData.courseUrl}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                            />
                        </div>
                    )
                    }

                    <div className="flex items-center gap-2 pt-4">
                        <input
                            type="checkbox"
                            name="isPublished"
                            id="isPublished"
                            defaultChecked={productData.isPublished}
                            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="isPublished" className="text-sm font-bold text-gray-700">Published</label>
                    </div>
                </div >

                <div className="flex justify-between">
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isSaving}
                        className="px-8 py-4 rounded-2xl font-bold bg-white text-red-500 border border-red-50 hover:bg-red-50 transition-all flex items-center gap-2 shadow-sm"
                    >
                        <Trash2 className="h-5 w-5" />
                        Delete Product
                    </button>
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-8 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-12 py-4 rounded-2xl font-bold bg-gray-900 text-white hover:bg-black transition-all shadow-xl active:scale-95 disabled:opacity-50 flex items-center gap-2"
                        >
                            {isSaving ? <Loader2 className="animate-spin h-5 w-5" /> : (
                                <>
                                    <Save className="h-5 w-5" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form >
        </div >
    );
}
