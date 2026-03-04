import { useState, useEffect } from 'react';
import { Card } from '@/app/components/ui/card';
import { Wind } from 'lucide-react';

export function WindDown() {
    const [phase, setPhase] = useState<'idle' | 'inhale' | 'hold' | 'exhale'>('idle');
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (phase === 'inhale') {
            setTimeLeft(4);
            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        setPhase('hold');
                        return 7;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else if (phase === 'hold') {
            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        setPhase('exhale');
                        return 8;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else if (phase === 'exhale') {
            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        setPhase('inhale');
                        return 4;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => clearInterval(timer);
    }, [phase]);

    const toggleBreathing = () => {
        if (phase === 'idle') {
            setPhase('inhale');
        } else {
            setPhase('idle');
            setTimeLeft(0);
        }
    };

    const getPhaseText = () => {
        switch (phase) {
            case 'idle': return 'Tap to start Wind Down';
            case 'inhale': return 'Breathe In...';
            case 'hold': return 'Hold...';
            case 'exhale': return 'Breathe Out...';
        }
    };

    const getCircleScale = () => {
        switch (phase) {
            case 'idle': return 'scale-100';
            case 'inhale': return 'scale-150 duration-[4000ms] ease-out';
            case 'hold': return 'scale-150 duration-[7000ms]';
            case 'exhale': return 'scale-100 duration-[8000ms] ease-in-out';
        }
    };

    return (
        <Card className="p-6 bg-slate-900 border-indigo-500/30 overflow-hidden relative shadow-[0_0_20px_rgba(99,102,241,0.1)]">
            <div className="flex flex-col items-center justify-center space-y-8 z-10 relative">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                        <Wind className="w-6 h-6 text-indigo-400" />
                        4-7-8 Breathing
                    </h2>
                    <p className="text-slate-400 text-sm">A soothing rhythm to prepare for sleep</p>
                </div>

                <button
                    onClick={toggleBreathing}
                    className="relative w-40 h-40 flex items-center justify-center rounded-full bg-indigo-950/50 border border-indigo-500/30 focus:outline-none"
                >
                    {/* Animated pulsing background */}
                    <div className={`absolute inset-0 rounded-full bg-indigo-500/20 transition-transform ${getCircleScale()}`} />

                    <div className="z-10 text-center">
                        <p className="text-indigo-200 font-medium text-lg">{getPhaseText()}</p>
                        {phase !== 'idle' && (
                            <p className="text-3xl font-bold text-white mt-1">{timeLeft}</p>
                        )}
                    </div>
                </button>

                {phase !== 'idle' && (
                    <button
                        onClick={() => { setPhase('idle'); setTimeLeft(0); }}
                        className="text-xs text-slate-500 hover:text-white transition-colors"
                    >
                        Stop
                    </button>
                )}
            </div>
        </Card>
    );
}
