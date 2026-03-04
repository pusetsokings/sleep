import { useState } from 'react';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Textarea } from '@/app/components/ui/textarea';
import { Switch } from '@/app/components/ui/switch';
import { Label } from '@/app/components/ui/label';
import { WorryEntry } from '@/app/types';
import { format } from 'date-fns';

interface WorryEntryFormProps {
  onSave: (entry: Omit<WorryEntry, 'id'>) => void;
  onCancel: () => void;
}

export function WorryEntryForm({ onSave, onCancel }: WorryEntryFormProps) {
  const [content, setContent] = useState('');
  const [resolved, setResolved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    onSave({
      date: format(new Date(), 'yyyy-MM-dd'),
      time: format(new Date(), 'HH:mm'),
      content,
      resolved
    });
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
          <h1 className="text-2xl font-bold text-white">Worry Window</h1>
          <p className="text-slate-400">Process your thoughts</p>
        </div>
      </div>

      {/* Info Card */}
      <Card className="p-5 bg-gradient-to-br from-green-500/20 to-emerald-500/10 border-2 border-green-400/40 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
        <h3 className="font-semibold text-white mb-2">How to use this space:</h3>
        <ul className="text-sm text-slate-300 space-y-1">
          <li>• Write down what's on your mind</li>
          <li>• Make lists or plans for tomorrow</li>
          <li>• Process stressful thoughts</li>
          <li>• Release worries before bedtime</li>
        </ul>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Content */}
        <Card className="p-5 bg-slate-800 border-slate-700">
          <Label htmlFor="content" className="text-white mb-3 block">
            What's on your mind?
          </Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your thoughts, worries, or tomorrow's to-do list..."
            className="bg-slate-700 border-slate-600 text-white min-h-40"
            required
          />
        </Card>

        {/* Resolved Toggle */}
        <Card className="p-5 bg-slate-800 border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="resolved" className="text-white">Mark as resolved</Label>
              <p className="text-sm text-slate-400 mt-1">
                Did you find a solution or make a plan?
              </p>
            </div>
            <Switch
              id="resolved"
              checked={resolved}
              onCheckedChange={setResolved}
            />
          </div>
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
            disabled={!content.trim()}
            className="flex-1 bg-green-600 hover:bg-green-700 border-2 border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:shadow-[0_0_30px_rgba(34,197,94,0.7)] transition-all"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Save Entry
          </Button>
        </div>
      </form>
    </div>
  );
}