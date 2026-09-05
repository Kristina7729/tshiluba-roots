export const lessons = [
  // LEARN — Greetings
  {
    id: "greetings-1",
    category: "Learn",
    title: "Basic Greetings",
    words: 11,
  },
  {
    id: "greetings-2",
    category: "Learn",
    title: "Introduce Yourself",
    words: 7,
  },
  {
    id: "greetings-3",
    category: "Learn",
    title: "How Are You?",
    words: 16,
  },

  // LEARN — Family
  {
    id: "family-1",
    category: "Learn",
    title: "Immediate Family",
    words: 15,
  },
  {
    id: "family-2",
    category: "Learn",
    title: "Extended Family",
    words: 15,
  },
  {
    id: "family-3",
    category: "Learn",
    title: "Talking About Family",
    words: 15,
  },

  // LEARN — Numbers
  {
    id: "numbers-1",
    category: "Learn",
    title: "Numbers 1–10",
    words: 10,
  },
  {
    id: "numbers-2",
    category: "Learn",
    title: "Numbers 11–20",
    words: 10,
  },
  {
    id: "numbers-3",
    category: "Learn",
    title: "Ages & Counting",
    words: 10,
  },

  // LEARN — Food
  {
    id: "food-1",
    category: "Learn",
    title: "Foods",
    words: 15,
  },
  {
    id: "food-2",
    category: "Learn",
    title: "Drinks",
    words: 10,
  },
  {
    id: "food-3",
    category: "Learn",
    title: "Food & Meals",
    words: 15,
  },

  // LEARN — Feelings
  {
    id: "feelings-1",
    category: "Learn",
    title: "Basic Feelings",
    words: 10,
  },
  {
    id: "feelings-2",
    category: "Learn",
    title: "How Are You Feeling?",
    words: 10,
  },

  // LEARN — Time
  {
    id: "time-1",
    category: "Learn",
    title: "Days & Time",
    words: 15,
  },
  {
    id: "time-2",
    category: "Learn",
    title: "Yesterday & Tomorrow",
    words: 10,
  },

  // SPEAK
  {
    id: "speak-1",
    category: "Speak",
    title: "Greeting Someone",
    words: 10,
  },
  {
    id: "speak-2",
    category: "Speak",
    title: "Meeting Someone",
    words: 10,
  },
  {
    id: "speak-3",
    category: "Speak",
    title: "Talking About Family",
    words: 10,
  },
  {
    id: "speak-4",
    category: "Speak",
    title: "Everyday Conversation",
    words: 10,
  },
];

export const LESSON_WORD_COUNTS: Record<string, number> = {
  "greetings-1": 11,
  "greetings-2": 7,
  "greetings-3": 16,
  "family-1": 15,
  "family-2": 15,
  "numbers-1": 10,
  "numbers-2": 10,
  "time-1": 15,
  "everyday-phrases-1": 13,
  "common-verbs-1": 10,
  "common-verbs-2": 10,
  "speak-1": 5,
  "speak-2": 6,
  "speak-3": 5,
};

/**
 * Calculates the total words learned across all completed lessons.
 */
export function calculateWordsLearned(completedLessonIds: string[]): number {
  const uniqueIds = Array.from(new Set(completedLessonIds));
  return uniqueIds.reduce((total, id) => {
    return total + (LESSON_WORD_COUNTS[id] || 0);
  }, 0);
}