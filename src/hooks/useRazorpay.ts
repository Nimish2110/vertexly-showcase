import { useCallback, useState } from "react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface PaymentData {
  orderId: string;
  razorpayOrderId: string;
  key: string;
  amount: number;
  currency: string;
}

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const useRazorpay = () => {
  const [isLoading, setIsLoading] = useState(false);

  const openRazorpay = useCallback(
    async (
      paymentData: PaymentData,
      prefill: { name?: string; email?: string; phone?: string },
      onSuccess: (response: RazorpayResponse) => void,
      onDismiss?: () => void
    ) => {
      setIsLoading(true);

      const scriptLoaded = await loadRazorpayScript();
      
      if (!scriptLoaded || !window.Razorpay) {
        console.error("Razorpay SDK failed to load");
        setIsLoading(false);
        onDismiss?.();
        return;
      }

      const options = {
        key: paymentData.key,
        amount: paymentData.amount,
        currency: paymentData.currency || "INR",
        name: "Vertexly",
        description: "Website Template Payment",
        order_id: paymentData.razorpayOrderId,
        prefill: {
          name: prefill.name || "",
          email: prefill.email || "",
          contact: prefill.phone || "",
        },
        theme: {
          color: "#6a5ae0",
        },
        handler: (response: RazorpayResponse) => {
          setIsLoading(false);
          onSuccess(response);
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
            onDismiss?.();
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    },
    []
  );

  return { openRazorpay, isLoading };
};
