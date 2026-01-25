"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, X } from "lucide-react";

export default function NewProductPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [productType, setProductType] = useState<"book" | "course">("book");

    const [lessons, setLessons] = useState<{ title: string; url: string; duration: string }[]>([
        { title: "", url: "", duration: "" }
    ]);

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
        setIsLoading(true);

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
        } else {
            data.lessons = lessons.filter(l => l.title && l.url);
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
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Cover Image URL</label>
                            <input
                                name="imageUrl"
                                required
                                placeholder="https://..."
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                            />
                        </div>
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
                                    <div key={idx} className="flex gap-3 items-end bg-gray-50 p-4 rounded-2xl relative group">
                                        <div className="flex-1 space-y-2">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase">Lesson Title</label>
                                            <input
                                                value={lesson.title}
                                                onChange={(e) => updateLesson(idx, "title", e.target.value)}
                                                placeholder="Introduction"
                                                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                            />
                                        </div>
                                        <div className="flex-[2] space-y-2">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase">Video/Resource URL</label>
                                            <input
                                                value={lesson.url}
                                                onChange={(e) => updateLesson(idx, "url", e.target.value)}
                                                placeholder="https://..."
                                                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                            />
                                        </div>
                                        <div className="w-24 space-y-2">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase">Duration</label>
                                            <input
                                                value={lesson.duration}
                                                onChange={(e) => updateLesson(idx, "duration", e.target.value)}
                                                placeholder="10:00"
                                                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
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
                        <input type="checkbox" name="isPublished" id="isPublished" defaultChecked className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <label htmlFor="isPublished" className="text-sm font-bold text-gray-700">Publish immediately</label>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-8 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
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
