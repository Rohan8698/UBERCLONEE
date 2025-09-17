"use client";
import { useEffect, useRef, useState } from "react";
import { CarFront } from "lucide-react";

interface Ride {
  _id: string;
  pickupLocation: string;
  dropoffLocation: string;
  status: string;
  fare?: number;
  requestedAt: string;
  completedAt?: string;
  rider: { name: string; email: string };
  driver: { name: string; email: string };
}

export default function RideHistoryPage() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // TODO: Replace with actual userId from Clerk
    const userId = "REPLACE_WITH_USER_ID";
    fetch(`http://localhost:5000/api/history/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        // Ensure data is always an array
        if (Array.isArray(data)) {
          setRides(data);
        } else if (data && Array.isArray(data.rides)) {
          setRides(data.rides);
        } else {
          setRides([]);
        }
      })
      .catch(() => setMessage("Failed to load ride history"))
      .finally(() => setLoading(false));
  }, []);

  // Print/download receipt for a ride
  const printReceipt = (ride: Ride) => {
    const printWindow = window.open('', '', 'width=600,height=600');
    if (!printWindow) return;
    printWindow.document.write('<html><head><title>Ride Receipt</title>');
    printWindow.document.write('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">');
    printWindow.document.write('</head><body>');
    printWindow.document.write(`<div style="padding:24px;max-width:400px;margin:auto;">`);
    printWindow.document.write(`<h2 class='text-lg font-bold mb-2'>Ride Receipt</h2>`);
    printWindow.document.write(`<div><strong>Ride ID:</strong> ${ride._id}</div>`);
    printWindow.document.write(`<div><strong>Pickup:</strong> ${ride.pickupLocation}</div>`);
    printWindow.document.write(`<div><strong>Dropoff:</strong> ${ride.dropoffLocation}</div>`);
    printWindow.document.write(`<div><strong>Fare:</strong> ${ride.fare ? `$${ride.fare}` : 'N/A'}</div>`);
    printWindow.document.write(`<div><strong>Requested:</strong> ${new Date(ride.requestedAt).toLocaleString()}</div>`);
    if (ride.completedAt) printWindow.document.write(`<div><strong>Completed:</strong> ${new Date(ride.completedAt).toLocaleString()}</div>`);
    printWindow.document.write(`<div><strong>Driver:</strong> ${ride.driver?.name || 'Unknown'} (${ride.driver?.email})</div>`);
    printWindow.document.write('</div></body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-100 p-4">
      <h1 className="text-2xl font-bold mb-8 text-gray-900 tracking-wide drop-shadow">Your Trip History</h1>
      {loading ? (
        <p className="text-cyan-700">Loading...</p>
      ) : !Array.isArray(rides) || rides.length === 0 ? (
        <div className="w-full max-w-2xl flex flex-col gap-8 relative">
          <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-200 via-blue-200 to-purple-200 rounded-full opacity-60 z-0" />
          {/* Example ride history */}
          {[{
            _id: "sample1",
            pickupLocation: "MG Road",
            dropoffLocation: "Airport",
            status: "Completed",
            fare: 420,
            requestedAt: new Date(Date.now() - 86400000).toISOString(),
            completedAt: new Date(Date.now() - 86300000).toISOString(),
            rider: { name: "You", email: "user@ryde.com" },
            driver: { name: "Amit Singh", email: "amit@ryde.com" }
          }, {
            _id: "sample2",
            pickupLocation: "Koramangala",
            dropoffLocation: "Whitefield",
            status: "Completed",
            fare: 350,
            requestedAt: new Date(Date.now() - 172800000).toISOString(),
            completedAt: new Date(Date.now() - 172700000).toISOString(),
            rider: { name: "You", email: "user@ryde.com" },
            driver: { name: "Priya Rao", email: "priya@ryde.com" }
          }].map((ride, idx, arr) => (
            <li key={ride._id} className="relative flex gap-6 items-start z-10">
              <div className="flex flex-col items-center">
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-300 to-purple-300 flex items-center justify-center shadow-lg">
                  <CarFront size={18} className="text-white" />
                </span>
                {idx !== arr.length - 1 && <span className="flex-1 w-1 bg-gradient-to-b from-cyan-200 via-blue-200 to-purple-200 opacity-60" />}
              </div>
              <div className="flex-1 bg-white/80 rounded-2xl shadow-xl border border-cyan-100 p-6 flex flex-col gap-2">
                <div className="flex flex-wrap gap-2 items-center mb-1">
                  <span className="font-bold text-cyan-700">{ride.pickupLocation}</span>
                  <span className="text-gray-400">→</span>
                  <span className="font-bold text-purple-700">{ride.dropoffLocation}</span>
                  <span className="ml-auto text-xs text-gray-500">{new Date(ride.requestedAt).toLocaleString()}</span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                  <span>Status: <span className="font-semibold text-cyan-600">{ride.status}</span></span>
                  <span>Fare: <span className="font-semibold text-purple-600">₹{ride.fare ? `₹${ride.fare}` : "N/A"}</span></span>
                  {ride.completedAt && <span>Completed: <span className="font-semibold">{new Date(ride.completedAt).toLocaleString()}</span></span>}
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-1">
                  <span>Driver: <span className="font-semibold text-cyan-700">{ride.driver?.name || "Unknown"}</span> ({ride.driver?.email})</span>
                </div>
                <button
                  className="mt-3 bg-gradient-to-r from-cyan-400 to-purple-400 text-white px-4 py-2 rounded-full shadow hover:from-cyan-500 hover:to-purple-500 transition-all w-max"
                  onClick={() => printReceipt(ride)}
                >
                  Download Receipt
                </button>
              </div>
            </li>
          ))}
        </div>
      ) : (
        <ul className="w-full max-w-2xl flex flex-col gap-8 relative">
          {/* Timeline vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-200 via-blue-200 to-purple-200 rounded-full opacity-60 z-0" />
          {Array.isArray(rides) && rides.map((ride, idx) => (
            <li key={ride._id} className="relative flex gap-6 items-start z-10">
              {/* Timeline dot and icon */}
              <div className="flex flex-col items-center">
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-300 to-purple-300 flex items-center justify-center shadow-lg">
                  <CarFront size={18} className="text-white" />
                </span>
                {idx !== rides.length - 1 && <span className="flex-1 w-1 bg-gradient-to-b from-cyan-200 via-blue-200 to-purple-200 opacity-60" />}
              </div>
              {/* Card */}
              <div className="flex-1 bg-white/80 rounded-2xl shadow-xl border border-cyan-100 p-6 flex flex-col gap-2">
                <div className="flex flex-wrap gap-2 items-center mb-1">
                  <span className="font-bold text-cyan-700">{ride.pickupLocation}</span>
                  <span className="text-gray-400">→</span>
                  <span className="font-bold text-purple-700">{ride.dropoffLocation}</span>
                  <span className="ml-auto text-xs text-gray-500">{new Date(ride.requestedAt).toLocaleString()}</span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                  <span>Status: <span className="font-semibold text-cyan-600">{ride.status}</span></span>
                  <span>Fare: <span className="font-semibold text-purple-600">{ride.fare ? `₹${ride.fare}` : "N/A"}</span></span>
                  {ride.completedAt && <span>Completed: <span className="font-semibold">{new Date(ride.completedAt).toLocaleString()}</span></span>}
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-1">
                  <span>Driver: <span className="font-semibold text-cyan-700">{ride.driver?.name || "Unknown"}</span> ({ride.driver?.email})</span>
                </div>
                <button
                  className="mt-3 bg-gradient-to-r from-cyan-400 to-purple-400 text-white px-4 py-2 rounded-full shadow hover:from-cyan-500 hover:to-purple-500 transition-all w-max"
                  onClick={() => printReceipt(ride)}
                >
                  Download Receipt
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {message && <p className="mt-8 text-center text-cyan-700 font-semibold">{message}</p>}
    </main>
  );
}
