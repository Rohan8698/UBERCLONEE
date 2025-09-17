"use client";
import { useState } from "react";

export default function DriverSignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    // TODO: Integrate with backend driver registration
    setMessage("Application submitted! Admin will review your details.");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-black p-8">
      <div className="bg-gray-900/90 rounded-3xl shadow-2xl border border-gray-800 p-8 flex flex-col items-center gap-6 max-w-md w-full glass-card">
        <h1 className="text-3xl font-extrabold text-cyan-400 mb-4 tracking-wide drop-shadow">Become a Driver</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} className="bg-gray-800/80 border-none rounded-xl px-4 py-3 text-white placeholder-cyan-300 focus:ring-2 focus:ring-cyan-400 outline-none shadow-inner" required />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="bg-gray-800/80 border-none rounded-xl px-4 py-3 text-white placeholder-cyan-300 focus:ring-2 focus:ring-cyan-400 outline-none shadow-inner" required />
          <input type="text" placeholder="Vehicle Info" value={vehicle} onChange={e => setVehicle(e.target.value)} className="bg-gray-800/80 border-none rounded-xl px-4 py-3 text-white placeholder-cyan-300 focus:ring-2 focus:ring-cyan-400 outline-none shadow-inner" required />
          <button type="submit" className="bg-cyan-400 hover:bg-cyan-300 text-black font-bold rounded-full py-3 transition-all duration-200 shadow-lg text-lg tracking-wide">Submit Application</button>
        </form>
        {message && <p className="mt-2 text-center text-green-400 text-sm animate-pulse">{message}</p>}
      </div>
    </main>
  );
}
