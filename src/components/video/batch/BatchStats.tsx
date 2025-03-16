
import React from 'react';
import { Card } from "@/components/ui/card";

interface StatItemProps {
  label: string;
  value: string;
  subValue: string;
  subLabel: string;
  progressPercent: number;
  gradientFrom: string;
  gradientTo: string;
  shadowColor: string;
}

export const StatItem: React.FC<StatItemProps> = ({
  label,
  value,
  subValue,
  subLabel,
  progressPercent,
  gradientFrom,
  gradientTo,
  shadowColor
}) => {
  return (
    <Card className="glass-panel p-fib-4 rounded-lg hover-glow">
      <div className="flex flex-col">
        <span className="text-gray-400 text-sm">{label}</span>
        <div className="flex items-end justify-between">
          <span className="text-2xl font-bold text-aurora-white">{value}</span>
          <div className="text-xs" style={{ color: gradientTo }}>
            <span className="font-medium">{subValue}</span> {subLabel}
          </div>
        </div>
        <div className="mt-2 h-1.5 bg-black/30 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-300"
            style={{ 
              width: `${progressPercent}%`,
              background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
              boxShadow: `0 0 8px ${shadowColor}`
            }}
          ></div>
        </div>
      </div>
    </Card>
  );
};

export const BatchStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-fib-4">
      <StatItem
        label="API Usage"
        value="32/500"
        subValue="468"
        subLabel="credits remaining"
        progressPercent={6.4}
        gradientFrom="var(--color-aurora-purple)"
        gradientTo="var(--color-aurora-blue)"
        shadowColor="rgba(0,166,255,0.4)"
      />
      <StatItem
        label="Storage"
        value="128MB/5GB"
        subValue="4.87GB"
        subLabel="free"
        progressPercent={2.56}
        gradientFrom="var(--color-aurora-blue)"
        gradientTo="var(--color-aurora-green)"
        shadowColor="rgba(0,255,170,0.4)"
      />
      <StatItem
        label="Processing Speed"
        value="Standard"
        subValue="Pro Plan"
        subLabel="for 2x speed"
        progressPercent={50}
        gradientFrom="var(--color-aurora-green)"
        gradientTo="var(--color-aurora-purple)"
        shadowColor="rgba(138,43,226,0.4)"
      />
    </div>
  );
};
