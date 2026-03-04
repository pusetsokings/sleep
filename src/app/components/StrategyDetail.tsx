import { ArrowLeft, CheckCircle2, Lightbulb, ListTodo, Thermometer, Sun, Coffee, Moon, Brain, Calendar, Activity, Wine, Zap, Home, Clock, Utensils, Heart, Battery } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Separator } from '@/app/components/ui/separator';
import { Strategy } from '@/app/types';

interface StrategyDetailProps {
  strategy: Strategy;
  onBack: () => void;
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

export function StrategyDetail({ strategy, onBack }: StrategyDetailProps) {
  const Icon = iconMap[strategy.icon] || Moon;

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          onClick={onBack}
          variant="ghost"
          size="icon"
          className="text-white hover:bg-slate-800"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">{strategy.title}</h1>
          <p className="text-slate-400">{strategy.subtitle}</p>
        </div>
      </div>

      {/* Icon Banner */}
      <div className={`${getIconBackground(strategy.id)} rounded-2xl p-8 flex justify-center`}>
        <Icon className={`w-20 h-20 ${getIconColor(strategy.id)}`} />
      </div>

      {/* Description */}
      <Card className="p-6 bg-slate-800 border-slate-700">
        <h2 className="text-lg font-semibold text-white mb-3">About This Strategy</h2>
        <p className="text-slate-300 leading-relaxed">{strategy.description}</p>
      </Card>

      {/* Key Tips */}
      <Card className="p-6 bg-slate-800 border-slate-700">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-yellow-400" />
          <h2 className="text-lg font-semibold text-white">Key Tips</h2>
        </div>
        <ul className="space-y-3">
          {strategy.tips.map((tip, index) => (
            <li key={index} className="flex gap-3 text-slate-300">
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Action Items */}
      <Card className="p-6 bg-gradient-to-br from-emerald-500/20 to-green-500/10 border-2 border-emerald-400/40 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
        <div className="flex items-center gap-2 mb-4">
          <ListTodo className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-semibold text-white">Action Items</h2>
        </div>
        <div className="space-y-2">
          {strategy.actionItems.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg border border-emerald-500/20"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-400/40">
                <span className="text-emerald-300 text-sm font-semibold">{index + 1}</span>
              </div>
              <span className="text-slate-200">{item}</span>
            </div>
          ))}
        </div>
      </Card>

      <Separator className="bg-slate-700" />

      {/* Bottom CTA */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="font-semibold text-white mb-2">Ready to implement?</h3>
        <p className="text-slate-400 text-sm mb-4">
          Track your progress with this strategy in the Track tab to see how it improves your sleep quality.
        </p>
        <Button onClick={onBack} className="w-full bg-emerald-500 hover:bg-emerald-600 border-2 border-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:shadow-[0_0_30px_rgba(16,185,129,0.7)] transition-all">
          Got It!
        </Button>
      </div>
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