import { useState } from "react";

export default function RazorpayButton({ amount, onSuccess }: { amount: number; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePay = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/razorpay/create-razorpay-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      if (!res.ok || !data.orderId || !data.key) {
        setError(data.error || "Failed to create Razorpay order");
        setLoading(false);
        return;
      }
      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "Ryde",
        description: "Ride Payment",
        order_id: data.orderId,
        handler: function (response: any) {
          onSuccess();
        },
        prefill: {},
        theme: { color: "#06b6d4" },
      };
      // @ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setError(err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full py-3 px-8 transition-all duration-200 shadow-lg text-lg tracking-wide disabled:opacity-50"
        onClick={handlePay}
        disabled={loading}
      >
        {loading ? "Processing..." : `Pay with Razorpay (₹${amount})`}
      </button>
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  );
}
