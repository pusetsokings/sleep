import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, CloudRain, Wind, Trees, Waves } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Slider } from '@/app/components/ui/slider';

// Using high-quality free ambient sounds via URLs
const SOUNDS = [
    {
        id: 'rain',
        title: 'Heavy Rain',
        icon: CloudRain,
        url: 'https://cdn.pixabay.com/download/audio/2022/07/04/audio_34b175da21.mp3?filename=heavy-rain-nature-sounds-8186.mp3',
        color: 'text-blue-400',
        bg: 'bg-blue-500/20',
        border: 'border-blue-500/30'
    },
    {
        id: 'waves',
        title: 'Ocean Waves',
        icon: Waves,
        url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_1ba57bae55.mp3?filename=ocean-waves-112906.mp3',
        color: 'text-cyan-400',
        bg: 'bg-cyan-500/20',
        border: 'border-cyan-500/30'
    },
    {
        id: 'forest',
        title: 'Night Forest',
        icon: Trees,
        url: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_22822a16d8.mp3?filename=night-forest-with-insects-14407.mp3',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/20',
        border: 'border-emerald-500/30'
    },
    {
        id: 'brown-noise',
        title: 'Deep Brown Noise',
        icon: Wind,
        url: 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_e25ffb415e.mp3?filename=brown-noise-121571.mp3',
        color: 'text-indigo-400',
        bg: 'bg-indigo-500/20',
        border: 'border-indigo-500/30'
    }
];

export function Soundscapes() {
    const [activeSound, setActiveSound] = useState<string | null>(null);
    const [volume, setVolume] = useState([50]);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Initialize audio element
    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio();
            audioRef.current.loop = true;
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = '';
            }
        };
    }, []);

    // Handle active sound changes
    useEffect(() => {
        if (audioRef.current) {
            if (activeSound) {
                const sound = SOUNDS.find(s => s.id === activeSound);
                if (sound && audioRef.current.src !== sound.url) {
                    audioRef.current.src = sound.url;
                    audioRef.current.play().catch(e => console.error("Audio play failed:", e));
                } else if (audioRef.current.paused) {
                    audioRef.current.play().catch(e => console.error("Audio play failed:", e));
                }
            } else {
                audioRef.current.pause();
            }
        }
    }, [activeSound]);

    // Handle volume changes
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume[0] / 100;
        }
    }, [volume, isMuted]);

    const toggleSound = (id: string) => {
        if (activeSound === id) {
            setActiveSound(null);
        } else {
            setActiveSound(id);
        }
    };

    return (
        <div className="space-y-6 pb-24">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Soundscapes</h1>
                <p className="text-slate-400">
                    Immersive audio environments designed to mask disruptions and help you fall asleep faster.
                </p>
            </div>

            {/* Main Player UI - only show if a sound is active */}
            {activeSound && (
                <Card className="p-6 bg-slate-800/80 backdrop-blur-md border border-indigo-500/30 shadow-[0_10px_40px_rgba(99,102,241,0.15)] sticky top-4 z-20">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            {SOUNDS.map(s => {
                                if (s.id === activeSound) {
                                    const Icon = s.icon;
                                    return (
                                        <div key={s.id} className={`p-4 rounded-2xl ${s.bg} border ${s.border} shadow-inner`}>
                                            <Icon className={`w-8 h-8 ${s.color} animate-pulse`} />
                                        </div>
                                    );
                                }
                                return null;
                            })}
                            <div>
                                <h2 className="text-xl font-bold text-white">
                                    {SOUNDS.find(s => s.id === activeSound)?.title}
                                </h2>
                                <p className="text-sm text-indigo-300">Playing</p>
                            </div>
                        </div>

                        <button
                            onClick={() => setActiveSound(null)}
                            className="p-3 rounded-full bg-slate-700/50 hover:bg-slate-600 transition-colors text-white"
                        >
                            <Pause className="w-6 h-6 fill-current" />
                        </button>
                    </div>

                    <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-xl">
                        <button
                            onClick={() => setIsMuted(!isMuted)}
                            className="text-slate-400 hover:text-white transition-colors"
                        >
                            {isMuted || volume[0] === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </button>
                        <Slider
                            defaultValue={[50]}
                            max={100}
                            step={1}
                            value={isMuted ? [0] : volume}
                            onValueChange={setVolume}
                            className="flex-1"
                        />
                    </div>
                </Card>
            )}

            {/* Sound Grid */}
            <div className="grid grid-cols-2 gap-4">
                {SOUNDS.map((sound) => {
                    const Icon = sound.icon;
                    const isActive = activeSound === sound.id;

                    return (
                        <Card
                            key={sound.id}
                            onClick={() => toggleSound(sound.id)}
                            className={`p-5 cursor-pointer transition-all duration-300 border-2 overflow-hidden relative ${isActive
                                    ? `bg-slate-800 ${sound.border} shadow-[0_0_20px_rgba(99,102,241,0.2)] scale-[1.02]`
                                    : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800 hover:border-slate-700'
                                }`}
                        >
                            {isActive && (
                                <div className={`absolute inset-0 opacity-20 bg-gradient-to-t from-transparent to-current ${sound.color}`} />
                            )}

                            <div className="flex flex-col items-center text-center space-y-4 relative z-10">
                                <div className={`p-4 rounded-full transition-colors duration-300 ${isActive ? sound.bg : 'bg-slate-800'
                                    }`}>
                                    <Icon className={`w-8 h-8 ${isActive ? sound.color : 'text-slate-500'}`} />
                                </div>

                                <div>
                                    <h3 className={`font-medium mb-1 transition-colors ${isActive ? 'text-white' : 'text-slate-300'}`}>
                                        {sound.title}
                                    </h3>
                                    <div className="flex items-center justify-center min-h-[24px]">
                                        {isActive ? (
                                            <div className="flex gap-1 items-end h-3">
                                                <div className="w-1 bg-indigo-400 rounded-full animate-[bounce_1s_infinite_0ms]"></div>
                                                <div className="w-1 bg-indigo-400 rounded-full animate-[bounce_1s_infinite_200ms]"></div>
                                                <div className="w-1 bg-indigo-400 rounded-full animate-[bounce_1s_infinite_400ms]"></div>
                                            </div>
                                        ) : (
                                            <Play className="w-4 h-4 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Education Info */}
            <Card className="p-6 bg-slate-900 border border-slate-800">
                <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                    <span className="text-xl">🎧</span> The Science of Sound
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                    Consistent ambient sound, like brown noise or heavy rain, creates a "sound blanket" that masks sudden environmental noises (like a dog barking or a car door slamming). This prevents micro-awakenings that disrupt your deep sleep cycles.
                </p>
            </Card>
        </div>
    );
}
