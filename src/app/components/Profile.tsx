import { BarChart3, Settings, User, Award, TrendingUp } from 'lucide-react';
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