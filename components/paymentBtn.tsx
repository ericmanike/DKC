'use client'

import { useEffect } from "react"

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

interface props {

}


export const PaymentBtn = ({ email, id, price }: any) => {

    const loadPaystackScript = () => {
        const script = document.createElement('script')
        script.src = 'https://js.paystack.co/v1/inline.js'
        script.async = true
        document.body.appendChild(script)
    }

    useEffect(() => {
        loadPaystackScript()

    },
        [])



    const handlePayment = async () => {
        if (!window.PaystackPop) {
            console.log('Paystack script not loaded')
            return

        }
        console.log('Initiating payment for the product:', { email, price, id });


        if (!email || !price || !id) {
            console.log('Missing required payment information:', { email, price, id })
            return
        }

        try {
            // Generate a unique reference
            const reference = `${Date.now()}`

            // Initialize Paystack
            const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY

            if (!paystackKey) {

                return
            }
            const handler = window.PaystackPop.setup({
                key: paystackKey,
                email: email,
                currency: 'GHS',
                amount:( parseFloat(price) * 100), // Convert to kobo

                ref: reference,
                onClose: () => {

                },
                callback: function (response) {
                    (async () => {
                        try {
                            const verifyResponse = await fetch('/api/payments/verify', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ reference: response.reference }),
                            });

                            if (verifyResponse.ok) {
                                console.log('Payment verified');

                            } else {
                                console.log('Payment verification failed');
                            }
                        } catch (err) {
                            console.error('Error verifying payment', err);
                        } finally {

                        }
                    })();
                },

            })

            handler.openIframe()
        } catch (error) {
            console.log('Error initializing payment:', error)

        }
    }


    return (
        <>
            <button
                className="w-full mt-4 bg-orange-600 text-white 
                            font-bold py-3 rounded-xl 
                            hover:bg-orange-700 transition-all shadow-lg
                            active:scale-95 disabled:opacity-50
                             disabled:cursor-not-allowed cursor-pointer" onClick={() => handlePayment()}>
                Buy Now
            </button>
        </>
    )



}