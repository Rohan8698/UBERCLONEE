"use client";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <nav className="w-full bg-gray-950 border-b border-gray-800 shadow-lg flex items-center justify-between px-8 py-4 fixed top-0 left-0 z-50">
      <div className="flex items-center gap-3">
        <span className="text-2xl font-extrabold text-cyan-400 tracking-wide drop-shadow">Ryde</span>
      </div>
      <div className="flex gap-6">
        <Link href="/book-ride" className="text-lg font-semibold text-gray-200 hover:text-cyan-400 transition">Book a Ride</Link>
        <Link href="/driver-dashboard" className="text-lg font-semibold text-gray-200 hover:text-cyan-400 transition">Driver Dashboard</Link>
        <Link href="/ride-history" className="text-lg font-semibold text-gray-200 hover:text-cyan-400 transition">Ride History</Link>
        <Link href="/profile" className="text-lg font-semibold text-gray-200 hover:text-cyan-400 transition">Profile</Link>
        <Link href="/help" className="text-lg font-semibold text-gray-200 hover:text-cyan-400 transition">Help</Link>
      </div>
      <div>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="bg-cyan-400 text-black font-bold px-4 py-2 rounded-full shadow-lg hover:bg-cyan-300 transition">Sign In</button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" appearance={{
            elements: {
              avatarBox: 'ring-2 ring-cyan-400',
              userButtonPopoverCard: 'bg-gray-900 border border-gray-800',
              userButtonPopoverActionButton: 'hover:bg-cyan-400/10',
              userButtonPopoverActionButtonText: 'text-cyan-400',
            }
          }} />
        </SignedIn>
      </div>
    </nav>
  );
}
