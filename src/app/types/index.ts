export interface Strategy {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  description: string;
  tips: string[];
  actionItems: string[];
}

export interface SleepEntry {
  id: string;
  date: string;
  bedTime: string;
  wakeTime: string;
  quality: number; // 1-10
  notes: string;
  strategiesUsed: number[];
}

export interface HabitEntry {
  date: string;
  strategyId: number;
  completed: boolean;
}

export interface WorryEntry {
  id: string;
  date: string;
  time: string;
  content: string;
  resolved: boolean;
}

export interface UserProfile {
  name: string;
  onboardingComplete: boolean;
  selectedStrategies: number[];
  targetBedTime: string;
  targetWakeTime: string;
  caffeineTime: string;
}
