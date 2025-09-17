"use client";
import { useUser } from "@clerk/nextjs";

export default function ProfilePage() {
  const { user } = useUser();
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-black p-8">
      <div className="bg-gray-900/90 rounded-3xl shadow-2xl border border-gray-800 p-8 flex flex-col items-center gap-6 max-w-md w-full glass-card">
        <h1 className="text-3xl font-extrabold text-cyan-400 mb-4 tracking-wide drop-shadow">Profile</h1>
        {user ? (
          <>
            <img src={user.imageUrl} alt="Profile" className="w-24 h-24 rounded-full border-4 border-cyan-400 shadow-lg mb-4" />
            <div className="text-xl font-bold text-white mb-2">{user.fullName}</div>
            <div className="text-gray-300 mb-2">{user.emailAddresses[0]?.emailAddress}</div>
            <div className="text-gray-400 mb-2">User ID: {user.id}</div>
            {/* Add loyalty points, settings grid, etc. here */}
          </>
        ) : (
          <div className="text-red-400">Please sign in to view your profile.</div>
        )}
      </div>
    </main>
  );
}
