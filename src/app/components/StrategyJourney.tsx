import { useState } from 'react';
import { ArrowLeft, CheckCircle2, Circle, Lightbulb, ListTodo, Target, BookOpen, Trophy, Sparkles, Lock, Star, Thermometer, Sun, Coffee, Moon, Brain, Calendar, Activity, Wine, Zap, Home, Clock, Utensils, Heart, Battery } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Progress } from '@/app/components/ui/progress';
import { Strategy } from '@/app/types';

interface StrategyJourneyProps {
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

type TabType = 'overview' | 'plan' | 'challenge' | 'quiz' | 'reflect';

interface StepCompletion {
  [key: string]: boolean;
}

export function StrategyJourney({ strategy, onBack }: StrategyJourneyProps) {
  const Icon = iconMap[strategy.icon] || Moon;
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [completedSteps, setCompletedSteps] = useState<StepCompletion>({});
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: string }>({});
  const [reflection, setReflection] = useState('');
  const [challengeDay, setChallengeDay] = useState(1);

  const toggleStep = (stepId: string) => {
    setCompletedSteps(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };

  const getTotalProgress = () => {
    const totalSteps = strategy.actionItems.length + 7 + Object.keys(getQuizQuestions()).length;
    const completed = Object.values(completedSteps).filter(Boolean).length;
    return Math.round((completed / totalSteps) * 100);
  };

  const isTabUnlocked = (tab: TabType) => {
    if (tab === 'overview') return true;
    if (tab === 'plan') return completedSteps['overview-read'];
    if (tab === 'challenge') return completedSteps['plan-complete'];
    if (tab === 'quiz') return completedSteps['challenge-day3'];
    if (tab === 'reflect') return completedSteps['quiz-complete'];
    return false;
  };

  const tabs = [
    { id: 'overview' as TabType, label: 'Learn', icon: BookOpen },
    { id: 'plan' as TabType, label: 'Plan', icon: ListTodo },
    { id: 'challenge' as TabType, label: 'Challenge', icon: Target },
    { id: 'quiz' as TabType, label: 'Quiz', icon: Sparkles },
    { id: 'reflect' as TabType, label: 'Reflect', icon: Star },
  ];

  const getQuizQuestions = () => {
    const quizData: { [key: number]: Array<{ q: string; options: string[]; correct: number }> } = {
      1: [
        { q: 'What is the ideal bedroom temperature for sleep?', options: ['70-75°F', '60-67°F', '75-80°F'], correct: 1 },
        { q: 'Why does a cool room help you sleep?', options: ['It saves energy', 'Your body temperature drops naturally during sleep', 'It prevents sweating'], correct: 1 },
      ],
      2: [
        { q: 'How long before bed should you stop using screens?', options: ['30 minutes', '1-2 hours', '4 hours'], correct: 1 },
        { q: 'What does morning sunlight help regulate?', options: ['Vitamin D', 'Circadian rhythm', 'Energy levels'], correct: 1 },
      ],
      3: [
        { q: 'What is the half-life of caffeine?', options: ['2-3 hours', '5-6 hours', '8-10 hours'], correct: 1 },
        { q: 'When should you stop consuming caffeine?', options: ['After 2 PM (or noon if sensitive)', '6 PM', 'Bedtime'], correct: 0 },
      ],
      4: [
        { q: 'How long should your wind-down routine be?', options: ['10-15 minutes', '30-60 minutes', '2 hours'], correct: 1 },
        { q: 'What matters most in a wind-down routine?', options: ['Specific activities', 'Consistency', 'Duration'], correct: 1 },
      ],
      5: [
        { q: 'When should you schedule your worry window?', options: ['Right before bed', 'Earlier in the evening', 'Morning'], correct: 1 },
        { q: 'How long should a worry window last?', options: ['5-10 minutes', '15-20 minutes', '30-45 minutes'], correct: 1 },
      ],
      6: [
        { q: 'Should you keep the same sleep schedule on weekends?', options: ['No, sleep in', 'Yes, same time every day', 'Only wake time matters'], correct: 1 },
        { q: 'How long does it take to regulate your circadian rhythm?', options: ['3-5 days', '2-3 weeks', '2 months'], correct: 1 },
      ],
      7: [
        { q: 'When should you finish intense workouts?', options: ['1 hour before bed', '3-4 hours before bed', 'Right before bed'], correct: 1 },
        { q: 'How much does exercise improve sleep quality?', options: ['25%', '65%', '90%'], correct: 1 },
      ],
      8: [
        { q: 'How long before bed should you stop drinking alcohol?', options: ['1 hour', '3-4 hours', 'Right at bedtime'], correct: 1 },
        { q: 'What does alcohol reduce?', options: ['REM sleep', 'Light sleep', 'Deep sleep'], correct: 0 },
      ],
      9: [
        { q: 'What is the ideal power nap duration?', options: ['10-15 minutes', '20-30 minutes', '60 minutes'], correct: 1 },
        { q: 'What is the latest time to nap?', options: ['12 PM', '2 PM', '4 PM'], correct: 1 },
      ],
      10: [
        { q: 'What should you use your bed for only?', options: ['Sleep and intimacy', 'Everything', 'Work and sleep'], correct: 0 },
        { q: 'What helps block light?', options: ['Sunglasses', 'Blackout curtains or sleep mask', 'Dim lighting'], correct: 1 },
      ],
      11: [
        { q: 'How long should you wait before getting out of bed if you can\'t sleep?', options: ['5 minutes', '15-20 minutes', '1 hour'], correct: 1 },
        { q: 'What should you do when you can\'t sleep?', options: ['Watch TV', 'Read in dim light', 'Check phone'], correct: 1 },
      ],
      12: [
        { q: 'When should you finish large meals?', options: ['1 hour before bed', '3+ hours before bed', 'Right before bed'], correct: 1 },
        { q: 'What type of snack is good before bed?', options: ['Spicy foods', 'Complex carbs with tryptophan', 'High-fat meals'], correct: 1 },
      ],
      13: [
        { q: 'What breathing technique helps relaxation?', options: ['2-4-6 breathing', '4-7-8 breathing', '5-5-5 breathing'], correct: 1 },
        { q: 'What system does relaxation activate?', options: ['Sympathetic', 'Parasympathetic', 'Central'], correct: 1 },
      ],
      14: [
        { q: 'How much sleep do most adults need?', options: ['5-6 hours', '7-9 hours', '10-12 hours'], correct: 1 },
        { q: 'How long to recover from chronic sleep debt?', options: ['One night', '1-2 weeks', '1 month'], correct: 1 },
      ],
    };
    return quizData[strategy.id] || [];
  };

  const get7DayChallenge = () => {
    const challenges: { [key: number]: string[] } = {
      1: [
        'Set your bedroom temperature between 60-67°F tonight',
        'Notice how you feel with the cooler temperature',
        'Adjust blankets instead of thermostat if cold',
        'Take a warm shower 90 minutes before bed',
        'Track your sleep quality with cool room',
        'Experiment with different blanket combinations',
        'Reflect: Did cooler temps improve your sleep?',
      ],
      2: [
        'Set your digital sunset time (1-2 hours before bed)',
        'Get 10 minutes of morning sunlight within 1 hour of waking',
        'Enable night mode on all devices',
        'Replace evening screen time with reading',
        'Try blue-light-blocking glasses in evening',
        'Track how you feel without evening screens',
        'Reflect: Do you fall asleep faster without screens?',
      ],
      3: [
        'Set your caffeine cutoff time (2 PM or noon)',
        'Identify all sources of caffeine you consume',
        'Replace afternoon coffee with herbal tea',
        'Notice energy levels without late caffeine',
        'Track sleep quality without afternoon caffeine',
        'Find 3 non-caffeinated afternoon beverages you enjoy',
        'Reflect: How has eliminating late caffeine affected sleep?',
      ],
      4: [
        'Choose 3-4 calming activities for your routine',
        'Set a consistent routine start time',
        'Practice your routine for the first time',
        'Do the same routine at the same time',
        'Add gentle stretching or meditation',
        'Prepare all materials you need for routine',
        'Reflect: Is your routine becoming automatic?',
      ],
      5: [
        'Schedule your worry window time (before dinner)',
        'Spend 15-20 minutes journaling worries',
        'Make tomorrow\'s to-do list during worry window',
        'Practice redirecting bedtime thoughts',
        'Keep notepad by bed for night thoughts',
        'Notice if bedtime anxiety reduces',
        'Reflect: Has the worry window helped?',
      ],
      6: [
        'Set your consistent wake time',
        'Calculate your ideal bedtime',
        'Wake at same time even if you slept poorly',
        'Maintain schedule on the weekend',
        'Track how you feel with consistent schedule',
        'Set daily alarms for sleep and wake times',
        'Reflect: Do you feel sleepy at bedtime naturally?',
      ],
      7: [
        'Schedule workouts for morning or afternoon',
        'Track how exercise timing affects sleep',
        'If evening exercise, keep it light (yoga/walking)',
        'Complete 20-30 minutes of physical activity',
        'Notice energy patterns throughout day',
        'Experiment with different exercise times',
        'Reflect: What workout timing works best?',
      ],
      8: [
        'Set your alcohol cutoff time (3-4 hours before bed)',
        'Track sleep quality on a non-drinking night',
        'Notice nighttime awakenings with/without alcohol',
        'Find alcohol-free evening beverages you enjoy',
        'Compare deep sleep on drinking vs. non-drinking nights',
        'Track morning energy levels',
        'Reflect: How does alcohol affect your sleep?',
      ],
      9: [
        'Decide: eliminate naps or set strict rules',
        'If napping, set 20-minute timer',
        'Track how naps affect nighttime sleep',
        'Try skipping naps to build sleep pressure',
        'Notice sleepiness levels at bedtime',
        'Experiment with nap timing',
        'Reflect: Do naps help or hurt your nighttime sleep?',
      ],
      10: [
        'Remove TV or work materials from bedroom',
        'Install blackout curtains or get sleep mask',
        'Set up white noise machine or app',
        'Hide or remove bedroom clock',
        'Make bedroom cooler, darker, quieter',
        'Only use bed for sleep (and intimacy)',
        'Reflect: Is your bedroom a true sanctuary?',
      ],
      11: [
        'Prepare a boring book in another room',
        'Set up dim lighting in your backup space',
        'Practice the 15-minute rule tonight',
        'Leave bed if you can\'t sleep after 15 minutes',
        'Do something boring until sleepy',
        'Track how quickly you fall asleep',
        'Reflect: Does leaving bed help you fall asleep faster?',
      ],
      12: [
        'Set your last meal time (3+ hours before bed)',
        'Identify sleep-friendly evening snacks',
        'Reduce fluid intake 2 hours before bed',
        'Try a light snack 1-2 hours before bed',
        'Avoid spicy or high-fat foods at dinner',
        'Track nighttime bathroom trips',
        'Reflect: Has meal timing improved your sleep?',
      ],
      13: [
        'Learn 4-7-8 breathing technique',
        'Practice breathing for 5 minutes today',
        'Try progressive muscle relaxation',
        'Practice relaxation during the day',
        'Use relaxation technique before bed',
        'Notice stress levels and sleep quality',
        'Reflect: Which relaxation technique works best?',
      ],
      14: [
        'Calculate your personal sleep need (7-9 hours)',
        'Schedule sleep like an important appointment',
        'Track sleep duration for 3 nights',
        'Prioritize getting full sleep hours',
        'Notice energy and mood improvements',
        'Eliminate one activity to make room for sleep',
        'Reflect: How does adequate sleep change your day?',
      ],
    };
    return challenges[strategy.id] || [];
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header with Progress */}
      <div>
        <div className="flex items-center gap-4 mb-4">
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

        {/* Progress Bar */}
        <Card className="p-4 bg-gradient-to-r from-emerald-500/20 to-green-500/10 border-2 border-emerald-400/40 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-emerald-200 font-semibold">Journey Progress</span>
            <span className="text-sm text-emerald-300 font-bold">{getTotalProgress()}%</span>
          </div>
          <Progress value={getTotalProgress()} className="h-2 bg-slate-700" />
          {getTotalProgress() === 100 && (
            <div className="mt-3 flex items-center gap-2 text-emerald-300 animate-pulse">
              <Trophy className="w-4 h-4" />
              <span className="text-sm font-semibold">🎉 Strategy Mastered!</span>
            </div>
          )}
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          const isUnlocked = isTabUnlocked(tab.id);

          return (
            <button
              key={tab.id}
              onClick={() => isUnlocked && setActiveTab(tab.id)}
              disabled={!isUnlocked}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.6)] border-2 border-emerald-400'
                  : isUnlocked
                  ? 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                  : 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
              }`}
            >
              {isUnlocked ? <TabIcon className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              <span className="text-sm font-semibold">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
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

          {/* Complete Overview */}
          <Button
            onClick={() => {
              toggleStep('overview-read');
              setActiveTab('plan');
            }}
            className="w-full bg-emerald-500 hover:bg-emerald-600 border-2 border-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:shadow-[0_0_30px_rgba(16,185,129,0.7)] transition-all"
          >
            {completedSteps['overview-read'] ? '✓ Overview Complete - View Action Plan' : 'Continue to Action Plan →'}
          </Button>
        </div>
      )}

      {activeTab === 'plan' && (
        <div className="space-y-4">
          <Card className="p-6 bg-gradient-to-br from-emerald-500/20 to-green-500/10 border-2 border-emerald-400/40 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <div className="flex items-center gap-2 mb-4">
              <ListTodo className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-semibold text-white">Your Action Plan</h2>
            </div>
            <p className="text-slate-300 text-sm mb-4">
              Check off each action item as you complete it. This is your personalized implementation plan.
            </p>

            <div className="space-y-2">
              {strategy.actionItems.map((item, index) => {
                const stepId = `action-${index}`;
                const isCompleted = completedSteps[stepId];

                return (
                  <button
                    key={index}
                    onClick={() => toggleStep(stepId)}
                    className={`w-full flex items-start gap-3 p-4 rounded-lg border transition-all ${
                      isCompleted
                        ? 'bg-emerald-500/20 border-emerald-400/50 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                        : 'bg-slate-800/50 border-slate-700 hover:border-emerald-500/30'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-500 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={`text-left ${isCompleted ? 'text-emerald-200' : 'text-slate-300'}`}>
                      {item}
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>

          <Button
            onClick={() => {
              toggleStep('plan-complete');
              setActiveTab('challenge');
            }}
            disabled={strategy.actionItems.some((_, i) => !completedSteps[`action-${i}`])}
            className="w-full bg-emerald-500 hover:bg-emerald-600 border-2 border-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.5)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {completedSteps['plan-complete'] ? '✓ Plan Complete - Start 7-Day Challenge' : 'Complete All Actions to Continue'}
          </Button>
        </div>
      )}

      {activeTab === 'challenge' && (
        <div className="space-y-4">
          <Card className="p-6 bg-gradient-to-br from-emerald-500/20 to-green-500/10 border-2 border-emerald-400/40 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-semibold text-white">7-Day Challenge</h2>
              </div>
              <span className="text-sm text-emerald-300 font-bold">Day {challengeDay}/7</span>
            </div>

            <p className="text-slate-300 text-sm mb-6">
              Complete one challenge per day for 7 days to build lasting habits and master this strategy.
            </p>

            <div className="space-y-3">
              {get7DayChallenge().map((challenge, index) => {
                const day = index + 1;
                const stepId = `challenge-day${day}`;
                const isCompleted = completedSteps[stepId];
                const isCurrentDay = day === challengeDay;

                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border transition-all ${
                      isCompleted
                        ? 'bg-emerald-500/20 border-emerald-400/50'
                        : isCurrentDay
                        ? 'bg-slate-800 border-emerald-400/40 shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-pulse'
                        : 'bg-slate-800/50 border-slate-700 opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => {
                          if (isCurrentDay || day < challengeDay) {
                            toggleStep(stepId);
                            if (!isCompleted && isCurrentDay) {
                              setChallengeDay(Math.min(7, day + 1));
                            }
                          }
                        }}
                        disabled={day > challengeDay}
                        className="mt-1"
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                        ) : (
                          <Circle className={`w-6 h-6 ${isCurrentDay ? 'text-emerald-400' : 'text-slate-500'}`} />
                        )}
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-emerald-300">Day {day}</span>
                          {isCurrentDay && !isCompleted && (
                            <span className="text-xs bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-400/40">
                              Today
                            </span>
                          )}
                        </div>
                        <p className={`text-sm ${isCompleted ? 'text-emerald-200 line-through' : isCurrentDay ? 'text-slate-200' : 'text-slate-400'}`}>
                          {challenge}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {completedSteps['challenge-day7'] && (
            <Button
              onClick={() => {
                setActiveTab('quiz');
              }}
              className="w-full bg-emerald-500 hover:bg-emerald-600 border-2 border-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:shadow-[0_0_30px_rgba(16,185,129,0.7)] transition-all"
            >
              🎉 Challenge Complete - Take the Quiz →
            </Button>
          )}
        </div>
      )}

      {activeTab === 'quiz' && (
        <div className="space-y-4">
          <Card className="p-6 bg-gradient-to-br from-emerald-500/20 to-green-500/10 border-2 border-emerald-400/40 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-semibold text-white">Knowledge Check</h2>
            </div>
            <p className="text-slate-300 text-sm mb-6">
              Test your understanding of this sleep strategy with a quick quiz.
            </p>

            <div className="space-y-6">
              {getQuizQuestions().map((quiz, qIndex) => {
                const questionId = `quiz-q${qIndex}`;
                const selectedAnswer = quizAnswers[questionId];
                const isCorrect = selectedAnswer === String(quiz.correct);

                return (
                  <div key={qIndex} className="space-y-3">
                    <p className="text-white font-semibold">{qIndex + 1}. {quiz.q}</p>
                    <div className="space-y-2">
                      {quiz.options.map((option, oIndex) => {
                        const isSelected = selectedAnswer === String(oIndex);
                        const showResult = selectedAnswer !== undefined;

                        return (
                          <button
                            key={oIndex}
                            onClick={() => {
                              setQuizAnswers(prev => ({ ...prev, [questionId]: String(oIndex) }));
                              if (oIndex === quiz.correct) {
                                toggleStep(questionId);
                              }
                            }}
                            disabled={showResult}
                            className={`w-full text-left p-3 rounded-lg border transition-all ${
                              showResult && oIndex === quiz.correct
                                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                                : showResult && isSelected && !isCorrect
                                ? 'bg-red-500/20 border-red-400 text-red-200'
                                : isSelected
                                ? 'bg-slate-700 border-emerald-400/50'
                                : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {showResult && oIndex === quiz.correct && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                              <span className="text-sm">{option}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {Object.keys(quizAnswers).length === getQuizQuestions().length && (
            <Button
              onClick={() => {
                toggleStep('quiz-complete');
                setActiveTab('reflect');
              }}
              className="w-full bg-emerald-500 hover:bg-emerald-600 border-2 border-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:shadow-[0_0_30px_rgba(16,185,129,0.7)] transition-all"
            >
              Continue to Reflection →
            </Button>
          )}
        </div>
      )}

      {activeTab === 'reflect' && (
        <div className="space-y-4">
          <Card className="p-6 bg-gradient-to-br from-emerald-500/20 to-green-500/10 border-2 border-emerald-400/40 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-semibold text-white">Reflection & Integration</h2>
            </div>

            <p className="text-slate-300 text-sm mb-4">
              Take a moment to reflect on your journey with this strategy. What did you learn? What will you continue?
            </p>

            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Share your thoughts, insights, and how this strategy has impacted your sleep..."
              className="w-full min-h-[200px] p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-400/50 focus:shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all"
            />

            {reflection.length > 20 && (
              <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-400/30 rounded-lg">
                <p className="text-emerald-300 text-sm">
                  ✓ Reflection saved! Your insights will help you continue this practice.
                </p>
              </div>
            )}
          </Card>

          <Card className="p-6 bg-slate-800 border-slate-700">
            <h3 className="font-semibold text-white mb-3">🎯 Next Steps</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>• Continue practicing this strategy daily for lasting results</li>
              <li>• Track your sleep quality in the Track tab</li>
              <li>• Explore other strategies to enhance your sleep even more</li>
              <li>• Share your progress and celebrate your consistency streak!</li>
            </ul>
          </Card>

          <Button
            onClick={() => {
              toggleStep('reflection-complete');
            }}
            disabled={reflection.length < 20}
            className="w-full bg-emerald-500 hover:bg-emerald-600 border-2 border-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:shadow-[0_0_30px_rgba(16,185,129,0.7)] transition-all disabled:opacity-50"
          >
            {completedSteps['reflection-complete'] ? '🏆 Journey Complete!' : 'Complete Reflection (Write 20+ characters)'}
          </Button>

          {getTotalProgress() === 100 && (
            <Card className="p-6 bg-gradient-to-r from-yellow-500/20 to-emerald-500/20 border-2 border-yellow-400/40 shadow-[0_0_30px_rgba(234,179,8,0.3)]">
              <div className="flex items-center gap-3 mb-3">
                <Trophy className="w-8 h-8 text-yellow-400" />
                <div>
                  <h3 className="text-xl font-bold text-white">Strategy Mastered! 🎉</h3>
                  <p className="text-yellow-200 text-sm">You've completed the full journey</p>
                </div>
              </div>
              <p className="text-slate-300 text-sm">
                Congratulations! You've learned, planned, practiced, tested your knowledge, and reflected on this strategy. Keep up the great work and continue your sleep improvement journey!
              </p>
            </Card>
          )}
        </div>
      )}
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
