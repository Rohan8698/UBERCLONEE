"use client";
import { useEffect, useState } from "react";
import { useUser } from '@clerk/nextjs';
import { Star } from "lucide-react";

interface Rating {
  _id: string;
  rating: number;
  review?: string;
  user: { name: string; email: string };
  createdAt: string;
}


export default function DriverRatingsPage() {
  const { user } = useUser();
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) return;
    const driverId = user.id;
    fetch(`http://localhost:5000/api/ratings/driver/${driverId}`)
      .then((res) => res.json())
      .then((data) => {
        // Ensure data is always an array
        if (Array.isArray(data)) {
          setRatings(data);
        } else if (data && Array.isArray(data.ratings)) {
          setRatings(data.ratings);
        } else {
          setRatings([]);
        }
      })
      .catch(() => setMessage("Failed to load ratings"))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black p-4">
      <h1 className="text-2xl font-bold mb-8 text-white tracking-wide drop-shadow">Driver Ratings & Reviews</h1>
      {loading ? (
        <p className="text-cyan-300">Loading...</p>
      ) : !Array.isArray(ratings) || ratings.length === 0 ? (
        <p className="text-gray-400">No ratings found.</p>
      ) : (
        <ul className="w-full max-w-2xl space-y-6">
          {Array.isArray(ratings) && ratings.map((r) => (
            <li key={r._id} className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 flex flex-col gap-2 glass-card">
              <div className="flex items-center gap-2 mb-2">
                {[1,2,3,4,5].map(n => (
                  <Star key={n} size={22} className={n <= r.rating ? "text-yellow-400" : "text-gray-500"} fill={n <= r.rating ? "#facc15" : "none"} />
                ))}
                <span className="ml-2 text-cyan-200 font-semibold">{r.rating} / 5</span>
              </div>
              <div className="text-white/90 text-base mb-1">{r.review || <span className="text-gray-400">No written review.</span>}</div>
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <span>By <span className="font-semibold text-cyan-300">{r.user?.name || "Unknown"}</span> ({r.user?.email})</span>
                <span className="mx-2">•</span>
                <span>{new Date(r.createdAt).toLocaleString()}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
      {message && <p className="mt-6 text-center text-cyan-300 font-semibold">{message}</p>}
    </main>
  );
}
