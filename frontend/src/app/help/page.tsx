"use client";
import Link from "next/link";

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-extrabold mb-6 text-cyan-400 drop-shadow">Help Center</h1>
      <div className="max-w-2xl w-full bg-gray-900/80 rounded-2xl shadow-xl border border-cyan-400 p-8 flex flex-col gap-6 glass-card">
        <section>
          <h2 className="text-2xl font-bold mb-2 text-cyan-300">How can we help you?</h2>
          <ul className="list-disc ml-6 text-gray-200">
            <li>Need help booking a ride? <Link href="/book-ride" className="underline text-cyan-400">See booking guide</Link></li>
            <li>Payment issues? <span className="text-cyan-400">Contact support at support@ryde.com</span></li>
            <li>Driver or ride complaints? <span className="text-cyan-400">Report via your trip history</span></li>
            <li>Lost item? <span className="text-cyan-400">Fill out the lost & found form</span></li>
            <li>Account or sign-in problems? <Link href="/sign-in" className="underline text-cyan-400">Sign in help</Link></li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2 text-purple-300">Frequently Asked Questions</h2>
          <ul className="list-disc ml-6 text-gray-300">
            <li>How do I book a ride? — Go to <Link href="/book-ride" className="underline text-cyan-400">Book a Ride</Link> and follow the steps.</li>
            <li>How do I become a driver? — Visit <Link href="/driver-signup" className="underline text-cyan-400">Become a Driver</Link>.</li>
            <li>How do I view my ride history? — Go to <Link href="/ride-history" className="underline text-cyan-400">Ride History</Link>.</li>
            <li>How do I pay for my ride? — You can pay via card, wallet, UPI, or Razorpay after your trip.</li>
            <li>How do I contact support? — Email <span className="text-cyan-400">support@ryde.com</span> or use the help form.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
