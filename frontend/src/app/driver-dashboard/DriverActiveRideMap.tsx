import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const LeafletGraphHopperAutocomplete = dynamic(() => import("../book-ride/LeafletGraphHopperAutocomplete"), { ssr: false });

interface Ride {
  _id: string;
  pickupLocation: string;
  dropoffLocation: string;
  status: string;
  rider: { name: string; email: string };
}

export default function DriverActiveRideMap({ pickup, dropoff }: { pickup: string; dropoff: string }) {
  // Reuse the map component for route display only
  return (
    <div className="w-full h-96 rounded-2xl overflow-hidden border border-gray-700 shadow-xl">
      <LeafletGraphHopperAutocomplete
        pickup={pickup}
        setPickup={() => {}}
        dropoff={dropoff}
        setDropoff={() => {}}
        onRoute={() => {}}
        readOnly={true}
      />
    </div>
  );
}
