import { useState } from 'react';
import { ArrowLeft, TrendingUp, Brain, Heart, Moon, Calendar, AlertCircle, Target, Award, Activity, Zap, Sparkles } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/app/components/ui/tabs';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Area, AreaChart } from 'recharts';
import { UserProfile, SleepEntry, HabitEntry, WorryEntry } from '@/app/types';
import { strategies } from '@/app/data/strategies';

interface AnalyticsProps {
  profile: UserProfile;
  sleepEntries: SleepEntry[];
  habitEntries: HabitEntry[];
  worryEntries: WorryEntry[];
  onBack: () => void;
}

export function Analytics({ profile, sleepEntries, habitEntries, worryEntries, onBack }: AnalyticsProps) {
  const [timeRange, setTimeRange] = useState<'7' | '30' | '90'>('30');

  // Helper function to filter entries by time range
  const getFilteredEntries = (entries: SleepEntry[]) => {
    const days = parseInt(timeRange);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return entries.filter(e => new Date(e.date) >= cutoffDate);
  };

  // Sleep Quality Trend Analysis
  const getSleepQualityTrend = () => {
    const filtered = getFilteredEntries(sleepEntries).slice(-30);
    return filtered.map(entry => ({
      date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      quality: entry.quality,
      duration: entry.hoursSlept,
      mood: entry.mood || 5,
    }));
  };

  // Sleep Debt Calculation
  const getSleepDebt = () => {
    const filtered = getFilteredEntries(sleepEntries);
    const targetHours = profile.targetSleepHours;
    let totalDebt = 0;

    const debtData = filtered.slice(-14).map(entry => {
      const dailyDebt = Math.max(0, targetHours - entry.hoursSlept);
      totalDebt += dailyDebt;
      return {
        date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        debt: dailyDebt,
        cumulative: totalDebt,
      };
    });

    return { debtData, totalDebt };
  };

  // Circadian Consistency Score
  const getCircadianConsistency = () => {
    const filtered = getFilteredEntries(sleepEntries);
    if (filtered.length < 2) return 0;

    const bedtimes = filtered.map(e => {
      const [hours, minutes] = e.bedTime.split(':').map(Number);
      return hours * 60 + minutes;
    });

    const avgBedtime = bedtimes.reduce((a, b) => a + b, 0) / bedtimes.length;
    const variance = bedtimes.reduce((sum, time) => sum + Math.pow(time - avgBedtime, 2), 0) / bedtimes.length;
    const stdDev = Math.sqrt(variance);

    // Score from 0-100, where lower variance = higher score
    const consistencyScore = Math.max(0, Math.min(100, 100 - (stdDev / 60) * 20));
    return Math.round(consistencyScore);
  };

  // Strategy Effectiveness Analysis
  const getStrategyEffectiveness = () => {
    const filtered = getFilteredEntries(sleepEntries);
    const effectivenessMap: { [key: number]: { quality: number[], count: number } } = {};

    filtered.forEach(entry => {
      const entryDate = entry.date;
      const habitsForDay = habitEntries.filter(h => h.date === entryDate && h.completed);

      habitsForDay.forEach(habit => {
        if (!effectivenessMap[habit.strategyId]) {
          effectivenessMap[habit.strategyId] = { quality: [], count: 0 };
        }
        effectivenessMap[habit.strategyId].quality.push(entry.quality);
        effectivenessMap[habit.strategyId].count++;
      });
    });

    return Object.entries(effectivenessMap)
      .map(([strategyId, data]) => {
        const strategy = strategies.find(s => s.id === Number(strategyId));
        const avgQuality = data.quality.reduce((a, b) => a + b, 0) / data.quality.length;
        return {
          strategy: strategy?.title.slice(0, 20) || 'Unknown',
          effectiveness: Math.round(avgQuality * 10),
          timesUsed: data.count,
        };
      })
      .sort((a, b) => b.effectiveness - a.effectiveness)
      .slice(0, 8);
  };

  // Psychological Insights - Worry Patterns
  const getWorryPatterns = () => {
    const days = parseInt(timeRange);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const filtered = worryEntries.filter(e => new Date(e.date) >= cutoffDate);

    const categoryCount: { [key: string]: number } = {};
    filtered.forEach(entry => {
      categoryCount[entry.category] = (categoryCount[entry.category] || 0) + 1;
    });

    return Object.entries(categoryCount).map(([category, count]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      count,
    }));
  };

  // Sleep Stages Analysis
  const getSleepStagesData = () => {
    const filtered = getFilteredEntries(sleepEntries).slice(-7);
    return filtered.map(entry => ({
      date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      deep: entry.hoursSlept * 0.2, // Estimate 20% deep sleep
      rem: entry.hoursSlept * 0.25, // Estimate 25% REM
      light: entry.hoursSlept * 0.5, // Estimate 50% light sleep
      awake: entry.hoursSlept * 0.05, // Estimate 5% awake
    }));
  };

  // Overall Sleep Health Score
  const getSleepHealthScore = () => {
    const filtered = getFilteredEntries(sleepEntries);
    if (filtered.length === 0) return 0;

    const avgQuality = filtered.reduce((sum, e) => sum + e.quality, 0) / filtered.length;
    const avgDuration = filtered.reduce((sum, e) => sum + e.hoursSlept, 0) / filtered.length;
    const consistencyScore = getCircadianConsistency();
    const { totalDebt } = getSleepDebt();

    // Weighted scoring
    const qualityScore = (avgQuality / 10) * 40; // 40% weight
    const durationScore = Math.min(40, (avgDuration / profile.targetSleepHours) * 40); // 40% weight
    const consistencyWeight = consistencyScore * 0.15; // 15% weight
    const debtPenalty = Math.max(0, 5 - (totalDebt / 2)); // 5% weight

    return Math.round(qualityScore + durationScore + consistencyWeight + debtPenalty);
  };

  // Mood & Sleep Quality Correlation
  const getMoodSleepCorrelation = () => {
    const filtered = getFilteredEntries(sleepEntries).filter(e => e.mood !== undefined);
    return filtered.slice(-14).map(entry => ({
      date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      sleepQuality: entry.quality,
      mood: entry.mood || 5,
    }));
  };

  // Medical Insights
  const getMedicalInsights = () => {
    const filtered = getFilteredEntries(sleepEntries);
    const { totalDebt } = getSleepDebt();
    const avgQuality = filtered.reduce((sum, e) => sum + e.quality, 0) / filtered.length;
    const avgDuration = filtered.reduce((sum, e) => sum + e.hoursSlept, 0) / filtered.length;
    const consistencyScore = getCircadianConsistency();

    const insights = [];

    // Sleep Duration Assessment
    if (avgDuration < 6) {
      insights.push({
        type: 'critical',
        icon: AlertCircle,
        title: 'Chronic Sleep Deprivation Risk',
        description: 'Averaging less than 6 hours of sleep increases risk of cardiovascular disease, obesity, and cognitive decline.',
        recommendation: 'Prioritize extending sleep duration by 30 minutes each week until reaching 7-9 hours.',
      });
    } else if (avgDuration < 7) {
      insights.push({
        type: 'warning',
        icon: AlertCircle,
        title: 'Suboptimal Sleep Duration',
        description: 'Current sleep duration may affect immune function, memory consolidation, and emotional regulation.',
        recommendation: 'Aim to gradually increase sleep time to meet the 7-9 hour recommendation for adults.',
      });
    }

    // Sleep Debt Assessment
    if (totalDebt > 10) {
      insights.push({
        type: 'critical',
        icon: Battery,
        title: 'Significant Sleep Debt',
        description: `You have accumulated ${totalDebt.toFixed(1)} hours of sleep debt, which impairs cognitive performance similar to alcohol intoxication.`,
        recommendation: 'Plan 2-3 nights of extended sleep (9-10 hours) and maintain consistency to recover.',
      });
    }

    // Circadian Rhythm Assessment
    if (consistencyScore < 60) {
      insights.push({
        type: 'warning',
        icon: Moon,
        title: 'Irregular Circadian Rhythm',
        description: 'Inconsistent sleep schedule disrupts your body\'s natural clock, affecting hormone regulation and metabolism.',
        recommendation: 'Set the same bedtime and wake time daily, including weekends, to strengthen circadian rhythm.',
      });
    }

    // Sleep Quality Assessment
    if (avgQuality < 5) {
      insights.push({
        type: 'critical',
        icon: Brain,
        title: 'Poor Sleep Quality',
        description: 'Low sleep quality affects memory formation, emotional processing, and physical recovery.',
        recommendation: 'Review sleep environment (temperature, darkness, noise) and wind-down routine. Consider sleep study if persistent.',
      });
    }

    // Positive Feedback
    if (avgQuality >= 7 && avgDuration >= 7 && consistencyScore >= 70) {
      insights.push({
        type: 'success',
        icon: Award,
        title: 'Excellent Sleep Health',
        description: 'Your sleep metrics indicate healthy patterns that support optimal cognitive function, emotional wellbeing, and physical health.',
        recommendation: 'Maintain your current practices. Continue tracking to ensure consistency.',
      });
    }

    return insights;
  };

  // Week-over-Week Progress
  const getProgressComparison = () => {
    const allEntries = sleepEntries.slice().sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const lastWeek = allEntries.slice(-7);
    const previousWeek = allEntries.slice(-14, -7);

    const calcAvg = (entries: SleepEntry[]) => {
      if (entries.length === 0) return { quality: 0, duration: 0 };
      return {
        quality: entries.reduce((sum, e) => sum + e.quality, 0) / entries.length,
        duration: entries.reduce((sum, e) => sum + e.hoursSlept, 0) / entries.length,
      };
    };

    const current = calcAvg(lastWeek);
    const previous = calcAvg(previousWeek);

    return {
      qualityChange: ((current.quality - previous.quality) / previous.quality) * 100 || 0,
      durationChange: ((current.duration - previous.duration) / previous.duration) * 100 || 0,
      current,
      previous,
    };
  };

  const sleepHealthScore = getSleepHealthScore();
  const consistencyScore = getCircadianConsistency();
  const { totalDebt } = getSleepDebt();
  const progressComparison = getProgressComparison();

  // Generate dynamic AI Insight
  const getAiInsight = () => {
    if (sleepEntries.length === 0) return "Not enough data yet. Track your sleep tonight to receive personalized AI insights tomorrow morning!";
    if (sleepHealthScore > 85) return "Stellar sleep patterns! Your consistency is paying off. To optimize further, consider fine-tuning your wind-down environment with cooler temperatures.";
    if (totalDebt > 5) return `You've accumulated ${totalDebt.toFixed(1)} hours of sleep debt. Tonight, aim to get into bed 30 minutes earlier to gently start repaying this debt without disrupting your circadian rhythm.`;
    if (consistencyScore < 70) return "Your sleep schedule has been varying significantly. Focusing on a consistent wake time (even on weekends) will be the most powerful lever to boost your daily energy.";
    if (progressComparison.qualityChange < -10) return "I noticed a dip in your sleep quality recently. You might want to revisit the 4-7-8 Breathing exercise in the Strategies tab if you're feeling restless at night.";
    return "You're building solid sleep habits. Focus on maintaining a consistent dark and cool environment tonight for a deeper, more restorative rest.";
  };

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
          <h1 className="text-2xl font-bold text-white">Sleep Analytics</h1>
          <p className="text-slate-400">Medical & psychological insights</p>
        </div>
      </div>

      {/* Time Range Filter */}
      <div className="flex gap-2">
        {(['7', '30', '90'] as const).map((days) => (
          <button
            key={days}
            onClick={() => setTimeRange(days)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${timeRange === days
                ? 'bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.6)] border-2 border-indigo-400'
                : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
              }`}
          >
            {days} Days
          </button>
        ))}
      </div>

      {/* AI Sleep Coach Insight */}
      <Card className="p-6 bg-gradient-to-r from-indigo-900/60 via-violet-900/40 to-slate-900 border-2 border-indigo-500/50 shadow-[0_0_25px_rgba(99,102,241,0.2)] relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-indigo-500/20 blur-2xl rounded-full"></div>
        <div className="flex items-start gap-4 relative z-10">
          <div className="p-3 rounded-xl bg-indigo-500/20 border border-indigo-400/30">
            <Sparkles className="w-6 h-6 text-indigo-300 animate-pulse" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-violet-300">
                AI Sleep Coach
              </span>
            </h2>
            <p className="text-slate-200 text-md leading-relaxed">
              {getAiInsight()}
            </p>
          </div>
        </div>
      </Card>

      {/* Overall Health Score */}
      <Card className="p-6 bg-gradient-to-br from-indigo-500/20 to-blue-500/10 border-2 border-indigo-400/40 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Overall Sleep Health Score</h2>
          <div className="text-right">
            <div className="text-4xl font-bold text-indigo-400">{sleepHealthScore}</div>
            <div className="text-sm text-slate-300">out of 100</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{consistencyScore}</div>
            <div className="text-xs text-slate-400">Consistency</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{totalDebt.toFixed(1)}h</div>
            <div className="text-xs text-slate-400">Sleep Debt</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${progressComparison.qualityChange >= 0 ? 'text-indigo-400' : 'text-red-400'}`}>
              {progressComparison.qualityChange >= 0 ? '+' : ''}{progressComparison.qualityChange.toFixed(1)}%
            </div>
            <div className="text-xs text-slate-400">vs Last Week</div>
          </div>
        </div>
      </Card>

      {/* Tabs for Different Analytics */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800 border border-slate-700">
          <TabsTrigger value="trends" className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white">
            Trends
          </TabsTrigger>
          <TabsTrigger value="medical" className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white">
            Medical
          </TabsTrigger>
          <TabsTrigger value="psychology" className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white">
            Psychology
          </TabsTrigger>
          <TabsTrigger value="strategies" className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white">
            Strategies
          </TabsTrigger>
        </TabsList>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-4">
          {/* Sleep Quality Trend */}
          <Card className="p-6 bg-slate-800 border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Sleep Quality & Duration Trend
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={getSleepQualityTrend()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
                <Legend />
                <Line type="monotone" dataKey="quality" stroke="#818cf8" strokeWidth={2} name="Quality (1-10)" />
                <Line type="monotone" dataKey="duration" stroke="#c084fc" strokeWidth={2} name="Hours Slept" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Sleep Debt */}
          <Card className="p-6 bg-slate-800 border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Sleep Debt Accumulation (Last 14 Days)
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={getSleepDebt().debtData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
                <Legend />
                <Area type="monotone" dataKey="debt" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} name="Daily Debt (hours)" />
                <Area type="monotone" dataKey="cumulative" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} name="Cumulative Debt" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Mood & Sleep Correlation */}
          <Card className="p-6 bg-slate-800 border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-400" />
              Mood & Sleep Quality Correlation
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={getMoodSleepCorrelation()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
                <Legend />
                <Line type="monotone" dataKey="sleepQuality" stroke="#10b981" strokeWidth={2} name="Sleep Quality" />
                <Line type="monotone" dataKey="mood" stroke="#ec4899" strokeWidth={2} name="Mood Rating" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        {/* Medical Tab */}
        <TabsContent value="medical" className="space-y-4">
          {/* Medical Insights */}
          {getMedicalInsights().map((insight, index) => {
            const Icon = insight.icon;
            return (
              <Card
                key={index}
                className={`p-6 border-2 ${insight.type === 'critical'
                    ? 'bg-red-500/10 border-red-400/40 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                    : insight.type === 'warning'
                      ? 'bg-yellow-500/10 border-yellow-400/40 shadow-[0_0_15px_rgba(234,179,8,0.3)]'
                      : 'bg-indigo-500/10 border-indigo-400/40 shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                  }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-xl ${insight.type === 'critical'
                        ? 'bg-red-500/20'
                        : insight.type === 'warning'
                          ? 'bg-yellow-500/20'
                          : 'bg-indigo-500/20'
                      }`}
                  >
                    <Icon
                      className={`w-6 h-6 ${insight.type === 'critical'
                          ? 'text-red-400'
                          : insight.type === 'warning'
                            ? 'text-yellow-400'
                            : 'text-indigo-400'
                        }`}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">{insight.title}</h3>
                    <p className="text-slate-300 text-sm mb-3">{insight.description}</p>
                    <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                      <p className="text-xs text-slate-400 mb-1 font-semibold">Recommendation:</p>
                      <p className="text-sm text-slate-200">{insight.recommendation}</p>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}

          {/* Sleep Stages */}
          <Card className="p-6 bg-slate-800 border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-400" />
              Estimated Sleep Stages (Last 7 Days)
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={getSleepStagesData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
                <Legend />
                <Bar dataKey="deep" stackId="a" fill="#8b5cf6" name="Deep Sleep" />
                <Bar dataKey="rem" stackId="a" fill="#3b82f6" name="REM Sleep" />
                <Bar dataKey="light" stackId="a" fill="#06b6d4" name="Light Sleep" />
                <Bar dataKey="awake" stackId="a" fill="#f59e0b" name="Awake" />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-slate-400 mt-3">
              * Estimated based on total sleep duration using typical sleep architecture patterns
            </p>
          </Card>

          {/* Circadian Rhythm Score */}
          <Card className="p-6 bg-slate-800 border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Moon className="w-5 h-5 text-blue-400" />
              Circadian Rhythm Consistency
            </h3>
            <div className="text-center mb-4">
              <div className="text-5xl font-bold text-blue-400 mb-2">{consistencyScore}%</div>
              <p className="text-slate-300">
                {consistencyScore >= 80
                  ? '🎉 Excellent consistency! Your circadian rhythm is well-regulated.'
                  : consistencyScore >= 60
                    ? '👍 Good consistency. Small improvements will enhance your rhythm.'
                    : '⚠️ Irregular schedule detected. Prioritize consistent sleep/wake times.'}
              </p>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
              <h4 className="text-sm font-semibold text-white mb-2">Why It Matters:</h4>
              <p className="text-xs text-slate-300">
                Circadian rhythm consistency affects melatonin production, cortisol regulation, body temperature, and
                metabolic function. Regular sleep schedules improve sleep quality, mood, and cognitive performance.
              </p>
            </div>
          </Card>
        </TabsContent>

        {/* Psychology Tab */}
        <TabsContent value="psychology" className="space-y-4">
          {/* Worry Patterns */}
          {worryEntries.length > 0 && (
            <Card className="p-6 bg-slate-800 border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                Worry Pattern Analysis
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={getWorryPatterns()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="category" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                    labelStyle={{ color: '#f1f5f9' }}
                  />
                  <Bar dataKey="count" fill="#a855f7" name="Worry Count" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                <h4 className="text-sm font-semibold text-white mb-2">Psychological Insight:</h4>
                <p className="text-xs text-slate-300 mb-2">
                  Identifying worry patterns helps you recognize cognitive patterns that interfere with sleep. Most
                  common categories indicate areas where proactive stress management may be beneficial.
                </p>
                <p className="text-xs text-emerald-400">
                  💡 Try scheduling a "worry window" 2-3 hours before bed to process concerns before sleep time.
                </p>
              </div>
            </Card>
          )}

          {/* Emotional Wellbeing */}
          <Card className="p-6 bg-slate-800 border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-400" />
              Emotional Wellbeing & Sleep
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                <span className="text-slate-300 text-sm">Avg Morning Mood</span>
                <span className="text-lg font-bold text-pink-400">
                  {(
                    sleepEntries.filter(e => e.mood).reduce((sum, e) => sum + (e.mood || 0), 0) /
                    sleepEntries.filter(e => e.mood).length || 0
                  ).toFixed(1)}
                  /10
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                <span className="text-slate-300 text-sm">Worry Journal Entries</span>
                <span className="text-lg font-bold text-purple-400">{worryEntries.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                <span className="text-slate-300 text-sm">Sleep Quality Impact</span>
                <span className="text-lg font-bold text-emerald-400">
                  {progressComparison.qualityChange >= 0 ? '+' : ''}
                  {progressComparison.qualityChange.toFixed(0)}%
                </span>
              </div>
            </div>

            <div className="mt-4 bg-gradient-to-br from-pink-500/10 to-purple-500/10 p-4 rounded-lg border border-pink-400/30">
              <h4 className="text-sm font-semibold text-white mb-2">Cognitive Behavioral Insight:</h4>
              <p className="text-xs text-slate-300">
                The bidirectional relationship between sleep and emotional regulation means improving sleep quality
                enhances emotional resilience, while managing stress and worries improves sleep. Track both for optimal
                mental health.
              </p>
            </div>
          </Card>

          {/* Stress & Recovery Balance */}
          <Card className="p-6 bg-slate-800 border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-400" />
              Stress & Recovery Balance
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-300">Recovery Score</span>
                  <span className="text-emerald-400 font-semibold">{Math.min(100, sleepHealthScore + 10)}%</span>
                </div>
                <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-green-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                    style={{ width: `${Math.min(100, sleepHealthScore + 10)}%` }}
                  />
                </div>
              </div>
              <p className="text-xs text-slate-400">
                Your recovery score indicates how well your sleep supports physical and psychological restoration.
                Higher scores correlate with better stress resilience and cognitive performance.
              </p>
            </div>
          </Card>
        </TabsContent>

        {/* Strategies Tab */}
        <TabsContent value="strategies" className="space-y-4">
          {/* Strategy Effectiveness */}
          <Card className="p-6 bg-slate-800 border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              Strategy Effectiveness Ranking
            </h3>
            {getStrategyEffectiveness().length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getStrategyEffectiveness()} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis type="number" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                  <YAxis dataKey="strategy" type="category" stroke="#94a3b8" style={{ fontSize: '11px' }} width={120} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                    labelStyle={{ color: '#f1f5f9' }}
                  />
                  <Bar dataKey="effectiveness" fill="#10b981" name="Effectiveness Score" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-400">Start tracking strategies to see effectiveness data</p>
              </div>
            )}
            <div className="mt-4 bg-slate-900/50 p-4 rounded-lg border border-slate-700">
              <p className="text-xs text-slate-300">
                Effectiveness is calculated based on sleep quality on nights when each strategy was practiced.
                Strategies with higher scores correlate with better sleep outcomes for you personally.
              </p>
            </div>
          </Card>

          {/* Habit Consistency */}
          <Card className="p-6 bg-slate-800 border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              Habit Implementation Rate
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                <div className="text-3xl font-bold text-emerald-400 mb-1">
                  {habitEntries.filter(h => h.completed).length}
                </div>
                <div className="text-xs text-slate-400">Total Habits Completed</div>
              </div>
              <div className="text-center p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                <div className="text-3xl font-bold text-blue-400 mb-1">
                  {Math.round(
                    (habitEntries.filter(h => h.completed).length / Math.max(1, habitEntries.length)) * 100
                  )}
                  %
                </div>
                <div className="text-xs text-slate-400">Completion Rate</div>
              </div>
            </div>
            <div className="mt-4 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 p-4 rounded-lg border border-emerald-400/30">
              <p className="text-xs text-slate-300">
                <strong>Behavioral Science:</strong> Consistency is more important than perfection. Implementing
                strategies 80%+ of the time leads to lasting behavioral change and improved sleep outcomes.
              </p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Export/Share Section */}
      <Card className="p-6 bg-slate-800 border-slate-700">
        <h3 className="font-semibold text-white mb-3">📊 Share with Healthcare Provider</h3>
        <p className="text-sm text-slate-300 mb-4">
          These analytics can be shared with your doctor or sleep specialist to provide detailed insights into your
          sleep patterns, habits, and progress.
        </p>
        <Button className="w-full bg-emerald-500 hover:bg-emerald-600 border-2 border-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.5)]">
          Generate Sleep Report (PDF)
        </Button>
      </Card>
    </div>
  );
}