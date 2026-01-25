"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ShoppingCart, Loader2 } from "lucide-react";

interface BuyButtonProps {
    productId: string;
}

export function BuyButton({ productId }: BuyButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { data: session } = useSession();
    const router = useRouter();

    const handlePurchase = async () => {
        if (!session) {
            toast.error("Please login to purchase");
            router.push("/auth/login");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Purchase failed");
            }

            toast.success("Thank you for your purchase!");
            router.push("/dashboard");
            router.refresh();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handlePurchase}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
        >
            {isLoading ? (
                <Loader2 className="animate-spin h-5 w-5" />
            ) : (
                <>
                    <ShoppingCart className="h-5 w-5" />
                    Purchase Now
                </>
            )}
        </button>
    );
}
