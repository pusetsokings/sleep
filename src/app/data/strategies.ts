import { Strategy } from '@/app/types';

export const strategies: Strategy[] = [
  {
    id: 1,
    title: 'Temperature Sweet Spot',
    subtitle: 'Cool bedroom for better sleep',
    icon: 'thermometer',
    description: 'Your body temperature naturally drops when it\'s time to sleep. You can facilitate this process by keeping your bedroom cool—ideally between 60-67°F (15-19°C). This might feel cold at first, but your body sleeps better in a cool environment. Use blankets to stay warm rather than heating the room. The contrast between the cool air and your warm cocoon signals to your brain that it\'s sleep time.',
    tips: [
      'Keep bedroom temperature between 60-67°F (15-19°C)',
      'Use blankets for warmth instead of heating the room',
      'If you wake up hot and sweaty, your room is too warm',
      'Take a warm bath or shower 90 minutes before bed'
    ],
    actionItems: [
      'Lower thermostat tonight',
      'Prepare warm blankets',
      'Schedule evening bath time'
    ]
  },
  {
    id: 2,
    title: 'The Light Diet',
    subtitle: 'Manage light exposure strategically',
    icon: 'sun',
    description: 'Blue light from screens suppresses melatonin, the hormone that makes you sleepy. This is why scrolling on your phone before bed can keep you awake. Create a "digital sunset" routine: stop using screens 1-2 hours before bedtime. Morning sunlight is equally important. Get 10-30 minutes of natural light exposure within an hour of waking. This helps set your circadian rhythm, making it easier to fall asleep at night.',
    tips: [
      'Stop using screens 1-2 hours before bedtime',
      'Enable night mode on devices if you must use them',
      'Get 10-30 minutes of morning sunlight within an hour of waking',
      'Use blue-light-blocking glasses in the evening'
    ],
    actionItems: [
      'Set digital sunset time',
      'Enable night mode on devices',
      'Plan morning sunlight exposure'
    ]
  },
  {
    id: 3,
    title: 'Caffeine Cutoff',
    subtitle: 'Strategic timing for better sleep',
    icon: 'coffee',
    description: 'Caffeine has a half-life of about 5-6 hours, meaning half the caffeine from your afternoon coffee is still in your system at bedtime. Even if you can fall asleep with caffeine in your system, it disrupts your sleep architecture, reducing deep sleep. Set a caffeine cutoff time—no coffee, tea, or caffeinated sodas after 2 PM. If you\'re particularly sensitive, make it noon.',
    tips: [
      'No caffeine after 2 PM (or noon if sensitive)',
      'Watch for hidden sources: chocolate, pain relievers, energy drinks',
      'Half-life of caffeine is 5-6 hours',
      'Takes a few days to adjust, but sleep quality improves'
    ],
    actionItems: [
      'Set your personal caffeine cutoff time',
      'Identify hidden caffeine sources',
      'Find alternative afternoon beverages'
    ]
  },
  {
    id: 4,
    title: 'Wind-Down Routine',
    subtitle: 'Create a consistent bedtime ritual',
    icon: 'moon',
    description: 'Your brain needs a transition period between wakefulness and sleep. Create a consistent 30-60 minute wind-down routine that signals it\'s time for rest. Your routine might include: dimming lights, gentle stretching, journaling, meditation, or reading. The specific activities matter less than the consistency. Do the same things in the same order every night.',
    tips: [
      'Create a 30-60 minute wind-down routine',
      'Include: dimming lights, stretching, journaling, meditation, or reading',
      'Consistency is key—same activities in same order',
      'Avoid stimulating activities: work emails, intense exercise, stressful conversations'
    ],
    actionItems: [
      'Choose 3-4 calming activities',
      'Set routine start time',
      'Prepare materials (book, journal, etc.)'
    ]
  },
  {
    id: 5,
    title: 'Worry Window',
    subtitle: 'Process thoughts before bedtime',
    icon: 'brain',
    description: 'Racing thoughts are one of the biggest sleep stealers. You lie in bed, mind spinning with tomorrow\'s to-do list or replaying today\'s events. Combat this with a "worry window"—a designated time earlier in the evening (not right before bed) to process thoughts and plan for tomorrow. Spend 15-20 minutes journaling, making lists, or problem-solving.',
    tips: [
      'Set aside 15-20 minutes earlier in the evening',
      'Journal, make lists, or problem-solve during this time',
      'When anxious thoughts arise at bedtime, remind yourself you handled this',
      'Keep a notepad by your bed for middle-of-night thoughts'
    ],
    actionItems: [
      'Schedule daily worry window time',
      'Prepare journal or notepad',
      'Create bedside notepad for night thoughts'
    ]
  },
  {
    id: 6,
    title: 'Consistency Commitment',
    subtitle: 'Same sleep schedule every day',
    icon: 'calendar',
    description: 'Your body loves routine. Going to bed and waking up at the same time every day—yes, even weekends—regulates your circadian rhythm and improves sleep quality. Pick a wake time that gives you 7-9 hours of sleep and stick to it. Even if you had a bad night, get up at your regular time. This builds sleep pressure for the next night.',
    tips: [
      'Same bedtime and wake time every day, including weekends',
      'Choose a wake time allowing 7-9 hours of sleep',
      'Get up at regular time even after a bad night',
      'After 2-3 weeks, you\'ll naturally get sleepy at bedtime'
    ],
    actionItems: [
      'Set your consistent wake time',
      'Calculate ideal bedtime',
      'Set daily alarms'
    ]
  },
  {
    id: 7,
    title: 'Exercise Timing',
    subtitle: 'Move your body at the right time',
    icon: 'activity',
    description: 'Exercise is one of the most powerful sleep aids, but timing matters. Regular physical activity improves sleep quality and helps you fall asleep faster. However, intense exercise within 3-4 hours of bedtime can be counterproductive—it raises your core temperature and releases energizing hormones. Aim for morning or afternoon workouts. If evening is your only option, try gentle activities like yoga or walking.',
    tips: [
      'Exercise regularly, but finish intense workouts 3-4 hours before bed',
      'Morning exercise helps regulate your circadian rhythm',
      'Evening yoga or stretching is fine—it\'s calming',
      '20-30 minutes of daily movement improves sleep quality by 65%'
    ],
    actionItems: [
      'Schedule workouts for morning or afternoon',
      'If evening exercise, keep it light (yoga, walking)',
      'Track how exercise timing affects your sleep'
    ]
  },
  {
    id: 8,
    title: 'Alcohol Awareness',
    subtitle: 'Understand alcohol\'s impact on sleep',
    icon: 'wine',
    description: 'Alcohol might make you drowsy, but it severely disrupts sleep quality. While it helps you fall asleep faster, it prevents you from reaching deep, restorative sleep stages and causes more nighttime awakenings. As your body metabolizes alcohol (typically 3-4 hours), it creates a rebound effect, often waking you up in the early morning. If you drink, finish at least 3-4 hours before bed.',
    tips: [
      'Stop drinking alcohol 3-4 hours before bedtime',
      'Alcohol reduces REM sleep—critical for memory and mood',
      'You may fall asleep faster but wake up more during the night',
      'Even one drink can disrupt sleep architecture'
    ],
    actionItems: [
      'Set an alcohol cutoff time',
      'Track sleep quality on drinking vs. non-drinking nights',
      'Try alcohol-free alternatives in the evening'
    ]
  },
  {
    id: 9,
    title: 'Smart Napping',
    subtitle: 'Nap strategically or not at all',
    icon: 'power',
    description: 'Naps can either help or hurt your nighttime sleep, depending on timing and duration. If you struggle with nighttime sleep, avoid naps entirely—they reduce your sleep pressure. If you must nap, keep it short (20-30 minutes) and before 2 PM. Longer or later naps make it harder to fall asleep at night. The exception: if you\'re severely sleep-deprived, a 90-minute nap (one full sleep cycle) can be restorative.',
    tips: [
      'If you have insomnia, skip naps to build sleep pressure',
      'Power naps: 20-30 minutes max, before 2 PM',
      'Longer than 30 minutes causes sleep inertia (grogginess)',
      'Full sleep cycle nap (90 min) only if severely sleep-deprived'
    ],
    actionItems: [
      'Decide: eliminate naps or set strict nap rules',
      'Set 20-minute timer for power naps',
      'Track how napping affects nighttime sleep'
    ]
  },
  {
    id: 10,
    title: 'Bedroom Sanctuary',
    subtitle: 'Optimize your sleep environment',
    icon: 'home',
    description: 'Your bedroom should be a cave: cool, dark, and quiet. Blackout curtains, white noise machines, and removing electronics create an optimal sleep environment. Your brain makes powerful associations—if you work, watch TV, or scroll social media in bed, your brain won\'t associate it with sleep. Use your bed only for sleep (and intimacy). This strengthens the mental connection between bed and rest.',
    tips: [
      'Remove TV, work materials, and exercise equipment from bedroom',
      'Use blackout curtains or a sleep mask',
      'White noise or earplugs for noise reduction',
      'Hide the clock—watching time creates anxiety'
    ],
    actionItems: [
      'Remove non-sleep items from bedroom',
      'Install blackout curtains or get sleep mask',
      'Set up white noise machine or app'
    ]
  },
  {
    id: 11,
    title: 'The 15-Minute Rule',
    subtitle: 'Don\'t force sleep when it won\'t come',
    icon: 'clock',
    description: 'If you can\'t fall asleep after 15-20 minutes, get out of bed. Lying awake creates an association between your bed and wakefulness. Go to another room and do something calming and boring in dim light—read a book, do gentle stretching, or meditate. Return to bed only when you feel sleepy. This trains your brain that bed = sleep, not tossing and turning.',
    tips: [
      'After 15-20 minutes awake, leave the bedroom',
      'Do something boring in dim light: read, stretch, meditate',
      'Don\'t check your phone or watch TV',
      'Return to bed only when genuinely sleepy'
    ],
    actionItems: [
      'Prepare a boring book in another room',
      'Set up dim lighting in your "can\'t sleep" space',
      'Commit to getting up rather than tossing in bed'
    ]
  },
  {
    id: 12,
    title: 'Food & Sleep Connection',
    subtitle: 'Eat and drink strategically',
    icon: 'utensils',
    description: 'What and when you eat affects your sleep. Heavy meals within 3 hours of bedtime can cause discomfort and acid reflux. Going to bed hungry can also keep you awake. The sweet spot: light snack 1-2 hours before bed if needed. Avoid excessive fluids close to bedtime to reduce nighttime bathroom trips. Some foods promote sleep (complex carbs, foods with tryptophan), while others disrupt it (spicy foods, high-fat meals).',
    tips: [
      'Finish large meals 3+ hours before bedtime',
      'Light snack 1-2 hours before bed is fine (banana, yogurt, oatmeal)',
      'Limit fluids 1-2 hours before bed to reduce wake-ups',
      'Avoid spicy foods, high-fat foods, and citrus at night'
    ],
    actionItems: [
      'Set your last meal time',
      'Identify sleep-friendly evening snacks',
      'Reduce fluid intake 2 hours before bed'
    ]
  },
  {
    id: 13,
    title: 'Stress & Anxiety Management',
    subtitle: 'Calm your nervous system',
    icon: 'heart',
    description: 'Chronic stress and anxiety are among the top causes of insomnia. When your sympathetic nervous system (fight-or-flight) is activated, sleep is biologically difficult. Practice relaxation techniques daily, not just at bedtime: deep breathing (4-7-8 technique), progressive muscle relaxation, meditation, or mindfulness. These activate your parasympathetic nervous system (rest-and-digest), preparing your body for sleep.',
    tips: [
      'Practice 4-7-8 breathing: inhale 4 counts, hold 7, exhale 8',
      'Progressive muscle relaxation: tense and release each muscle group',
      'Try meditation or mindfulness apps (Headspace, Calm)',
      'Address underlying anxiety with professional help if needed'
    ],
    actionItems: [
      'Learn one relaxation technique',
      'Practice daily, even when not stressed',
      'Consider therapy if anxiety is chronic'
    ]
  },
  {
    id: 14,
    title: 'Sleep Debt Recovery',
    subtitle: 'Understand and address sleep deficit',
    icon: 'battery',
    description: 'Sleep debt accumulates when you consistently get less sleep than you need. You can\'t "catch up" with one long weekend sleep. Recovery takes time—typically 1-2 weeks of consistent, adequate sleep (7-9 hours) to recover from chronic sleep debt. Prioritize sleep as non-negotiable. Track your sleep to identify patterns and address root causes of insufficient sleep.',
    tips: [
      'Most adults need 7-9 hours of sleep per night',
      'Can\'t recover from chronic sleep debt with weekend catch-up',
      'Takes 1-2 weeks of consistent sleep to recover',
      'Sleep is not optional—it\'s as critical as food and water'
    ],
    actionItems: [
      'Calculate your personal sleep need (7-9 hours)',
      'Schedule sleep like important appointments',
      'Track sleep patterns for 2 weeks'
    ]
  }
];