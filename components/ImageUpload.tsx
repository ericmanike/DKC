"use client";

import { useState } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    label: string;
}

export default function ImageUpload({ value, onChange, label }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");

            const data = await res.json();
            onChange(data.secure_url);
            toast.success("Image uploaded successfully");
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Failed to upload image. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-2 " >
            <label className="text-sm font-bold  uppercase tracking-wider">{label}</label>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-3xl p-6 transition-all hover:border-blue-400 bg-gray-50/50">
                {value ? (
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden group">
                        <Image src={value} alt="Product image" fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                                type="button"
                                onClick={() => onChange("")}
                                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-3">
                        <div className="p-4 bg-white rounded-2xl shadow-sm">
                            {isUploading ? (
                                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                            ) : (
                                <ImageIcon className="h-8 w-8 text-gray-400" />
                            )}
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-bold text-gray-900">
                                {isUploading ? "Uploading..." : "Click to upload image"}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">PNG, JPG or WebP (Max. 5MB)</p>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleUpload}
                            disabled={isUploading}
                            className="absolute inset-0 w-full h-[90%] opacity-0 cursor-pointer"
                        />
                    </div>
                )}
            </div>
            {/* Hidden input to keep form submission compatibility if needed */}
            <input type="hidden" name="imageUrl" value={value} />
        </div>
    );
}
