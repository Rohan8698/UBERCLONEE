import { useState } from "react";

interface PaymentFormProps {
  amount: number;
  onSuccess: () => void;
}

export default function PaymentForm({ amount, onSuccess }: PaymentFormProps) {
  // TODO: Implement Razorpay payment logic here
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRazorpayPayment = async () => {
    setLoading(true);
    setError("");
    // Integrate Razorpay payment flow here
    // On success, call onSuccess();
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Razorpay payment button placeholder */}
      <button
        onClick={handleRazorpayPayment}
        className="bg-cyan-400 hover:bg-cyan-300 text-black font-bold rounded-full py-3 transition-all duration-200 shadow-lg text-lg tracking-wide disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Processing..." : `Pay ₹${amount} with Razorpay`}
      </button>
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  );
}
