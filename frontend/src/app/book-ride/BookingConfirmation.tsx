import { useState } from "react";
import { UserCircle2, Star, CarFront, MapPin, CheckCircle2 } from "lucide-react";
import RazorpayButton from "./RazorpayButton";

// Accept ride, fare, and payment status as props in real app
export default function BookingConfirmation() {
  // Demo data (replace with props or context in real app)
  const ride = {
    pickup: "Connaught Place, Delhi",
    dropoff: "Indira Gandhi International Airport, Delhi",
    fare: 124,
    driver: {
      name: "Amit Sharma",
      rating: 4.9,
      car: "BMW 7 Series",
      carImg: "https://images.unsplash.com/photo-1511918984145-48de785d4c4e?auto=format&fit=crop&w=400&q=80",
    },
  };
  const [paid, setPaid] = useState(false);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-950 p-6">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 max-w-sm w-full p-8 flex flex-col items-center relative">
        {/* Car image */}
        <img src={ride.driver.carImg} alt="Car" className="w-32 h-20 object-cover rounded-xl shadow-lg border-4 border-black absolute -top-16 left-1/2 -translate-x-1/2 bg-white" />
        {/* Driver profile */}
        <div className="mt-20 flex flex-col items-center">
          <UserCircle2 size={56} className="text-gray-900 mb-2" />
          <div className="text-xl font-bold text-gray-900 mb-1">{ride.driver.name}</div>
          <div className="flex items-center gap-1 text-yellow-500 font-semibold mb-2">
            <Star size={18} />
            <span>{ride.driver.rating}</span>
          </div>
        </div>
        {/* Car details */}
        <div className="flex items-center gap-2 mt-2 mb-4">
          <CarFront size={24} className="text-gray-700" />
          <span className="font-medium text-gray-700">{ride.driver.car}</span>
        </div>
        {/* Ride summary */}
        <div className="w-full bg-gray-100 rounded-xl p-4 mb-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-cyan-700 font-semibold">
            <MapPin size={18} /> Pickup: <span className="font-normal text-gray-800">{ride.pickup}</span>
          </div>
          <div className="flex items-center gap-2 text-purple-700 font-semibold">
            <MapPin size={18} /> Dropoff: <span className="font-normal text-gray-800">{ride.dropoff}</span>
          </div>
          <div className="flex items-center gap-2 text-green-700 font-semibold">
            Fare: <span className="font-bold text-black">₹{ride.fare}</span>
          </div>
        </div>
        {/* Payment status */}
        {!paid ? (
          <div className="w-full flex flex-col items-center gap-4">
            <RazorpayButton amount={ride.fare} onSuccess={() => setPaid(true)} />
            <button className="w-full py-3 rounded-full bg-gray-400 text-gray-700 font-bold text-lg shadow-lg cursor-not-allowed" disabled>Done</button>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-green-600 font-bold text-lg mb-2">
              <CheckCircle2 size={24} /> Payment Successful!
            </div>
            <button className="w-full py-3 rounded-full bg-black text-yellow-400 font-bold text-lg shadow-lg hover:bg-gray-900 transition">Done</button>
          </div>
        )}
      </div>
    </main>
  );
}
