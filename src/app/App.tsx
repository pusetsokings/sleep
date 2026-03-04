import { useState } from 'react';
import { Home as HomeIcon, BookOpen, Calendar, User } from 'lucide-react';
import { Onboarding } from '@/app/components/Onboarding';
import { Home } from '@/app/components/Home';
import { Strategies } from '@/app/components/Strategies';
import { StrategyJourney } from '@/app/components/StrategyJourney';
import { Track } from '@/app/components/Track';
import { SleepEntryForm } from '@/app/components/SleepEntryForm';
import { WorryEntryForm } from '@/app/components/WorryEntryForm';
import { Analytics } from '@/app/components/Analytics';
import { Profile } from '@/app/components/Profile';
import { Settings } from '@/app/components/Settings';
import { useLocalStorage } from '@/app/hooks/useLocalStorage';
import { UserProfile, SleepEntry, HabitEntry, WorryEntry, Strategy } from '@/app/types';

type View = 'home' | 'strategies' | 'strategy-journey' | 'track' | 'sleep-entry' | 'worry-entry' | 'analytics' | 'profile' | 'settings';

export default function App() {
  const [profile, setProfile] = useLocalStorage<UserProfile | null>('sleepApp_profile', null);
  const [sleepEntries, setSleepEntries] = useLocalStorage<SleepEntry[]>('sleepApp_sleepEntries', []);
  const [habitEntries, setHabitEntries] = useLocalStorage<HabitEntry[]>('sleepApp_habitEntries', []);
  const [worryEntries, setWorryEntries] = useLocalStorage<WorryEntry[]>('sleepApp_worryEntries', []);
  
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);

  const handleOnboardingComplete = (newProfile: UserProfile) => {
    setProfile(newProfile);
    setCurrentView('home');
  };

  const handleNavigate = (view: string, data?: any) => {
    if (view === 'strategy-journey' && data) {
      setSelectedStrategy(data);
      setCurrentView('strategy-journey');
    } else {
      setCurrentView(view as View);
    }
  };

  const handleAddSleepEntry = (entry: Omit<SleepEntry, 'id'>) => {
    const newEntry: SleepEntry = {
      ...entry,
      id: `sleep-${Date.now()}`
    };
    setSleepEntries(prev => [newEntry, ...prev]);
    setCurrentView('track');
  };

  const handleAddWorryEntry = (entry: Omit<WorryEntry, 'id'>) => {
    const newEntry: WorryEntry = {
      ...entry,
      id: `worry-${Date.now()}`
    };
    setWorryEntries(prev => [newEntry, ...prev]);
    setCurrentView('track');
  };

  const handleToggleHabit = (strategyId: number, date: string) => {
    setHabitEntries(prev => {
      const existingIndex = prev.findIndex(h => h.date === date && h.strategyId === strategyId);
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          completed: !updated[existingIndex].completed
        };
        return updated;
      } else {
        return [...prev, { date, strategyId, completed: true }];
      }
    });
  };

  const handleDeleteSleepEntry = (id: string) => {
    setSleepEntries(prev => prev.filter(e => e.id !== id));
  };

  const handleResetData = () => {
    setSleepEntries([]);
    setHabitEntries([]);
    setWorryEntries([]);
    setCurrentView('profile');
  };

  // Show onboarding if no profile
  if (!profile || !profile.onboardingComplete) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950/30 to-black">
      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {currentView === 'home' && (
          <Home
            profile={profile}
            sleepEntries={sleepEntries}
            habitEntries={habitEntries}
            onNavigate={handleNavigate}
          />
        )}
        
        {currentView === 'strategies' && (
          <Strategies
            profile={profile}
            onNavigate={handleNavigate}
          />
        )}
        
        {currentView === 'strategy-journey' && selectedStrategy && (
          <StrategyJourney
            strategy={selectedStrategy}
            onBack={() => setCurrentView('strategies')}
          />
        )}
        
        {currentView === 'track' && (
          <Track
            profile={profile}
            sleepEntries={sleepEntries}
            habitEntries={habitEntries}
            worryEntries={worryEntries}
            onAddSleepEntry={() => setCurrentView('sleep-entry')}
            onAddWorryEntry={() => setCurrentView('worry-entry')}
            onToggleHabit={handleToggleHabit}
            onDeleteSleepEntry={handleDeleteSleepEntry}
            onNavigate={handleNavigate}
          />
        )}
        
        {currentView === 'sleep-entry' && (
          <SleepEntryForm
            profile={profile}
            onSave={handleAddSleepEntry}
            onCancel={() => setCurrentView('track')}
          />
        )}
        
        {currentView === 'worry-entry' && (
          <WorryEntryForm
            onSave={handleAddWorryEntry}
            onCancel={() => setCurrentView('track')}
          />
        )}
        
        {currentView === 'analytics' && (
          <Analytics
            profile={profile}
            sleepEntries={sleepEntries}
            habitEntries={habitEntries}
            worryEntries={worryEntries}
            onBack={() => setCurrentView('profile')}
          />
        )}
        
        {currentView === 'profile' && (
          <Profile
            profile={profile}
            sleepEntries={sleepEntries}
            habitEntries={habitEntries}
            onNavigate={handleNavigate}
          />
        )}
        
        {currentView === 'settings' && (
          <Settings
            profile={profile}
            onUpdate={setProfile}
            onBack={() => setCurrentView('profile')}
            onResetData={handleResetData}
          />
        )}
      </div>

      {/* Bottom Navigation */}
      {!['sleep-entry', 'worry-entry', 'strategy-journey', 'settings', 'analytics'].includes(currentView) && (
        <nav className="fixed bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur border-t border-indigo-500/20 shadow-[0_-5px_30px_rgba(99,102,241,0.15)] pb-safe">
          <div className="max-w-2xl mx-auto px-4">
            <div className="grid grid-cols-4 gap-1">
              <button
                onClick={() => setCurrentView('home')}
                className={`flex flex-col items-center py-3 px-2 transition-all duration-500 ${
                  currentView === 'home'
                    ? 'text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.6)] scale-105'
                    : 'text-slate-500 hover:text-indigo-300'
                }`}
                style={currentView === 'home' ? { animation: 'moonlight-pulse 3s ease-in-out infinite' } : {}}
              >
                <HomeIcon className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">Home</span>
              </button>
              
              <button
                onClick={() => setCurrentView('strategies')}
                className={`flex flex-col items-center py-3 px-2 transition-all duration-500 ${
                  currentView === 'strategies'
                    ? 'text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.6)] scale-105'
                    : 'text-slate-500 hover:text-indigo-300'
                }`}
                style={currentView === 'strategies' ? { animation: 'moonlight-pulse 3s ease-in-out infinite' } : {}}
              >
                <BookOpen className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">Strategies</span>
              </button>
              
              <button
                onClick={() => setCurrentView('track')}
                className={`flex flex-col items-center py-3 px-2 transition-all duration-500 ${
                  currentView === 'track'
                    ? 'text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.6)] scale-105'
                    : 'text-slate-500 hover:text-indigo-300'
                }`}
                style={currentView === 'track' ? { animation: 'moonlight-pulse 3s ease-in-out infinite' } : {}}
              >
                <Calendar className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">Track</span>
              </button>
              
              <button
                onClick={() => setCurrentView('profile')}
                className={`flex flex-col items-center py-3 px-2 transition-all duration-500 ${
                  currentView === 'profile'
                    ? 'text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.6)] scale-105'
                    : 'text-slate-500 hover:text-indigo-300'
                }`}
                style={currentView === 'profile' ? { animation: 'moonlight-pulse 3s ease-in-out infinite' } : {}}
              >
                <User className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">Profile</span>
              </button>
            </div>
          </div>
        </nav>
      )}
    </div>
  );
}