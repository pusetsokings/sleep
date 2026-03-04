import { useState } from 'react';
import { ArrowLeft, Moon } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Slider } from '@/app/components/ui/slider';
import { Checkbox } from '@/app/components/ui/checkbox';
import { SleepEntry, UserProfile } from '@/app/types';
import { strategies } from '@/app/data/strategies';
import { format } from 'date-fns';

interface SleepEntryFormProps {
  profile: UserProfile;
  onSave: (entry: Omit<SleepEntry, 'id'>) => void;
  onCancel: () => void;
}

export function SleepEntryForm({ profile, onSave, onCancel }: SleepEntryFormProps) {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [bedTime, setBedTime] = useState('23:00');
  const [wakeTime, setWakeTime] = useState('07:00');
  const [quality, setQuality] = useState([7]);
  const [notes, setNotes] = useState('');
  const [strategiesUsed, setStrategiesUsed] = useState<number[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      date,
      bedTime,
      wakeTime,
      quality: quality[0],
      notes,
      strategiesUsed
    });
  };

  const toggleStrategy = (id: number) => {
    setStrategiesUsed(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          onClick={onCancel}
          variant="ghost"
          size="icon"
          className="text-white hover:bg-slate-800"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-white">Log Sleep Entry</h1>
          <p className="text-slate-400">How did you sleep?</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date */}
        <Card className="p-5 bg-slate-800 border-slate-700">
          <Label htmlFor="date" className="text-white mb-2 block">Date</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-slate-700 border-slate-600 text-white"
          />
        </Card>

        {/* Sleep Times */}
        <Card className="p-5 bg-slate-800 border-slate-700">
          <h3 className="text-white font-semibold mb-4">Sleep Times</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bedTime" className="text-slate-300 mb-2 block">Bedtime</Label>
              <Input
                id="bedTime"
                type="time"
                value={bedTime}
                onChange={(e) => setBedTime(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="wakeTime" className="text-slate-300 mb-2 block">Wake Time</Label>
              <Input
                id="wakeTime"
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>
        </Card>

        {/* Sleep Quality */}
        <Card className="p-5 bg-slate-800 border-slate-700">
          <Label className="text-white mb-3 block">Sleep Quality</Label>
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-white min-w-[3rem]">
              {quality[0]}/10
            </span>
            <Slider
              value={quality}
              onValueChange={setQuality}
              min={1}
              max={10}
              step={1}
              className="flex-1"
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-2">
            <span>Poor</span>
            <span>Excellent</span>
          </div>
        </Card>

        {/* Strategies Used */}
        <Card className="p-5 bg-slate-800 border-slate-700">
          <Label className="text-white mb-3 block">Strategies Used</Label>
          <div className="space-y-2">
            {strategies.map((strategy) => (
              <div
                key={strategy.id}
                onClick={() => toggleStrategy(strategy.id)}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  strategiesUsed.includes(strategy.id)
                    ? 'bg-emerald-500/20 border-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'bg-slate-700/50 border-slate-600 hover:border-emerald-500/30'
                }`}
              >
                <Checkbox checked={strategiesUsed.includes(strategy.id)} />
                <span className="text-white text-sm">{strategy.title}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Notes */}
        <Card className="p-5 bg-slate-800 border-slate-700">
          <Label htmlFor="notes" className="text-white mb-2 block">Notes (Optional)</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How do you feel? Any observations?"
            className="bg-slate-700 border-slate-600 text-white min-h-24"
          />
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 border-2 border-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:shadow-[0_0_30px_rgba(16,185,129,0.7)] transition-all"
          >
            <Moon className="w-4 h-4 mr-2" />
            Save Entry
          </Button>
        </div>
      </form>
    </div>
  );
}