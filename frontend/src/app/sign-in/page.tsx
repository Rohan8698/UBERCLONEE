
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-black relative overflow-hidden">
      {/* Floating car icon illustration */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <svg width="80" height="40" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="20" width="60" height="16" rx="8" fill="#0ff" fillOpacity="0.7" />
          <rect x="20" y="10" width="40" height="16" rx="8" fill="#fff" fillOpacity="0.9" />
          <circle cx="22" cy="36" r="6" fill="#0ff" stroke="#222" strokeWidth="2" />
          <circle cx="58" cy="36" r="6" fill="#0ff" stroke="#222" strokeWidth="2" />
        </svg>
      </div>
      <div className="relative z-20 flex flex-col items-center w-full max-w-xs p-8 rounded-3xl shadow-2xl bg-gray-900/80 border border-gray-800 backdrop-blur-md">
  <h1 className="text-3xl font-extrabold text-white mb-2 tracking-wide" style={{letterSpacing: '0.04em'}}>Sign in to <span className="text-cyan-400">Ryde</span></h1>
  <p className="text-md text-cyan-400 mb-6 font-medium">Welcome back! Please sign in to continue</p>
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary: 'bg-cyan-400 hover:bg-cyan-300 text-black font-bold rounded-full py-2 px-6 transition-all duration-200 shadow-lg',
              card: 'bg-gray-900/80 border border-gray-800 rounded-2xl',
              headerTitle: 'text-white',
              headerSubtitle: 'text-cyan-400',
              socialButtonsBlockButton: 'bg-gray-800 text-cyan-400 border-cyan-400 hover:bg-cyan-900',
              dividerText: 'text-gray-400',
              footerActionText: 'text-cyan-400',
            }
          }}
        />
      </div>
      {/* Neon accent ring */}
      <div className="absolute -z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-400 opacity-20 blur-3xl animate-pulse" />
    </div>
  );
}
