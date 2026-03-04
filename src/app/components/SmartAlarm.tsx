import { useState, useEffect, useRef } from 'react';
import { Bell, BellOff, Volume2, Moon, Sun, Play } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Switch } from '@/app/components/ui/switch';
import { format, parse, addMinutes, isAfter, isBefore } from 'date-fns';

interface SmartAlarmProps {
    targetWakeTime: string; // HH:mm format
}

export function SmartAlarm({ targetWakeTime }: SmartAlarmProps) {
    const [isAlarmEnabled, setIsAlarmEnabled] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [statusText, setStatusText] = useState("Alarm off");
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Soft piano / acoustic dawn sound for gentle waking
    const ALARM_AUDIO_URL = 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_b212f7193f.mp3?filename=gentle-ocean-waves-birdsong-and-gull-7109.mp3';
    const WAKE_WINDOW_MINUTES = 15; // Start volume fade 15 minutes before wake time

    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio(ALARM_AUDIO_URL);
            audioRef.current.loop = true;
            audioRef.current.volume = 0; // Start silent for fade-in
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = '';
            }
        };
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isAlarmEnabled && targetWakeTime) {
            setStatusText(`Alarm set for ${targetWakeTime}`);

            interval = setInterval(() => {
                const now = new Date();
                const wakeTime = parse(targetWakeTime, 'HH:mm', now);

                // If wake time has already passed today, set it for tomorrow
                if (isBefore(wakeTime, now)) {
                    wakeTime.setDate(wakeTime.getDate() + 1);
                }

                const wakeWindowStart = addMinutes(wakeTime, -WAKE_WINDOW_MINUTES);

                if (isAfter(now, wakeWindowStart) && isBefore(now, wakeTime)) {
                    // Inside the 15-minute gentle wake window
                    setStatusText("Gentle wake sequence initiating...");
                    if (audioRef.current && audioRef.current.paused) {
                        audioRef.current.play().catch(e => console.error(e));
                        setIsPlaying(true);
                    }

                    if (audioRef.current) {
                        // Calculate fade percentage (0.0 to 1.0)
                        const msPassed = now.getTime() - wakeWindowStart.getTime();
                        const msTotal = wakeTime.getTime() - wakeWindowStart.getTime();
                        const volumePhase = Math.min(msPassed / msTotal, 1);

                        // Logarithmic volume curve sounds more natural
                        audioRef.current.volume = Math.pow(volumePhase, 2);
                    }
                } else if (isAfter(now, wakeTime)) {
                    // Past the exact wake time: Max volume!
                    setStatusText("Time to wake up!");
                    if (audioRef.current) {
                        audioRef.current.volume = 1.0;
                        if (audioRef.current.paused) {
                            audioRef.current.play().catch(e => console.error(e));
                            setIsPlaying(true);
                        }
                    }
                } else {
                    setStatusText(`Alarm set for ${targetWakeTime}`);
                    if (audioRef.current && !audioRef.current.paused) {
                        audioRef.current.pause();
                        setIsPlaying(false);
                    }
                }
            }, 5000); // Check every 5 seconds
        } else {
            setStatusText("Alarm off");
            if (audioRef.current && !audioRef.current.paused) {
                audioRef.current.pause();
                setIsPlaying(false);
            }
        }

        return () => clearInterval(interval);
    }, [isAlarmEnabled, targetWakeTime]);

    const testAlarm = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.volume = 0.5; // Test at 50%
                audioRef.current.play().catch(e => console.error(e));
                setIsPlaying(true);
                setTimeout(() => {
                    if (audioRef.current) {
                        audioRef.current.pause();
                        setIsPlaying(false);
                    }
                }, 5000);
            }
        }
    };

    return (
        <Card className="p-6 bg-slate-900 border-indigo-500/20 overflow-hidden relative">
            <div className={`absolute inset-0 bg-gradient-to-tr from-orange-500/10 to-indigo-500/5 transition-opacity duration-1000 ${isAlarmEnabled ? 'opacity-100' : 'opacity-0'}`} />

            <div className="relative z-10 flex flex-col gap-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-xl transition-colors duration-500 ${isAlarmEnabled ? 'bg-orange-500/20 text-orange-400' : 'bg-slate-800 text-slate-500'}`}>
                            {isAlarmEnabled ? <Sun className="w-6 h-6 animate-[spin_20s_linear_infinite]" /> : <BellOff className="w-6 h-6" />}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">Smart Wake</h3>
                            <p className={`text-sm ${isAlarmEnabled ? 'text-orange-200' : 'text-slate-400'}`}>
                                {statusText}
                            </p>
                        </div>
                    </div>

                    <Switch
                        checked={isAlarmEnabled}
                        onCheckedChange={setIsAlarmEnabled}
                        className="data-[state=checked]:bg-orange-500"
                    />
                </div>

                {isAlarmEnabled && (
                    <div className="p-4 bg-slate-950/50 rounded-lg border border-slate-800 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-center gap-3">
                            <Volume2 className="w-4 h-4 text-orange-400" />
                            <div className="text-xs text-slate-300">
                                <span className="font-semibold text-white">15-minute gentle fade-in</span>
                                <br />Ocean waves & birdsong phase in starting at {
                                    format(addMinutes(parse(targetWakeTime, 'HH:mm', new Date()), -WAKE_WINDOW_MINUTES), 'h:mm a')
                                }
                            </div>
                        </div>
                        <button
                            onClick={testAlarm}
                            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors flex flex-col items-center gap-1"
                            title="Test Audio"
                        >
                            <Play className={`w-4 h-4 ${isPlaying ? 'text-orange-400' : ''}`} />
                            <span className="text-[10px]">Test</span>
                        </button>
                    </div>
                )}
            </div>
        </Card>
    );
}
