"use client";
import React, { useEffect, useState } from "react";
import Script from "next/script";
import nookies from "nookies";
import { useParams, useRouter, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface UserInfo {
  name: string;
  email: string;
  uuid?: string;
}

const RazorPay = ({ amount, type }: any) => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const param = useParams();
  console.log(param,"param");

  const searchParams = useSearchParams();
  console.log(type,"type");
  
  const cartId = searchParams.get("cart_uuid"); // Correct way to extract cart_uuid
  console.log("cartId",cartId)
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const cookies = nookies.get();
    console.log("cookiesUserInfo",cookies.user_info);
    const userInfoFromCookie: UserInfo | null = cookies.user_info
      ? JSON.parse(cookies.user_info)
      : null;
    setUserInfo(userInfoFromCookie);
  }, []);

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch("/api1/create", { method: "POST" });
      const data = await response.json();

      if (!window.Razorpay) {
        console.error("Razorpay SDK not loaded");
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Ensure this is set in .env.local
        amount: amount,
        currency: "INR",
        name: "Wedding",
        description: "Test Transaction",
        order_id: data.orderId,
        handler: async (response: any) => {
          console.log("Payment successful", response);
          
          const paymentId = response.razorpay_payment_id;
          const product_id = param.id;

          console.log("product_id",product_id)
          
          try {
            const paymentResponse = await fetch("https://magshopify.goaideme.com/razorpay/save-payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                cart_uuid: cartId,
                product_id: product_id,
                user_uuid: userInfo?.uuid,
                paymentId: paymentId,
                payment_for: type,
                collection_link:"sdfsrwr"
              }),
            });
            if (!paymentResponse.ok) {
              throw new Error("Payment save failed");
            }

            // Redirect based on type after successful payment
            if (type === "bundle") {
              router.push(`/account/bundles`);
            } else {
              router.push(`/payment/success`);
            }
          } catch (error) {
            console.error("Error saving payment:", error);
          }
        },
        prefill: {
          name: userInfo?.name || "Guest User",
          email: userInfo?.email || "testing@gmail.com",
          contact: "9999999999",
        },
        notes: {
          product_id: param.id,
          user_uuid: userInfo?.uuid,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Payment failed", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <button
        onClick={handlePayment}
        disabled={isProcessing}
        className="mt-6 bg-blue-600 text-blueText w-full py-2 rounded-xl border-2 border-[blueText] hover:bg-blue-700"
      >
        {isProcessing ? "Processing..." : `Pay Now: ${amount} INR`}
      </button>
    </>
  );
};

export default RazorPay;
