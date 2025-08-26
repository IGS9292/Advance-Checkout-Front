import axios from "axios";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const baseUrl = import.meta.env.VITE_API_BASE;

// Dynamically load Razorpay SDK
async function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

type CheckoutOptions = {
  planId: number;
  shopId: number;
  amount: number;
  onSuccess: () => void;
  onFailure?: () => void;
};

export default async function RazorpayCheckout({
  planId,
  shopId,
  amount,
  onSuccess,
  onFailure
}: CheckoutOptions) {
  try {
    // 1️⃣ create order from backend
    const { data } = await axios.post(`${baseUrl}/v1/razorpay/create-order`, {
      planId,
      shopId,
      amount
    });
    if (!data.success) throw new Error("Order creation failed");

    // 2️⃣ load SDK
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      console.error("Razorpay SDK failed to load");
      onFailure?.();
      return;
    }

    // 3️⃣ open checkout
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, // public key
      amount: data.order.amount,
      currency: "INR",
      description: "Plan Upgrade",
      order_id: data.order.id,
      prefill: { email: "customer@example.com", contact: "9999999999" },
      theme: { color: "#3399cc" },
      config: {
        display: {
          blocks: {
            all_methods: {
              name: "All Payment Options",
              instruments: [
                { method: "upi" },
                { method: "card" },
                { method: "netbanking" },
                { method: "wallet" }
              ]
            }
          },
          sequence: ["block.all_methods"],
          preferences: { show_default_blocks: false }
        }
      },
      handler: async (response: any) => {
        try {
          const verifyRes = await axios.post(
            `${baseUrl}/v1/razorpay/verify-payment`,
            { ...response, planId, shopId }
          );
          if (verifyRes.data.success) onSuccess();
          else onFailure?.();
        } catch (err) {
          console.error("Payment verification failed", err);
          onFailure?.();
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
    console.error("Checkout failed:", err);
    onFailure?.();
  }
}
