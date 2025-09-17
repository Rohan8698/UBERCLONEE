import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";

interface PaymentFormProps {
  amount: number;
  onSuccess: () => void;
}

export default function PaymentForm({ amount, onSuccess }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (!stripe || !elements) {
      setError("Stripe not loaded");
      setLoading(false);
      return;
    }
    // Create payment intent on backend
    const res = await fetch("http://localhost:5000/api/payments/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Math.round(amount * 100), currency: "inr" }),
    });
    const data = await res.json();
    if (!res.ok || !data.clientSecret) {
      setError(data.error || "Failed to create payment intent");
      setLoading(false);
      return;
    }
    const result = await stripe.confirmCardPayment(data.clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!,
      },
    });
    if (result.error) {
      setError(result.error.message || "Payment failed");
    } else if (result.paymentIntent?.status === "succeeded") {
      onSuccess();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <CardElement className="bg-gray-800/80 p-3 rounded-xl text-white" options={{ style: { base: { color: '#fff' } } }} />
      <button
        type="submit"
        className="bg-cyan-400 hover:bg-cyan-300 text-black font-bold rounded-full py-3 transition-all duration-200 shadow-lg text-lg tracking-wide disabled:opacity-50"
        disabled={loading || !stripe}
      >
        {loading ? "Processing..." : `Pay ₹${amount}`}
      </button>
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </form>
  );
}
