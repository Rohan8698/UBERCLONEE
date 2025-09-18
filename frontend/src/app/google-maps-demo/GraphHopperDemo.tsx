
"use client";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function GraphHopperDemo() {
  const mapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!mapRef.current) return;
    // Prevent duplicate map initialization
    if ((mapRef.current as any)._leaflet_id) return;
    const map = L.map(mapRef.current).setView([37.7749, -122.4194], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Example: GraphHopper route from A to B
    const start = [-122.4194, 37.7749]; // lng, lat (San Francisco)
    const end = [-122.431297, 37.773972]; // lng, lat (another point)
    const apiKey = "ac8bb813-de86-49fd-8a86-9edbc8798534";
    fetch(
      `https://graphhopper.com/api/1/route?point=${start[1]},${start[0]}&point=${end[1]},${end[0]}&vehicle=car&locale=en&points_encoded=false&key=${apiKey}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.paths && data.paths.length > 0) {
          const coords = data.paths[0].points.coordinates.map((c: [number, number]) => [c[1], c[0]]);
          L.polyline(coords, { color: "blue" }).addTo(map);
          L.marker(coords[0]).addTo(map);
          L.marker(coords[coords.length - 1]).addTo(map);
        }
      });
    return () => {
      map.remove();
    };
  }, []);

  return (
    <main className="flex flex-col items-center p-8">
      <h1 className="text-2xl font-bold mb-4">GraphHopper Route Demo</h1>
      <div ref={mapRef} style={{ width: "100%", maxWidth: 800, height: 400, borderRadius: 12, overflow: 'hidden' }}></div>
      <p className="mt-4">This demo uses GraphHopper for routing and OpenStreetMap for map tiles.</p>
    </main>
  );
}
