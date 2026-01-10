import { useCallback } from "react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  handler: (response: RazorpayResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface PaymentData {
  razorpayOrderId: string;
  razorpayKey: string;
  amount: number;
  currency: string;
  orderId: string;
}

export const useRazorpay = () => {
  const openRazorpay = useCallback(
    (
      paymentData: PaymentData,
      prefill: { name?: string; email?: string; phone?: string },
      onSuccess: (response: RazorpayResponse) => void,
      onDismiss?: () => void
    ) => {
      if (!window.Razorpay) {
        console.error("Razorpay SDK not loaded");
        return;
      }

      const options: RazorpayOptions = {
        key: paymentData.razorpayKey,
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
        handler: onSuccess,
        modal: {
          ondismiss: onDismiss,
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    },
    []
  );

  return { openRazorpay };
};
