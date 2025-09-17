"use client";
import Navbar from "./Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser, SignInButton } from "@clerk/nextjs";

export default function HomeLanding() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black flex flex-col pt-24">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center py-24 px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-lg">
            Welcome to <span className="text-cyan-400">Ryde</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl">
            The next-generation ride-hailing app. Safe, fast, and affordable rides at your fingertips.
          </p>
          <div className="flex gap-4 justify-center">
            <BookRideButton />
            <Link href="/driver-signup" className="bg-gray-800 hover:bg-gray-700 text-cyan-400 font-bold rounded-full py-3 px-8 text-lg shadow-lg border border-cyan-400 transition-all duration-200">
              Become a Driver
            </Link>
          </div>
        </section>
        {/* Features Section */}
        <section className="py-16 px-4 bg-gray-900/80 border-t border-gray-800">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-800 rounded-2xl p-8 shadow-lg text-white">
              <h3 className="text-xl font-bold mb-2">Real-Time Tracking</h3>
              <p>Track your ride and driver live on the map.</p>
            </div>
            <div className="bg-gray-800 rounded-2xl p-8 shadow-lg text-white">
              <h3 className="text-xl font-bold mb-2">Secure Payments</h3>
              <p>Pay with card, wallet, UPI, or Razorpay after your ride.</p>
            </div>
            <div className="bg-gray-800 rounded-2xl p-8 shadow-lg text-white">
              <h3 className="text-xl font-bold mb-2">Ratings & Reviews</h3>
              <p>Rate your driver and leave feedback after every trip.</p>
            </div>
            <div className="bg-gray-800 rounded-2xl p-8 shadow-lg text-white">
              <h3 className="text-xl font-bold mb-2">Wallet & Credits</h3>
              <p>Add funds to your wallet and use credits for rides.</p>
            </div>
            <div className="bg-gray-800 rounded-2xl p-8 shadow-lg text-white">
              <h3 className="text-xl font-bold mb-2">SOS & Support</h3>
              <p>Emergency button and 24/7 help center for your safety.</p>
            </div>
            <div className="bg-gray-800 rounded-2xl p-8 shadow-lg text-white">
              <h3 className="text-xl font-bold mb-2">Promo Codes</h3>
              <p>Apply promo codes for discounts and special offers.</p>
            </div>
          </div>
        </section>
        {/* Testimonials Section */}
        <section className="py-16 px-4 bg-black border-t border-gray-800">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-900 rounded-2xl p-8 shadow-lg text-white">
              <p className="italic mb-4">“Ryde is the best ride app I’ve used. Fast, safe, and always reliable!”</p>
              <div className="font-bold text-cyan-400">Amit S.</div>
            </div>
            <div className="bg-gray-900 rounded-2xl p-8 shadow-lg text-white">
              <p className="italic mb-4">“The wallet and promo codes save me money every month!”</p>
              <div className="font-bold text-cyan-400">Priya K.</div>
            </div>
            <div className="bg-gray-900 rounded-2xl p-8 shadow-lg text-white">
              <p className="italic mb-4">“I love the SOS feature. It makes me feel safe on every trip.”</p>
              <div className="font-bold text-cyan-400">Rahul D.</div>
            </div>
          </div>
        </section>
        {/* Footer */}
        <footer className="bg-gray-900 border-t border-gray-800 py-8 px-4 text-center text-gray-400">
          <div className="mb-4">
            <Link href="/terms" className="underline mx-2">Terms</Link>
            <Link href="/privacy" className="underline mx-2">Privacy</Link>
            <Link href="/faq" className="underline mx-2">FAQ</Link>
            <Link href="/help" className="underline mx-2">Help Center</Link>
          </div>
          <div className="mb-2">© {new Date().getFullYear()} Ryde. All rights reserved.</div>
          <div className="flex justify-center gap-4 mt-2">
            <a href="#" className="hover:text-cyan-400">Instagram</a>
            <a href="#" className="hover:text-cyan-400">Twitter</a>
            <a href="#" className="hover:text-cyan-400">Facebook</a>
          </div>
        </footer>
      </main>
    </>
  );

function BookRideButton() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  if (isSignedIn) {
    return (
      <Link href="/book-ride">
        <button className="bg-cyan-400 text-black font-bold px-6 py-3 rounded-full shadow-lg hover:bg-cyan-300 transition">Book a Ride</button>
      </Link>
    );
  }
  return (
    <SignInButton mode="modal">
      <button className="bg-cyan-400 text-black font-bold px-6 py-3 rounded-full shadow-lg hover:bg-cyan-300 transition">Book a Ride</button>
    </SignInButton>
  );
}
}
