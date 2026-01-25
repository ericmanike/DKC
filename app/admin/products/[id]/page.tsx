"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Save, ArrowLeft } from "lucide-react";

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

    const [lessons, setLessons] = useState<{ title: string; url: string; duration: string }[]>([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${id}`);
                if (!res.ok) throw new Error("Failed to fetch product");
                const data = await res.json();
                setProductData(data);
                setProductType(data.productType);
                if (data.productType === "course") {
                    setLessons(data.lessons || []);
                }
            } catch (error) {
                toast.error("Error loading product");
                router.push("/admin/dashboard");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProduct();
    }, [id, router]);

    const addLesson = () => {
        setLessons([...lessons, { title: "", url: "", duration: "" }]);
    };

    const removeLesson = (index: number) => {
        setLessons(lessons.filter((_, i) => i !== index));
    };

    const updateLesson = (index: number, field: string, value: string) => {
        const updated = [...lessons];
        (updated[index] as any)[field] = value;
        setLessons(updated);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSaving(true);

        const formData = new FormData(e.currentTarget);
        const data: any = {
            title: formData.get("title"),
            description: formData.get("description"),
            price: Number(formData.get("price")),
            category: formData.get("category"),
            productType: productType,
            imageUrl: formData.get("imageUrl"),
            isPublished: formData.get("isPublished") === "on",
        };

        if (productType === "book") {
            data.fileUrl = formData.get("fileUrl");
            data.lessons = []; // Clear lessons if type changed to book
        } else {
            data.lessons = lessons.filter(l => l.title && l.url);
            data.fileUrl = ""; // Clear fileUrl if type changed to course
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
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Cover Image URL</label>
                            <input
                                name="imageUrl"
                                required
                                defaultValue={productData.imageUrl}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                            />
                        </div>
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
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-gray-900">Course Lessons</h3>
                                <button
                                    type="button"
                                    onClick={addLesson}
                                    className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 uppercase"
                                >
                                    <Plus className="h-3 w-3" /> Add Lesson
                                </button>
                            </div>
                            <div className="space-y-3">
                                {lessons.map((lesson, idx) => (
                                    <div key={idx} className="flex gap-3 items-end bg-gray-50 p-4 rounded-2xl">
                                        <div className="flex-1 space-y-2">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase">Lesson Title</label>
                                            <input
                                                value={lesson.title}
                                                onChange={(e) => updateLesson(idx, "title", e.target.value)}
                                                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none"
                                            />
                                        </div>
                                        <div className="flex-2 space-y-2">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase">Video URL</label>
                                            <input
                                                value={lesson.url}
                                                onChange={(e) => updateLesson(idx, "url", e.target.value)}
                                                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none"
                                            />
                                        </div>
                                        <div className="w-20 space-y-2">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase">Duration</label>
                                            <input
                                                value={lesson.duration}
                                                onChange={(e) => updateLesson(idx, "duration", e.target.value)}
                                                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeLesson(idx)}
                                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

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
                </div>

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
            </form>
        </div>
    );
}
