"use client";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const defaultCenter = [28.6139, 77.2090]; // New Delhi

export default function LeafletGraphHopperAutocomplete({
  pickup,
  setPickup,
  dropoff,
  setDropoff,
  onRoute,
}: {
  pickup: string;
  setPickup: (val: string) => void;
  dropoff: string;
  setDropoff: (val: string) => void;
  onRoute: (route: { distance: string; duration: string }) => void;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const [pickupPos, setPickupPos] = useState<[number, number] | null>(null);
  const [dropoffPos, setDropoffPos] = useState<[number, number] | null>(null);
  const [routeLine, setRouteLine] = useState<L.Polyline | null>(null);

  // Geocode address to lat/lng using GraphHopper
  const geocode = async (query: string) => {
    const apiKey = "ac8bb813-de86-49fd-8a86-9edbc8798534";
    const url = `https://graphhopper.com/api/1/geocode?q=${encodeURIComponent(query)}&limit=1&key=${apiKey}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.hits && data.hits.length > 0) {
        return [data.hits[0].point.lat, data.hits[0].point.lng];
      } else {
        console.error("Geocode: No results for", query, data);
      }
    } catch (err) {
      console.error("Geocode error:", err);
    }
    return null;
  };

  // Get route from GraphHopper
  const getRoute = async (from: [number, number], to: [number, number]) => {
    const apiKey = "ac8bb813-de86-49fd-8a86-9edbc8798534";
    const url = `https://graphhopper.com/api/1/route?point=${from[0]},${from[1]}&point=${to[0]},${to[1]}&vehicle=car&locale=en&points_encoded=false&key=${apiKey}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.paths && data.paths.length > 0) {
        const coords = data.paths[0].points.coordinates.map((c: [number, number]) => [c[1], c[0]]);
        return {
          coords,
          distance: (data.paths[0].distance / 1000).toFixed(2) + " km",
          duration: Math.round(data.paths[0].time / 60000) + " min",
        };
      } else {
        console.error("Route: No route found", data);
      }
    } catch (err) {
      console.error("Route error:", err);
    }
    return null;
  };

  // Initialize map
  useEffect(() => {
    if (mapRef.current && !leafletMapRef.current) {
      leafletMapRef.current = L.map(mapRef.current).setView(defaultCenter, 12);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(leafletMapRef.current);
    }
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Update markers and route
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map) return;
    map.eachLayer(layer => {
      if ((layer as any).options && (layer as any).options.pane === "markerPane") {
        map.removeLayer(layer);
      }
    });
    if (pickupPos) L.marker([pickupPos[0], pickupPos[1]], { title: "Pickup" }).addTo(map);
    if (dropoffPos) L.marker([dropoffPos[0], dropoffPos[1]], { title: "Dropoff" }).addTo(map);
    if (pickupPos && dropoffPos) {
      getRoute(pickupPos, dropoffPos).then(route => {
        if (route) {
          if (routeLine) map.removeLayer(routeLine);
          const poly = L.polyline(route.coords, { color: "blue" }).addTo(map);
          setRouteLine(poly);
          onRoute({ distance: route.distance, duration: route.duration });
        }
      });
    } else {
      if (routeLine) {
        map.removeLayer(routeLine);
        setRouteLine(null);
      }
    }
    // eslint-disable-next-line
  }, [pickupPos, dropoffPos]);


  // Geocode both pickup and dropoff automatically as soon as both fields are filled
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (pickup && dropoff) {
        Promise.all([geocode(pickup), geocode(dropoff)]).then(([pickupResult, dropoffResult]) => {
          if (pickupResult) setPickupPos(pickupResult as [number, number]);
          if (dropoffResult) setDropoffPos(dropoffResult as [number, number]);
        });
      } else {
        if (!pickup) setPickupPos(null);
        if (!dropoff) setDropoffPos(null);
      }
    }, 500);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line
  }, [pickup, dropoff]);

  return (
    <div style={{ position: "relative", width: "100%", height: 350 }}>
      <input
        type="text"
        placeholder="Pickup Location"
        value={pickup}
        onChange={e => setPickup(e.target.value)}
        className="border p-2 rounded absolute left-2 top-2 z-10 w-64 bg-white"
        style={{ marginBottom: 8 }}
      />
      <input
        type="text"
        placeholder="Dropoff Location"
        value={dropoff}
        onChange={e => setDropoff(e.target.value)}
        className="border p-2 rounded absolute left-2 top-14 z-10 w-64 bg-white"
      />
      <div ref={mapRef} style={{ width: "100%", height: 350, borderRadius: 8 }} />
    </div>
  );
}
