import { useState } from 'react';
import { Moon, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Checkbox } from '@/app/components/ui/checkbox';
import { strategies } from '@/app/data/strategies';
import { UserProfile } from '@/app/types';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [selectedStrategies, setSelectedStrategies] = useState<number[]>([]);
  const [targetWakeTime, setTargetWakeTime] = useState('07:00');
  const [targetBedTime, setTargetBedTime] = useState('23:00');

  const handleComplete = () => {
    onComplete({
      name,
      onboardingComplete: true,
      selectedStrategies: selectedStrategies.length > 0 ? selectedStrategies : [1, 2, 3],
      targetBedTime,
      targetWakeTime,
      caffeineTime: '14:00'
    });
  };

  const toggleStrategy = (id: number) => {
    setSelectedStrategies(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-slate-900/90 backdrop-blur border-2 border-emerald-500/40 text-white p-8 shadow-[0_0_30px_rgba(16,185,129,0.3)]" style={{ animation: 'border-glow 3s ease-in-out infinite' }}>
        {step === 0 && (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="bg-emerald-500/20 p-6 rounded-full border-2 border-emerald-400/50 shadow-[0_0_40px_rgba(16,185,129,0.6)]" style={{ animation: 'neon-glow 2s ease-in-out infinite' }}>
                <Moon className="w-16 h-16 text-emerald-300" />
              </div>
            </div>
            <h1 className="text-4xl font-bold">Sleep Better Tonight</h1>
            <p className="text-slate-300 text-lg">
              Welcome to your journey toward better sleep. This app contains practical,
              science-backed strategies you can implement tonight.
            </p>
            <div className="space-y-4 text-left bg-slate-800/50 p-6 rounded-lg">
              <h3 className="font-semibold text-xl">Why Sleep Matters</h3>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Your brain consolidates memories</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Your body repairs tissue</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Your immune system strengthens</span>
                </li>
              </ul>
            </div>
            <Button 
              onClick={() => setStep(1)} 
              size="lg" 
              className="w-full bg-emerald-500 hover:bg-emerald-600 border-2 border-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:shadow-[0_0_30px_rgba(16,185,129,0.7)] transition-all"
            >
              Get Started <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">Let's personalize your experience</h2>
              <p className="text-slate-300">What should we call you?</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="bg-slate-800 border-slate-600 text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="wakeTime">Target Wake Time</Label>
                <Input
                  id="wakeTime"
                  type="time"
                  value={targetWakeTime}
                  onChange={(e) => setTargetWakeTime(e.target.value)}
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bedTime">Target Bedtime</Label>
                <Input
                  id="bedTime"
                  type="time"
                  value={targetBedTime}
                  onChange={(e) => setTargetBedTime(e.target.value)}
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Button 
                onClick={() => setStep(0)} 
                variant="outline"
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                onClick={() => setStep(2)} 
                disabled={!name}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 border-2 border-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:shadow-[0_0_30px_rgba(16,185,129,0.7)] transition-all"
              >
                Continue <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">Choose Your Focus Strategies</h2>
              <p className="text-slate-300">
                Select 2-3 strategies to start with. You can always adjust later.
              </p>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {strategies.map((strategy) => (
                <div
                  key={strategy.id}
                  onClick={() => toggleStrategy(strategy.id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedStrategies.includes(strategy.id)
                      ? 'border-emerald-400 bg-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                      : 'border-slate-700 bg-slate-800/50 hover:border-emerald-500/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={selectedStrategies.includes(strategy.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{strategy.title}</h3>
                      <p className="text-sm text-slate-400">{strategy.subtitle}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-4">
              <Button 
                onClick={() => setStep(1)} 
                variant="outline"
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                onClick={handleComplete}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 border-2 border-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:shadow-[0_0_30px_rgba(16,185,129,0.7)] transition-all"
              >
                Start Your Journey <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}