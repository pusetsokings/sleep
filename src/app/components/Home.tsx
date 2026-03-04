import { Moon, TrendingUp, CheckCircle2, Calendar, CloudRain } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import { UserProfile, SleepEntry, HabitEntry } from '@/app/types';
import { strategies } from '@/app/data/strategies';
import { format } from 'date-fns';

interface HomeProps {
  profile: UserProfile;
  sleepEntries: SleepEntry[];
  habitEntries: HabitEntry[];
  onNavigate: (view: string, data?: any) => void;
}

export function Home({ profile, sleepEntries, habitEntries, onNavigate }: HomeProps) {
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayHabits = habitEntries.filter(h => h.date === today);
  const completedToday = todayHabits.filter(h => h.completed).length;
  const totalToday = profile.selectedStrategies.length;
  const progressPercent = totalToday > 0 ? (completedToday / totalToday) * 100 : 0;

  const recentEntries = sleepEntries.slice(0, 7);
  const avgQuality = recentEntries.length > 0
    ? recentEntries.reduce((sum, entry) => sum + entry.quality, 0) / recentEntries.length
    : 0;

  const currentStreak = calculateStreak(habitEntries, profile.selectedStrategies);

  return (
    <div className="space-y-6 pb-24">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-500 rounded-2xl p-6 text-white border-2 border-emerald-400/50 shadow-[0_0_30px_rgba(16,185,129,0.5)]" style={{ animation: 'neon-pulse 3s ease-in-out infinite' }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-white/20 rounded-lg">
            <Moon className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Good {getTimeOfDay()}, {profile.name}!</h1>
            <p className="text-emerald-50">Let's make tonight your best sleep yet</p>
          </div>
        </div>
      </div>

      {/* Today's Progress */}
      <Card className="p-6 bg-slate-800 border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Today's Progress</h2>
          <Badge variant="outline" className="bg-emerald-400/30 text-white border-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.4)]">
            {completedToday}/{totalToday} Complete
          </Badge>
        </div>
        <Progress value={progressPercent} className="h-3 mb-4" />
        <div className="space-y-2">
          {profile.selectedStrategies.map((strategyId) => {
            const strategy = strategies.find(s => s.id === strategyId);
            const isCompleted = todayHabits.some(h => h.strategyId === strategyId && h.completed);

            return strategy ? (
              <div
                key={strategyId}
                className={`flex items-center gap-3 p-3 rounded-lg border ${isCompleted
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-slate-700/50 border-slate-600'
                  }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-500" />
                )}
                <span className="text-white flex-1">{strategy.title}</span>
              </div>
            ) : null;
          })}
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/30">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-blue-300">Avg Quality</span>
          </div>
          <div className="text-3xl font-bold text-white">
            {avgQuality > 0 ? avgQuality.toFixed(1) : '--'}
            <span className="text-lg text-slate-400">/10</span>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-500/20 to-orange-600/10 border-orange-500/30">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-orange-400" />
            <span className="text-sm text-orange-300">Current Streak</span>
          </div>
          <div className="text-3xl font-bold text-white">
            {currentStreak}
            <span className="text-lg text-slate-400"> days</span>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
        <Button
          onClick={() => onNavigate('strategies')}
          className="w-full justify-start bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
          variant="outline"
        >
          <Moon className="w-5 h-5 mr-2" />
          View All Strategies
        </Button>
        <Button
          onClick={() => onNavigate('soundscapes')}
          className="w-full justify-start bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
          variant="outline"
        >
          <CloudRain className="w-5 h-5 mr-2" />
          Play Soundscapes
        </Button>
        <Button
          onClick={() => onNavigate('track')}
          className="w-full justify-start bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
          variant="outline"
        >
          <Calendar className="w-5 h-5 mr-2" />
          Log Tonight's Sleep
        </Button>
      </div>

      {/* Daily Tip */}
      <Card className="p-6 bg-gradient-to-br from-emerald-500/20 to-green-500/10 border-2 border-emerald-400/40 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
        <h3 className="font-semibold text-white mb-2">💡 Today's Tip</h3>
        <p className="text-slate-300 text-sm">
          {getTodayTip(profile.selectedStrategies)}
        </p>
      </Card>
    </div>
  );
}

function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Morning';
  if (hour < 18) return 'Afternoon';
  return 'Evening';
}

function calculateStreak(habitEntries: HabitEntry[], selectedStrategies: number[]): number {
  if (selectedStrategies.length === 0) return 0;

  let streak = 0;
  let currentDate = new Date();

  while (true) {
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    const dayHabits = habitEntries.filter(h => h.date === dateStr);
    const completedCount = dayHabits.filter(h => h.completed && selectedStrategies.includes(h.strategyId)).length;

    // Consider day complete if at least half of selected strategies are done
    if (completedCount >= Math.ceil(selectedStrategies.length / 2)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }

    // Prevent infinite loop
    if (streak > 365) break;
  }

  return streak;
}

function getTodayTip(selectedStrategies: number[]): string {
  const tips = [
    "Remember: Your bedroom should be cool, dark, and quiet for optimal sleep.",
    "Try taking a warm bath 90 minutes before bed to help trigger sleepiness.",
    "Morning sunlight exposure helps set your circadian rhythm for better sleep tonight.",
    "Avoid checking the clock if you wake up during the night—it can increase anxiety.",
    "Consistency is key! Go to bed and wake up at the same time, even on weekends.",
    "Your worry window can transform anxious thoughts into actionable plans."
  ];

  if (selectedStrategies.length > 0) {
    const randomStrategyId = selectedStrategies[new Date().getDate() % selectedStrategies.length];
    const strategy = strategies.find(s => s.id === randomStrategyId);
    if (strategy && strategy.tips.length > 0) {
      return strategy.tips[0];
    }
  }

  return tips[new Date().getDate() % tips.length];
}