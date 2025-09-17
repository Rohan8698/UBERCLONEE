"use client";
import { useState } from "react";
import PaymentWrapper from "./PaymentWrapper";
import PaymentForm from "./PaymentForm";
import RazorpayButton from "./RazorpayButton";
import { useUser, SignInButton } from "@clerk/nextjs";
import dynamic from "next/dynamic";
const LeafletGraphHopperAutocomplete = dynamic(() => import("./LeafletGraphHopperAutocomplete"), { ssr: false });
const RideOptionsSelector = dynamic(() => import("./RideOptionsSelector"), { ssr: false });


export default function BookRidePage() {
  const { user, isSignedIn } = useUser();
  if (!isSignedIn) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white">
        <h2 className="text-3xl font-bold mb-4">Sign in to book a ride</h2>
        <SignInButton mode="modal">
          <button className="bg-cyan-400 text-black font-bold px-6 py-3 rounded-full shadow-lg hover:bg-cyan-300 transition">Sign In</button>
        </SignInButton>
      </main>
    );
  }
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string; fare?: number } | null>(null);
  const [rideType, setRideType] = useState<string>("Economy");
  const [paymentComplete, setPaymentComplete] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      if (!user) {
        setMessage("You must be signed in to book a ride.");
        setLoading(false);
        return;
      }
      const riderId = user.id;
      const res = await fetch("http://localhost:5000/api/rides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ riderId, pickupLocation: pickup, dropoffLocation: dropoff, rideType }),
      });
      let data = {};
      try {
        data = await res.json();
      } catch (jsonErr) {
        setMessage("Invalid response from server");
        setLoading(false);
        return;
      }
      if (res.ok) {
        setMessage("Ride requested successfully!");
        setPickup("");
        setDropoff("");
        setRouteInfo(null);
        setPaymentComplete(false);
      } else {
        const errorMsg = (data as any).error;
        setMessage(errorMsg ? errorMsg : `Failed to request ride. Status: ${res.status}`);
        console.error("Ride request error:", data);
      }
    } catch (err) {
      setMessage("Error requesting ride: " + (err instanceof Error ? err.message : String(err)));
      console.error("Ride request exception:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black flex flex-col">
      {/* Full-screen map */}
      <div className="absolute inset-0 z-0">
        <LeafletGraphHopperAutocomplete
          pickup={pickup}
          setPickup={setPickup}
          dropoff={dropoff}
          setDropoff={setDropoff}
          onRoute={setRouteInfo}
        />
      </div>
      {/* Neumorphic bottom sheet */}
      <div className="absolute left-1/2 bottom-0 z-10 w-full max-w-xl -translate-x-1/2 pb-6 px-2">
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/90 rounded-3xl shadow-2xl border border-gray-800 p-8 flex flex-col items-center gap-6 neumorphism backdrop-blur-xl transition-all duration-300">
          <div className="w-12 h-1.5 bg-cyan-400/40 rounded-full mb-2 animate-pulse" />
          <h2 className="text-2xl font-extrabold text-white mb-2 tracking-wide drop-shadow">Book a Ride</h2>
          {/* Ride Options Selector */}
          <RideOptionsSelector onSelect={setRideType} selectedType={rideType} />
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            <input
              type="text"
              placeholder="Pickup Location"
              value={pickup}
              onChange={e => setPickup(e.target.value)}
              className="bg-gray-800/80 border-none rounded-xl px-4 py-3 text-white placeholder-cyan-300 focus:ring-2 focus:ring-cyan-400 outline-none shadow-inner glass-card transition-all duration-200"
              required
            />
            <input
              type="text"
              placeholder="Dropoff Location"
              value={dropoff}
              onChange={e => setDropoff(e.target.value)}
              className="bg-gray-800/80 border-none rounded-xl px-4 py-3 text-white placeholder-cyan-300 focus:ring-2 focus:ring-cyan-400 outline-none shadow-inner glass-card transition-all duration-200"
              required
            />
            <button
              type="submit"
              className={`mt-2 bg-cyan-400 hover:bg-cyan-300 text-black font-bold rounded-full py-3 transition-all duration-200 shadow-lg text-lg tracking-wide disabled:opacity-50 ${loading ? 'animate-pulse' : ''}`}
              disabled={loading || !pickup || !dropoff}
            >
              {loading ? <span className="animate-spin">⏳</span> : "Book Ride"}
            </button>
          </form>
          {/* Show route info and payment only if both pickup and dropoff are filled and routeInfo is available */}
          {pickup && dropoff && routeInfo && (
            <div className="mt-4 w-full flex flex-col items-center">
              <div className="mb-2 text-center bg-gray-800/80 rounded-xl px-4 py-2 w-full glass-card">
                <p className="text-base font-semibold text-cyan-300">Route Info</p>
                <p className="text-cyan-100">Distance: <span className="font-medium">{routeInfo.distance}</span></p>
                <p className="text-cyan-100">Estimated Time: <span className="font-medium">{routeInfo.duration}</span></p>
                {(() => {
                  const km = parseFloat(routeInfo.distance);
                  if (!isNaN(km)) {
                    const fare = Math.round(km * 7);
                    return <p className="text-cyan-100">Estimated Fare: <span className="font-medium">₹{fare}</span></p>;
                  }
                  return null;
                })()}
              </div>
            </div>
          )}
          {message && <p className="mt-2 text-center text-red-400 text-sm animate-pulse">{message}</p>}
        </div>
      </div>
    </main>
  );
}
