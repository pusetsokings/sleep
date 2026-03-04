import { Thermometer, Sun, Coffee, Moon, Brain, Calendar, ChevronRight, Activity, Wine, Zap, Home, Clock, Utensils, Heart, Battery } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { WindDown } from '@/app/components/WindDown';
import { strategies } from '@/app/data/strategies';
import { UserProfile } from '@/app/types';

interface StrategiesProps {
  profile: UserProfile;
  onNavigate: (view: string, data?: any) => void;
}

const iconMap: Record<string, any> = {
  thermometer: Thermometer,
  sun: Sun,
  coffee: Coffee,
  moon: Moon,
  brain: Brain,
  calendar: Calendar,
  activity: Activity,
  wine: Wine,
  power: Zap,
  home: Home,
  clock: Clock,
  utensils: Utensils,
  heart: Heart,
  battery: Battery,
};

export function Strategies({ profile, onNavigate }: StrategiesProps) {
  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Sleep Strategies</h1>
        <p className="text-slate-400">
          Science-backed strategies to improve your sleep quality
        </p>
      </div>

      {/* Wind Down Tool */}
      <WindDown />

      {/* Strategy Cards */}
      <div className="space-y-4">
        {strategies.map((strategy) => {
          const Icon = iconMap[strategy.icon] || Moon;
          const isSelected = profile.selectedStrategies.includes(strategy.id);

          return (
            <Card
              key={strategy.id}
              onClick={() => onNavigate('strategy-journey', strategy)}
              className="p-5 bg-slate-800 border-slate-700 cursor-pointer hover:bg-slate-700 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${getIconBackground(strategy.id)}`}>
                  <Icon className={`w-6 h-6 ${getIconColor(strategy.id)}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {strategy.title}
                      </h3>
                      <p className="text-sm text-slate-400">{strategy.subtitle}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-500 flex-shrink-0 ml-2" />
                  </div>
                  {isSelected && (
                    <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/50 shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                      Active Focus
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Bottom Info */}
      <Card className="p-6 bg-gradient-to-br from-indigo-900/40 to-violet-900/20 border-2 border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.15)]">
        <h3 className="font-semibold text-white mb-2 text-indigo-100">📚 Implementation Tips</h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li>• Start with 2-3 strategies you find most relevant</li>
          <li>• Practice consistently for at least one week</li>
          <li>• Track your progress to see what works best for you</li>
          <li>• Gradually add more strategies as habits form</li>
        </ul>
      </Card>
    </div>
  );
}

function getIconBackground(id: number): string {
  const backgrounds = [
    'bg-blue-500/20',
    'bg-yellow-500/20',
    'bg-orange-500/20',
    'bg-purple-500/20',
    'bg-pink-500/20',
    'bg-green-500/20',
    'bg-emerald-500/20',
    'bg-red-500/20',
    'bg-cyan-500/20',
    'bg-indigo-500/20',
    'bg-rose-500/20',
    'bg-amber-500/20',
    'bg-teal-500/20',
    'bg-lime-500/20',
  ];
  return backgrounds[id - 1] || 'bg-slate-500/20';
}

function getIconColor(id: number): string {
  const colors = [
    'text-blue-400',
    'text-yellow-400',
    'text-orange-400',
    'text-purple-400',
    'text-pink-400',
    'text-green-400',
    'text-emerald-400',
    'text-red-400',
    'text-cyan-400',
    'text-indigo-400',
    'text-rose-400',
    'text-amber-400',
    'text-teal-400',
    'text-lime-400',
  ];
  return colors[id - 1] || 'text-slate-400';
}