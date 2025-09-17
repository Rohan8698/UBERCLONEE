"use client";
import { useState } from "react";
import { Star } from "lucide-react";
import { useUser } from '@clerk/nextjs';


// In a real app, rideId and driverId would come from props, router, or context
const rideId = "REPLACE_WITH_RIDE_ID";
const driverId = "REPLACE_WITH_DRIVER_ID";

export default function RateDriverPage() {
  const { user } = useUser();
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      if (!user) {
        setMessage("You must be signed in to rate a driver.");
        setLoading(false);
        return;
      }
      const res = await fetch("http://localhost:5000/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ride: rideId, user: user.id, driver: driverId, rating, review }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Thank you for your feedback!");
        setReview("");
        setRating(5);
      } else {
        setMessage(data.error || "Failed to submit rating");
      }
    } catch (err) {
      setMessage("Error submitting rating");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 w-full max-w-md flex flex-col items-center glass-card">
        <h1 className="text-2xl font-bold mb-6 text-white tracking-wide drop-shadow">Rate Your Driver</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
          <div className="flex items-center justify-center gap-2 mb-2">
            {[1,2,3,4,5].map(n => (
              <button
                type="button"
                key={n}
                onClick={() => setRating(n)}
                className="focus:outline-none"
              >
                <Star size={32} className={n <= rating ? "text-yellow-400 drop-shadow" : "text-gray-500"} fill={n <= rating ? "#facc15" : "none"} />
              </button>
            ))}
          </div>
          <textarea
            placeholder="Write a review (optional)"
            value={review}
            onChange={e => setReview(e.target.value)}
            className="bg-gray-900/70 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 outline-none shadow-inner min-h-[100px]"
            maxLength={300}
          />
          <button
            type="submit"
            className="bg-cyan-400 hover:bg-cyan-300 text-black font-bold rounded-full py-3 transition-all duration-200 shadow-lg text-lg tracking-wide disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Rating"}
          </button>
        </form>
        {message && <p className="mt-4 text-center text-cyan-300 font-semibold">{message}</p>}
      </div>
    </main>
  );
}
