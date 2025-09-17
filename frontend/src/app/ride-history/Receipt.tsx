import React from "react";

interface ReceiptProps {
  ride: {
    _id: string;
    pickupLocation: string;
    dropoffLocation: string;
    fare?: number;
    requestedAt: string;
    completedAt?: string;
    driver: { name: string; email: string };
  };
}

export default function Receipt({ ride }: ReceiptProps) {
  return (
    <div className="p-4 border rounded bg-white">
      <h2 className="text-lg font-bold mb-2">Ride Receipt</h2>
      <div><strong>Ride ID:</strong> {ride._id}</div>
      <div><strong>Pickup:</strong> {ride.pickupLocation}</div>
      <div><strong>Dropoff:</strong> {ride.dropoffLocation}</div>
      <div><strong>Fare:</strong> {ride.fare ? `$${ride.fare}` : "N/A"}</div>
      <div><strong>Requested:</strong> {new Date(ride.requestedAt).toLocaleString()}</div>
      {ride.completedAt && <div><strong>Completed:</strong> {new Date(ride.completedAt).toLocaleString()}</div>}
      <div><strong>Driver:</strong> {ride.driver?.name || "Unknown"} ({ride.driver?.email})</div>
    </div>
  );
}
