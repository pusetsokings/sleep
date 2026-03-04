import { useState } from 'react';
import { Plus, Moon, CheckCircle2, Edit, Trash2, BookOpen } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Badge } from '@/app/components/ui/badge';
import { SleepEntry, HabitEntry, UserProfile, WorryEntry } from '@/app/types';
import { strategies } from '@/app/data/strategies';
import { format } from 'date-fns';

interface TrackProps {
  profile: UserProfile;
  sleepEntries: SleepEntry[];
  habitEntries: HabitEntry[];
  worryEntries: WorryEntry[];
  onAddSleepEntry: () => void;
  onAddWorryEntry: () => void;
  onToggleHabit: (strategyId: number, date: string) => void;
  onDeleteSleepEntry: (id: string) => void;
  onNavigate: (view: string, data?: any) => void;
}

export function Track({
  profile,
  sleepEntries,
  habitEntries,
  worryEntries,
  onAddSleepEntry,
  onAddWorryEntry,
  onToggleHabit,
  onDeleteSleepEntry,
  onNavigate
}: TrackProps) {
  const [activeTab, setActiveTab] = useState('sleep');
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayHabits = habitEntries.filter(h => h.date === today);

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Track Your Progress</h1>
        <p className="text-slate-400">
          Log your sleep and build healthy habits
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 bg-slate-800">
          <TabsTrigger value="sleep">Sleep Log</TabsTrigger>
          <TabsTrigger value="habits">Daily Habits</TabsTrigger>
          <TabsTrigger value="worry">Worry Journal</TabsTrigger>
        </TabsList>

        {/* Sleep Log Tab */}
        <TabsContent value="sleep" className="space-y-4 mt-6">
          <Button
            onClick={onAddSleepEntry}
            className="w-full bg-emerald-500 hover:bg-emerald-600 border-2 border-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:shadow-[0_0_30px_rgba(16,185,129,0.7)] transition-all"
          >
            <Plus className="w-5 h-5 mr-2" />
            Log Sleep Entry
          </Button>

          {sleepEntries.length === 0 ? (
            <Card className="p-8 bg-slate-800 border-slate-700 text-center">
              <Moon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No sleep entries yet</p>
              <p className="text-sm text-slate-500 mt-1">Start logging your sleep to track progress</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {sleepEntries.map((entry) => (
                <Card key={entry.id} className="p-4 bg-slate-800 border-slate-700">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Moon className="w-4 h-4 text-teal-400" />
                        <span className="text-white font-semibold">
                          {format(new Date(entry.date), 'MMM d, yyyy')}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400">
                        {entry.bedTime} - {entry.wakeTime}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getQualityBadgeClass(entry.quality)}>
                        {entry.quality}/10
                      </Badge>
                      <Button
                        onClick={() => onDeleteSleepEntry(entry.id)}
                        variant="ghost"
                        size="icon"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {entry.notes && (
                    <p className="text-sm text-slate-300 mb-2">{entry.notes}</p>
                  )}
                  {entry.strategiesUsed.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {entry.strategiesUsed.map((sid) => {
                        const strategy = strategies.find(s => s.id === sid);
                        return strategy ? (
                          <Badge key={sid} variant="outline" className="text-xs bg-slate-700 text-slate-300 border-slate-600">
                            {strategy.title}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Daily Habits Tab */}
        <TabsContent value="habits" className="space-y-4 mt-6">
          <Card className="p-4 bg-gradient-to-r from-emerald-500/20 to-green-500/10 border-2 border-emerald-400/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <p className="text-sm text-slate-300">
              <strong className="text-white">Today's Focus:</strong> Check off your strategies as you implement them
            </p>
          </Card>

          <div className="space-y-3">
            {profile.selectedStrategies.map((strategyId) => {
              const strategy = strategies.find(s => s.id === strategyId);
              const isCompleted = todayHabits.some(h => h.strategyId === strategyId && h.completed);

              return strategy ? (
                <Card
                  key={strategyId}
                  onClick={() => onToggleHabit(strategyId, today)}
                  className={`p-4 cursor-pointer transition-all ${
                    isCompleted
                      ? 'bg-green-500/10 border-green-500/30'
                      : 'bg-slate-800 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-green-400" />
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-slate-500" />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{strategy.title}</h3>
                      <p className="text-sm text-slate-400">{strategy.subtitle}</p>
                    </div>
                  </div>
                </Card>
              ) : null;
            })}
          </div>

          {profile.selectedStrategies.length === 0 && (
            <Card className="p-8 bg-slate-800 border-slate-700 text-center">
              <p className="text-slate-400">No strategies selected</p>
              <p className="text-sm text-slate-500 mt-1">
                Go to Profile to choose your focus strategies
              </p>
            </Card>
          )}
        </TabsContent>

        {/* Worry Journal Tab */}
        <TabsContent value="worry" className="space-y-4 mt-6">
          <Button
            onClick={onAddWorryEntry}
            className="w-full bg-green-600 hover:bg-green-700 border-2 border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:shadow-[0_0_30px_rgba(34,197,94,0.7)] transition-all"
          >
            <BookOpen className="w-5 h-5 mr-2" />
            Add Worry Entry
          </Button>

          <Card className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/10 border-2 border-green-400/40 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
            <h3 className="font-semibold text-white mb-2">💭 About the Worry Window</h3>
            <p className="text-sm text-slate-300">
              Set aside 15-20 minutes earlier in the evening to process thoughts and plan for tomorrow.
              When anxious thoughts arise at bedtime, you can remind yourself you've already handled this.
            </p>
          </Card>

          {worryEntries.length === 0 ? (
            <Card className="p-8 bg-slate-800 border-slate-700 text-center">
              <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No worry entries yet</p>
              <p className="text-sm text-slate-500 mt-1">
                Start your worry window practice to process anxious thoughts
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {worryEntries.slice().reverse().map((entry) => (
                <Card key={entry.id} className="p-4 bg-slate-800 border-slate-700">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm text-slate-400">
                        {format(new Date(entry.date), 'MMM d')} at {entry.time}
                      </span>
                    </div>
                    {entry.resolved && (
                      <Badge className="bg-green-500/20 text-green-300 border-green-500">
                        Resolved
                      </Badge>
                    )}
                  </div>
                  <p className="text-slate-300">{entry.content}</p>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function getQualityBadgeClass(quality: number): string {
  if (quality >= 8) return 'bg-green-500/20 text-green-300 border-green-500';
  if (quality >= 6) return 'bg-yellow-500/20 text-yellow-300 border-yellow-500';
  if (quality >= 4) return 'bg-orange-500/20 text-orange-300 border-orange-500';
  return 'bg-red-500/20 text-red-300 border-red-500';
}