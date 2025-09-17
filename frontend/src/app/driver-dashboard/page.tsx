"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const DriverRouteMap = dynamic(() => import("./DriverRouteMap"), { ssr: false });

interface Ride {
  _id: string;
  pickupLocation: string;
  dropoffLocation: string;
  status: string;
  rider: { name: string; email: string };
}

export default function DriverDashboard() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [activeRide, setActiveRide] = useState<Ride | null>(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/driver/requests")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRides(data);
        } else {
          setRides([]);
          setMessage("No ride requests available or API error.");
        }
      })
      .catch(() => setMessage("Failed to load ride requests"))
      .finally(() => setLoading(false));
  }, []);

  const handleAction = async (rideId: string, action: "accept" | "decline") => {
    setMessage("");
    // TODO: Replace with actual driverId from Clerk user
    const driverId = "REPLACE_WITH_DRIVER_ID";
    const res = await fetch(`http://localhost:5000/api/driver/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(action === "accept" ? { rideId, driverId } : { rideId }),
    });
    const data = await res.json();
    if (res.ok) {
      if (action === "accept") {
        const accepted = rides.find(r => r._id === rideId) || null;
        setActiveRide(accepted);
      }
      setRides((prev) => prev.filter((r) => r._id !== rideId));
      setMessage(`Ride ${action}ed successfully!`);
    } else {
      setMessage(data.error || `Failed to ${action} ride`);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="text-2xl font-bold mb-4">Driver Dashboard</h1>
      {activeRide ? (
        <div className="w-full max-w-2xl bg-gray-900/90 rounded-3xl shadow-2xl border border-gray-800 p-6 flex flex-col items-center gap-6">
          <h2 className="text-xl font-semibold text-cyan-300 mb-2">Active Ride</h2>
          <div className="w-full flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1">
              <DriverRouteMap pickup={activeRide.pickupLocation} dropoff={activeRide.dropoffLocation} />
            </div>
            <div className="flex-1 flex flex-col gap-2 text-white">
              <div><strong>Pickup:</strong> {activeRide.pickupLocation}</div>
              <div><strong>Dropoff:</strong> {activeRide.dropoffLocation}</div>
              <div><strong>Rider:</strong> {activeRide.rider?.name || "Unknown"} ({activeRide.rider?.email})</div>
              <div className="mt-4">
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded shadow"
                  onClick={async () => {
                    if (!activeRide) return;
                    setMessage("");
                    const res = await fetch("http://localhost:5000/api/driver/start", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ rideId: activeRide._id }),
                    });
                    const data = await res.json();
                    if (res.ok) {
                      setActiveRide({ ...activeRide, status: "enroute" });
                      setMessage("Ride started!");
                    } else {
                      setMessage(data.error || "Failed to start ride");
                    }
                  }}
                >
                  Start Ride
                </button>
                <button className="bg-gray-700 text-white px-4 py-2 rounded shadow ml-2">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      ) : loading ? (
        <p>Loading ride requests...</p>
      ) : rides.length === 0 ? (
        <p>No ride requests available.</p>
      ) : (
        <ul className="w-full max-w-lg space-y-4">
          {rides.map((ride) => (
            <li key={ride._id} className="border rounded p-4 flex flex-col gap-2">
              <div>
                <strong>Pickup:</strong> {ride.pickupLocation}<br />
                <strong>Dropoff:</strong> {ride.dropoffLocation}<br />
                <strong>Rider:</strong> {ride.rider?.name || "Unknown"} ({ride.rider?.email})
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  className="bg-green-600 text-white px-4 py-1 rounded"
                  onClick={() => handleAction(ride._id, "accept")}
                >
                  Accept
                </button>
                <button
                  className="bg-red-600 text-white px-4 py-1 rounded"
                  onClick={() => handleAction(ride._id, "decline")}
                >
                  Decline
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {message && <p className="mt-4 text-center">{message}</p>}
    </main>
  );
}
