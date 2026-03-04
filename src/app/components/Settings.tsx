import { ArrowLeft, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Separator } from '@/app/components/ui/separator';
import { UserProfile } from '@/app/types';
import { strategies } from '@/app/data/strategies';

interface SettingsProps {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
  onBack: () => void;
  onResetData: () => void;
}

export function Settings({ profile, onUpdate, onBack, onResetData }: SettingsProps) {
  const [name, setName] = useState(profile.name);
  const [targetWakeTime, setTargetWakeTime] = useState(profile.targetWakeTime);
  const [targetBedTime, setTargetBedTime] = useState(profile.targetBedTime);
  const [caffeineTime, setCaffeineTime] = useState(profile.caffeineTime);
  const [selectedStrategies, setSelectedStrategies] = useState<number[]>(profile.selectedStrategies);

  const toggleStrategy = (id: number) => {
    setSelectedStrategies(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    onUpdate({
      ...profile,
      name,
      targetWakeTime,
      targetBedTime,
      caffeineTime,
      selectedStrategies: selectedStrategies.length > 0 ? selectedStrategies : [1, 2, 3]
    });
    onBack();
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      onResetData();
    }
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
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-slate-400">Customize your experience</p>
        </div>
      </div>

      {/* Personal Info */}
      <Card className="p-5 bg-slate-800 border-slate-700">
        <h3 className="text-white font-semibold mb-4">Personal Information</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-slate-300 mb-2 block">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
        </div>
      </Card>

      {/* Sleep Schedule */}
      <Card className="p-5 bg-slate-800 border-slate-700">
        <h3 className="text-white font-semibold mb-4">Sleep Schedule</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="wakeTime" className="text-slate-300 mb-2 block">Wake Time</Label>
              <Input
                id="wakeTime"
                type="time"
                value={targetWakeTime}
                onChange={(e) => setTargetWakeTime(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="bedTime" className="text-slate-300 mb-2 block">Bedtime</Label>
              <Input
                id="bedTime"
                type="time"
                value={targetBedTime}
                onChange={(e) => setTargetBedTime(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="caffeineTime" className="text-slate-300 mb-2 block">
              Caffeine Cutoff Time
            </Label>
            <Input
              id="caffeineTime"
              type="time"
              value={caffeineTime}
              onChange={(e) => setCaffeineTime(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
            />
            <p className="text-xs text-slate-500 mt-1">
              Recommended: No caffeine after 2 PM
            </p>
          </div>
        </div>
      </Card>

      {/* Focus Strategies */}
      <Card className="p-5 bg-slate-800 border-slate-700">
        <h3 className="text-white font-semibold mb-2">Focus Strategies</h3>
        <p className="text-sm text-slate-400 mb-4">
          Select the strategies you want to focus on (2-3 recommended)
        </p>
        <div className="space-y-2">
          {strategies.map((strategy) => (
            <div
              key={strategy.id}
              onClick={() => toggleStrategy(strategy.id)}
              className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                selectedStrategies.includes(strategy.id)
                  ? 'bg-emerald-500/20 border-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'bg-slate-700/50 border-slate-600 hover:border-emerald-500/30'
              }`}
            >
              <Checkbox checked={selectedStrategies.includes(strategy.id)} />
              <div className="flex-1">
                <div className="text-white text-sm font-medium">{strategy.title}</div>
                <div className="text-xs text-slate-400">{strategy.subtitle}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Separator className="bg-slate-700" />

      {/* Danger Zone */}
      <Card className="p-5 bg-red-500/10 border-red-500/30">
        <h3 className="text-red-400 font-semibold mb-2">Danger Zone</h3>
        <p className="text-sm text-slate-400 mb-4">
          Reset all app data including sleep entries, habits, and worry journal entries.
          This action cannot be undone.
        </p>
        <Button
          onClick={handleReset}
          variant="destructive"
          className="w-full"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Reset All Data
        </Button>
      </Card>

      {/* Save Button */}
      <div className="flex gap-3">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={!name}
          className="flex-1 bg-emerald-500 hover:bg-emerald-600 border-2 border-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:shadow-[0_0_30px_rgba(16,185,129,0.7)] transition-all"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}