'use client'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import { MapPin, Phone, Info } from "lucide-react";
import { formatPrice } from "@/lib/utils";

declare global {
    interface Window {
        PaystackPop: {
            setup: (options: {
                key: string
                email: string
                currency: string
                amount: number
                ref: string
                onClose: () => void
                callback: (response: { reference: string }) => void
            }) => {
                openIframe: () => void
            }
        }
    }
}

export const PaymentBtn = ({ email, id, price, productType }: any) => {
    const router = useRouter();
    const [phoneNumber, setPhoneNumber] = useState("");
    const [location, setLocation] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const basePrice = parseFloat(price);
    const charge = basePrice * 0.02;
    const total = basePrice + charge;

    const loadPaystackScript = () => {
        const script = document.createElement('script')
        script.src = 'https://js.paystack.co/v1/inline.js'
        script.async = true
        document.body.appendChild(script)
    }

    useEffect(() => {
        loadPaystackScript()
    }, [])

    const handlePayment = async () => {
        if (!email) {
            alert("Please login to proceed with purchase.");
            router.push(`/auth/login?callbackUrl=/shop/${id}`);
            return;
        }

        if (!phoneNumber || !location) {
            alert("Please provide your phone number and delivery location.");
            return;
        }

        if (!window.PaystackPop) {
            alert('Payment system is loading, please try again in a moment');
            return
        }

        setIsSubmitting(true);

        try {
            const reference = `${Date.now()}`
            const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY

            if (!paystackKey) {
                setIsSubmitting(false);
                return
            }

            const handler = window.PaystackPop.setup({
                key: paystackKey,
                email: email,
                currency: 'GHS',
                amount: Math.round(total * 100),
                ref: reference,
                onClose: () => {
                    setIsSubmitting(false);
                },
                callback: function (response) {
                    (async () => {
                        try {
                            const verifyResponse = await fetch('/api/checkout', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    reference: response.reference,
                                    productId: id,
                                    phoneNumber,
                                    location
                                }),
                            });

                            if (verifyResponse.ok) {
                                router.push('/dashboard');
                            } else {
                                alert('Payment verification failed. Please contact support.');
                            }
                        } catch (err) {
                            console.error('Error verifying payment', err);
                        } finally {
                            setIsSubmitting(false);
                        }
                    })();
                },
            })

            handler.openIframe()
        } catch (error) {
            console.log('Error initializing payment:', error)
            setIsSubmitting(false);
        }
    }

    return (
        <div className="space-y-4 pt-4 border-t border-gray-100 mt-6">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Delivery Information</p>

            <div className="space-y-3">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-500 transition-colors">
                        <Phone size={16} />
                    </div>
                    <input
                        type="tel"
                        placeholder="Phone Number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
                    />
                </div>

                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-500 transition-colors">
                        <MapPin size={16} />
                    </div>
                    <input
                        type="text"
                        placeholder="Delivery Location / Address"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
                    />
                </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 space-y-2 border border-gray-100">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium text-gray-900">{formatPrice(basePrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-1.5 text-gray-500">
                        <span>Charges (2%)</span>
                        <div className="group relative">
                            <Info size={12} className="cursor-help" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-gray-900 text-white text-[10px] rounded shadow-xl z-20 text-center leading-tight">
                                Transaction processing and convenience fee
                            </div>
                        </div>
                    </div>
                    <span className="font-medium text-orange-600">+{formatPrice(charge)}</span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-900">Total to Pay</span>
                    <span className="text-lg font-black text-gray-900">{formatPrice(total)}</span>
                </div>
            </div>

            <button
                disabled={isSubmitting}
                className="w-full mt-4 bg-orange-600 text-white 
                            font-bold py-3.5 rounded-xl 
                            hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20
                            active:scale-[0.98] disabled:opacity-70
                            disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                onClick={handlePayment}
            >
                {isSubmitting ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                    </>
                ) : (
                    "Complete Purchase"
                )}
            </button>
        </div>
    )
}
