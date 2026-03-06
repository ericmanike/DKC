'use client'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import { MapPin, Phone } from "lucide-react";

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
                amount: (parseFloat(price) * 100),
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
