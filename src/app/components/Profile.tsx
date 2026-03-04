import { BarChart3, Settings, User, Award, TrendingUp, Star } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Separator } from '@/app/components/ui/separator';
import { Badge } from '@/app/components/ui/badge';
import { UserProfile, SleepEntry, HabitEntry } from '@/app/types';
import { strategies } from '@/app/data/strategies';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format, subDays } from 'date-fns';

interface ProfileProps {
  profile: UserProfile;
  sleepEntries: SleepEntry[];
  habitEntries: HabitEntry[];
  onNavigate: (view: string, data?: any) => void;
}

export function Profile({ profile, sleepEntries, habitEntries, onNavigate }: ProfileProps) {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    return format(date, 'yyyy-MM-dd');
  });

  const sleepQualityData = last7Days.map(date => {
    const entry = sleepEntries.find(e => e.date === date);
    return {
      date: format(new Date(date), 'MMM d'),
      quality: entry ? entry.quality : 0
    };
  });

  const habitCompletionData = last7Days.map(date => {
    const dayHabits = habitEntries.filter(h => h.date === date);
    const completed = dayHabits.filter(h => h.completed).length;
    const total = profile.selectedStrategies.length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;

    return {
      date: format(new Date(date), 'MMM d'),
      completion: Math.round(percentage)
    };
  });

  const avgQuality = sleepEntries.length > 0
    ? sleepEntries.reduce((sum, e) => sum + e.quality, 0) / sleepEntries.length
    : 0;

  const totalEntries = sleepEntries.length;
  const totalHabitsCompleted = habitEntries.filter(h => h.completed).length;

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
          <p className="text-slate-400">Track your sleep journey</p>
        </div>
        <Button
          onClick={() => onNavigate('settings')}
          variant="ghost"
          size="icon"
          className="text-white hover:bg-slate-800"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>

      {/* User Info */}
      <Card className="p-6 bg-gradient-to-r from-emerald-600 to-green-500 text-white border-2 border-emerald-400/50 shadow-[0_0_30px_rgba(16,185,129,0.5)]" style={{ animation: 'neon-pulse 3s ease-in-out infinite' }}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold border-2 border-white/30">
            <User className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{profile.name}</h2>
            <p className="text-emerald-100">Sleep Improvement Journey</p>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 bg-slate-800 border-slate-700 text-center">
          <div className="text-2xl font-bold text-white mb-1">{totalEntries}</div>
          <div className="text-xs text-slate-400">Sleep Logs</div>
        </Card>
        <Card className="p-4 bg-slate-800 border-slate-700 text-center">
          <div className="text-2xl font-bold text-white mb-1">
            {avgQuality > 0 ? avgQuality.toFixed(1) : '--'}
          </div>
          <div className="text-xs text-slate-400">Avg Quality</div>
        </Card>
        <Card className="p-4 bg-slate-800 border-slate-700 text-center">
          <div className="text-2xl font-bold text-white mb-1">{totalHabitsCompleted}</div>
          <div className="text-xs text-slate-400">Habits Done</div>
        </Card>
      </div>

      {/* Advanced Analytics Button */}
      <Button
        onClick={() => onNavigate('analytics')}
        className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white border-2 border-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:shadow-[0_0_30px_rgba(16,185,129,0.7)] transition-all"
      >
        <BarChart3 className="w-5 h-5 mr-2" />
        View Advanced Analytics
      </Button>

      {/* Sleep Quality Chart */}
      {sleepEntries.length > 0 && (
        <Card className="p-6 bg-slate-800 border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold text-white">Sleep Quality Trend</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={sleepQualityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: '12px' }} />
              <YAxis domain={[0, 10]} stroke="#94a3b8" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Line
                type="monotone"
                dataKey="quality"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ fill: '#6366f1', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Habit Completion Chart */}
      {habitEntries.length > 0 && (
        <Card className="p-6 bg-slate-800 border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-green-400" />
            <h3 className="font-semibold text-white">Habit Completion Rate</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={habitCompletionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: '12px' }} />
              <YAxis domain={[0, 100]} stroke="#94a3b8" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Bar dataKey="completion" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Sleep Constellation (Gamification) */}
      <Card className="p-6 bg-slate-900 border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.1)] relative overflow-hidden">
        {/* Decorative background stars */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-4 left-10 w-1 h-1 bg-white rounded-full"></div>
          <div className="absolute top-20 left-1/4 w-2 h-2 bg-indigo-200 rounded-full blur-[1px]"></div>
          <div className="absolute top-10 right-20 w-1.5 h-1.5 bg-blue-100 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 left-1/3 w-1 h-1 bg-white rounded-full"></div>
          <div className="absolute bottom-4 right-10 w-2 h-2 bg-purple-200 rounded-full blur-[1px]"></div>
        </div>

        <div className="flex items-center gap-2 mb-6 relative z-10">
          <Star className="w-5 h-5 text-indigo-400 fill-indigo-400" />
          <h3 className="font-semibold text-white">Your Sleep Constellation</h3>
        </div>

        <div className="flex flex-col items-center justify-center py-4 relative z-10">
          <div className="flex items-center gap-3 mb-4">
            {Array.from({ length: 7 }).map((_, i) => {
              const date = subDays(new Date(), 6 - i);
              const dateStr = format(date, 'yyyy-MM-dd');
              const entry = sleepEntries.find(e => e.date === dateStr);
              // A "star" is earned if sleep quality is 7+ OR they logged their sleep
              const hasStar = entry && entry.quality >= 7;

              return (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${hasStar
                        ? 'bg-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                        : 'bg-slate-800 border border-slate-700'
                      }`}
                  >
                    <Star
                      className={`w-5 h-5 transition-all duration-500 ${hasStar
                          ? 'text-indigo-300 fill-indigo-300 drop-shadow-[0_0_8px_rgba(165,180,252,0.8)]'
                          : 'text-slate-600'
                        }`}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400">{format(date, 'EE')}</span>
                </div>
              );
            })}
          </div>
          <p className="text-sm text-indigo-200/70 text-center max-w-[250px]">
            Log high-quality sleep (7/10 or better) to complete your weekly constellation.
          </p>
        </div>
      </Card>

      {/* Focus Strategies */}
      <Card className="p-6 bg-slate-800 border-slate-700">
        <h3 className="font-semibold text-white mb-4">Your Focus Strategies</h3>
        <div className="space-y-2">
          {profile.selectedStrategies.map((strategyId) => {
            const strategy = strategies.find(s => s.id === strategyId);
            return strategy ? (
              <div
                key={strategyId}
                className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
              >
                <span className="text-white">{strategy.title}</span>
                <Badge className="bg-emerald-300/30 text-emerald-100 border-emerald-200">
                  Active
                </Badge>
              </div>
            ) : null;
          })}
        </div>
      </Card>

      {/* Sleep Schedule */}
      <Card className="p-6 bg-slate-800 border-slate-700">
        <h3 className="font-semibold text-white mb-4">Sleep Schedule</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Target Bedtime</span>
            <span className="text-white font-semibold">{profile.targetBedTime}</span>
          </div>
          <Separator className="bg-slate-700" />
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Target Wake Time</span>
            <span className="text-white font-semibold">{profile.targetWakeTime}</span>
          </div>
          <Separator className="bg-slate-700" />
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Caffeine Cutoff</span>
            <span className="text-white font-semibold">{profile.caffeineTime}</span>
          </div>
        </div>
      </Card>

      {/* Achievements */}
      <Card className="p-6 bg-gradient-to-br from-yellow-500/20 to-orange-500/10 border-yellow-500/30">
        <div className="flex items-center gap-2 mb-3">
          <Award className="w-5 h-5 text-yellow-400" />
          <h3 className="font-semibold text-white">Achievements</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {totalEntries >= 1 && (
            <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500 justify-center py-2">
              🌙 First Entry
            </Badge>
          )}
          {totalEntries >= 7 && (
            <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500 justify-center py-2">
              📅 Week Logger
            </Badge>
          )}
          {totalHabitsCompleted >= 10 && (
            <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500 justify-center py-2">
              ✅ Habit Builder
            </Badge>
          )}
          {avgQuality >= 8 && (
            <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500 justify-center py-2">
              ⭐ Sleep Master
            </Badge>
          )}
        </div>
      </Card>
    </div>
  );
}