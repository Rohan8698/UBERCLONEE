import { CarFront, Car, CarTaxiFront } from "lucide-react";

const rides = [
  {
    type: "Economy",
    icon: CarFront,
    price: "$8",
    desc: "Affordable everyday rides",
    gradient: "from-cyan-400/60 to-blue-500/60",
  },
  {
    type: "Premium",
    icon: Car,
    price: "$15",
    desc: "Luxury and comfort",
    gradient: "from-purple-400/60 to-pink-500/60",
  },
  {
    type: "SUV",
    icon: CarTaxiFront,
    price: "$20",
    desc: "Spacious for groups",
    gradient: "from-green-400/60 to-lime-400/60",
  },
];

export default function RideOptionsSelector({ onSelect, selectedType }: { onSelect?: (type: string) => void, selectedType?: string }) {
  return (
    <div className="flex gap-6 justify-center items-center py-6">
      {rides.map((ride) => {
        const Icon = ride.icon;
        const isSelected = selectedType === ride.type;
        return (
          <button
            key={ride.type}
            onClick={() => onSelect?.(ride.type)}
            className={`backdrop-blur-lg bg-gradient-to-br ${isSelected ? 'ring-4 ring-cyan-300 scale-105' : ''}`}
            style={{
              background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
            }}
          >
            <div
              className={`rounded-2xl p-6 min-w-[140px] min-h-[180px] flex flex-col items-center justify-between glass-card shadow-xl border border-white/20 bg-gradient-to-br ${ride.gradient}`}
              style={{backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)"}}
            >
              <div className="mb-2">
                <Icon size={40} className="text-white drop-shadow-lg" />
              </div>
              <div className="text-xl font-bold text-white mb-1 drop-shadow">{ride.type}</div>
              <div className="text-lg font-semibold text-white/80 mb-2">{ride.price}</div>
              <div className="text-xs text-white/70 mb-2 text-center">{ride.desc}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
