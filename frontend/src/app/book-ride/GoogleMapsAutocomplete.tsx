"use client";
import React, { useRef, useState } from "react";
import { GoogleMap, LoadScript, Marker, DirectionsRenderer, Autocomplete } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "350px",
};

const defaultCenter = { lat: 28.6139, lng: 77.2090 }; // Default: New Delhi

export default function GoogleMapsAutocomplete({
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
  onRoute: (route: any) => void;
}) {
  const [pickupPos, setPickupPos] = useState<google.maps.LatLngLiteral | null>(null);
  const [dropoffPos, setDropoffPos] = useState<google.maps.LatLngLiteral | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const pickupRef = useRef<google.maps.places.Autocomplete | null>(null);
  const dropoffRef = useRef<google.maps.places.Autocomplete | null>(null);

  const handlePlaceChanged = async (type: "pickup" | "dropoff") => {
    const ref = type === "pickup" ? pickupRef.current : dropoffRef.current;
    if (ref) {
      const place = ref.getPlace();
      if (place && place.geometry && place.geometry.location) {
        const pos = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        if (type === "pickup") {
          setPickup(place.formatted_address || "");
          setPickupPos(pos);
        } else {
          setDropoff(place.formatted_address || "");
          setDropoffPos(pos);
        }
      }
    }
  };

  React.useEffect(() => {
    if (pickupPos && dropoffPos) {
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: pickupPos,
          destination: dropoffPos,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK" && result) {
            setDirections(result);
            onRoute(result);
          }
        }
      );
    }
  }, [pickupPos, dropoffPos]);

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""} libraries={["places"]}>
      <GoogleMap mapContainerStyle={containerStyle} center={pickupPos || dropoffPos || defaultCenter} zoom={12}>
        <Autocomplete
          onLoad={ref => (pickupRef.current = ref)}
          onPlaceChanged={() => handlePlaceChanged("pickup")}
        >
          <input
            type="text"
            placeholder="Pickup Location"
            value={pickup}
            onChange={e => setPickup(e.target.value)}
            className="border p-2 rounded absolute left-2 top-2 z-10 w-64 bg-white"
            style={{ marginBottom: 8 }}
          />
        </Autocomplete>
        <Autocomplete
          onLoad={ref => (dropoffRef.current = ref)}
          onPlaceChanged={() => handlePlaceChanged("dropoff")}
        >
          <input
            type="text"
            placeholder="Dropoff Location"
            value={dropoff}
            onChange={e => setDropoff(e.target.value)}
            className="border p-2 rounded absolute left-2 top-14 z-10 w-64 bg-white"
          />
        </Autocomplete>
        {pickupPos && <Marker position={pickupPos} label="P" />}
        {dropoffPos && <Marker position={dropoffPos} label="D" />}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </LoadScript>
  );
}
