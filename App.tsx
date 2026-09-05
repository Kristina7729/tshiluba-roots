import React, { useEffect, useRef, useState } from "react";
import { lessons, calculateWordsLearned } from "./lessons";
import { StatusBar } from "expo-status-bar";
import { getProgress, saveProgress, DEFAULT_USER_ID } from "./services/progressApi";
import safeStorage from "./services/persistentStorage";

import WelcomeScreen from "./WelcomeScreen";
import RootsScreen from "./RootsScreen";
import HomeScreen from "./HomeScreen";
import LearnScreen from "./LearnScreen";
import LessonScreen from "./LessonScreen";
import QuizScreen from "./QuizScreen";
import FamilyScreen from "./FamilyScreen";
import NumbersScreen from "./NumbersScreen";
import TimeScreen from "./TimeScreen";
import EverydayPhrasesScreen from "./EverydayPhrasesScreen";
import CommonVerbsScreen from "./CommonVerbsScreen";
import SpeakScreen from "./SpeakScreen";
import JourneyScreen from "./JourneyScreen";


export default function App() {
  const [screen, setScreen] = useState("welcome");

  // -----------------------------
  // LEARNING PROGRESS
  // -----------------------------

  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [wordsLearned, setWordsLearned] = useState(0);
  const [bestQuizScore, setBestQuizScore] = useState(0);
  const [latestQuizScore, setlatestQuizScore] = useState(0);

  const isLoadedRef = useRef(false);
  const completedLessonIdsRef = useRef<string[]>([]);
  const wordsLearnedRef = useRef(0);
  const bestQuizScoreRef = useRef(0);
  const latestQuizScoreRef = useRef(0);

  useEffect(() => {
    completedLessonIdsRef.current = completedLessonIds;
    wordsLearnedRef.current = wordsLearned;
    bestQuizScoreRef.current = bestQuizScore;
    latestQuizScoreRef.current = latestQuizScore;
  }, [completedLessonIds, wordsLearned, bestQuizScore, latestQuizScore]);

  // This keeps track of which journey the learner is on.
  const [journeyNumber, setJourneyNumber] = useState(1);

// PERSIST PROGRESS - Load once on startup
useEffect(() => {
  let isMounted = true;

  const loadProgress = async () => {
    try {
      let mergedCompletedLessonIds: string[] = [];
      let mergedWordsLearned = 0;
      let mergedBestQuizScore = 0;
      let mergedLatestQuizScore = 0;

      // 1. Immediately read local persistent AsyncStorage cache
      const savedProgress = await safeStorage.getItem("tshilubaProgress");

      if (savedProgress) {
        try {
          const progress = JSON.parse(savedProgress);
          const localIds = progress.completedLessons || progress.completedLessonIds || [];
          if (Array.isArray(localIds)) {
            mergedCompletedLessonIds = [...localIds];
          }
          if (typeof progress.wordsLearned === "number") {
            mergedWordsLearned = progress.wordsLearned;
          }
          if (typeof progress.bestQuizScore === "number") {
            mergedBestQuizScore = progress.bestQuizScore;
          }
          if (typeof progress.latestQuizScore === "number") {
            mergedLatestQuizScore = progress.latestQuizScore;
          }
        } catch (e) {
          console.log("Error parsing local progress:", e);
        }
      }

      // 2. Fetch and merge latest progress from AWS API
      const remoteProgress = await getProgress(DEFAULT_USER_ID);
      if (remoteProgress) {
        const remoteIds = remoteProgress.completedLessons || remoteProgress.completedLessonIds || [];
        if (Array.isArray(remoteIds) && remoteIds.length > 0) {
          mergedCompletedLessonIds = Array.from(
            new Set([...mergedCompletedLessonIds, ...remoteIds])
          );
        }
        if (typeof remoteProgress.wordsLearned === "number" && remoteProgress.wordsLearned > 0) {
          mergedWordsLearned = Math.max(mergedWordsLearned, remoteProgress.wordsLearned);
        }
        if (typeof remoteProgress.bestQuizScore === "number") {
          mergedBestQuizScore = Math.max(mergedBestQuizScore, remoteProgress.bestQuizScore);
        }
        if (typeof remoteProgress.latestQuizScore === "number") {
          mergedLatestQuizScore = remoteProgress.latestQuizScore;
        }
      }

      // 3. Ensure wordsLearned accurately reflects the sum of ALL completed lessons
      const calculatedWords = calculateWordsLearned(mergedCompletedLessonIds);
      mergedWordsLearned = Math.max(mergedWordsLearned, calculatedWords);

      if (isMounted) {
        completedLessonIdsRef.current = mergedCompletedLessonIds;
        wordsLearnedRef.current = mergedWordsLearned;
        bestQuizScoreRef.current = mergedBestQuizScore;
        latestQuizScoreRef.current = mergedLatestQuizScore;

        setCompletedLessonIds(mergedCompletedLessonIds);
        setWordsLearned(mergedWordsLearned);
        setBestQuizScore(mergedBestQuizScore);
        setlatestQuizScore(mergedLatestQuizScore);
      }

      // Reconcile merged progress back to local cache
      await safeStorage.setItem(
        "tshilubaProgress",
        JSON.stringify({
          completedLessons: mergedCompletedLessonIds,
          completedLessonIds: mergedCompletedLessonIds,
          wordsLearned: mergedWordsLearned,
          bestQuizScore: mergedBestQuizScore,
          latestQuizScore: mergedLatestQuizScore,
        })
      );
    } catch (error) {
      console.log("Error loading progress:", error);
    } finally {
      if (isMounted) {
        isLoadedRef.current = true;
      }
    }
  };

  loadProgress();

  return () => {
    isMounted = false;
  };
}, []);

// --------------------------------
// COMPLETE A LESSON
// --------------------------------
  // -----------------------------
  // COMPLETE A LESSON
  // -----------------------------

  const completeLesson = async (lessonId: string, words: number): Promise<void> => {
    const currentIds = completedLessonIdsRef.current;
    if (currentIds.includes(lessonId)) {
      return;
    }

    const nextCompletedLessonIds = [...currentIds, lessonId];
    const calculatedTotalWords = calculateWordsLearned(nextCompletedLessonIds);
    const nextWordsLearned = Math.max(wordsLearnedRef.current + words, calculatedTotalWords);

    completedLessonIdsRef.current = nextCompletedLessonIds;
    wordsLearnedRef.current = nextWordsLearned;

    const payload = {
      completedLessons: nextCompletedLessonIds,
      completedLessonIds: nextCompletedLessonIds,
      wordsLearned: nextWordsLearned,
      bestQuizScore: bestQuizScoreRef.current,
      latestQuizScore: latestQuizScoreRef.current,
    };

    // 1. Immediately write to AsyncStorage and await completion
    try {
      await safeStorage.setItem("tshilubaProgress", JSON.stringify(payload));
    } catch (error) {
      console.log("Error saving progress locally in completeLesson:", error);
    }

    // 2. Immediately write to remote AWS API Gateway / DynamoDB and await completion
    try {
      await saveProgress(DEFAULT_USER_ID, payload);
    } catch (error) {
      console.log("Error syncing progress to remote API in completeLesson:", error);
    }

    // 3. Update React state
    setCompletedLessonIds(nextCompletedLessonIds);
    setWordsLearned(nextWordsLearned);
  };

  // -----------------------------
  // COMPLETE QUIZ
  // -----------------------------

  const completeQuiz = async (score: number): Promise<void> => {
    const nextBest = Math.max(bestQuizScoreRef.current, score);
    bestQuizScoreRef.current = nextBest;
    latestQuizScoreRef.current = score;

    const payload = {
      completedLessons: completedLessonIdsRef.current,
      completedLessonIds: completedLessonIdsRef.current,
      wordsLearned: wordsLearnedRef.current,
      bestQuizScore: nextBest,
      latestQuizScore: score,
    };

    try {
      await safeStorage.setItem("tshilubaProgress", JSON.stringify(payload));
    } catch (error) {
      console.log("Error saving progress locally in completeQuiz:", error);
    }

    try {
      await saveProgress(DEFAULT_USER_ID, payload);
    } catch (error) {
      console.log("Error syncing progress to remote API in completeQuiz:", error);
    }

    setlatestQuizScore(score);
    setBestQuizScore(nextBest);

    setScreen("journey");
  };

  // -----------------------------
  // WELCOME / ROOTS
  // -----------------------------
if (screen === "welcome") {
  return (
    <>
      <StatusBar style="dark" />

      <WelcomeScreen
        onContinue={() => setScreen("roots")}
      />
    </>
  );
}
  if (screen === "roots") {
    return (
      <>
        <StatusBar style="dark" />

        <RootsScreen
          onBack={() => setScreen("welcome")}
          onStart={() => setScreen("LearnHome")}
        />
      </>
    );
  }

  // -----------------------------
  // MY JOURNEY
  // -----------------------------

  if (screen === "journey") {
    return (
      <>
        <StatusBar style="dark" />

        <JourneyScreen
          completedLessonIds={completedLessonIds}
          wordsLearned={wordsLearned}
          latestQuizScore={latestQuizScore}
          bestQuizScore={bestQuizScore}
          onBack={() => setScreen("LearnHome")}
        />
      </>
    );
  }

  // -----------------------------
  // QUIZ
  // -----------------------------

  if (screen === "quiz") {
    return (
      <>
        <StatusBar style="dark" />

        <QuizScreen
          onBack={() => setScreen("LearnHome")}
          onComplete={completeQuiz}
        />
      </>
    );
  }

  // -----------------------------
  // LEARNING HOME
  // -----------------------------

  if (screen === "LearnHome") {
    return (
      <>
        <StatusBar style="dark" />

        <HomeScreen
          onBack={() => setScreen("roots")}
          onLearn={() => setScreen("learn")}
          onSpeak={() => setScreen("speak")}
          onQuiz={() => setScreen("quiz")}
          onJourney={() => setScreen("journey")}
        />
      </>
    );
  }

  // -----------------------------
  // LEARN CATEGORIES
  // -----------------------------

  if (screen === "learn") {
    return (
      <>
        <StatusBar style="dark" />

        <LearnScreen
          onBack={() => setScreen("LearnHome")}
          onGreetings={() => setScreen("lesson")}
          onNumbers={() => setScreen("numbers")}
          onFamily={() => setScreen("family")}
          onTime={() => setScreen("time")}
          onEverydayPhrases={() => setScreen("everydayPhrases")}
          onVerbs={() => setScreen("verbs")}
          onQuiz={() => setScreen("quiz")}
        />
      </>
    );
  }

  // -----------------------------
  // GREETINGS LESSON
  // -----------------------------

  if (screen === "lesson") {
    return (
      <>
        <StatusBar style="dark" />

        <LessonScreen
          onBack={() => setScreen("learn")}
          onComplete={completeLesson}
          onGoToJourney={() => setScreen("journey")}
        />
      </>
    );
  }

  // -----------------------------
  // NUMBERS
  // -----------------------------

  if (screen === "numbers") {
    return (
      <>
        <StatusBar style="dark" />

        <NumbersScreen
          onBack={() => setScreen("learn")}
          onComplete={completeLesson}
          onGoToJourney={() => setScreen("journey")}
        />
      </>
    );
  }

  // -----------------------------
  // FAMILY
  // -----------------------------

  if (screen === "family") {
    return (
      <>
        <StatusBar style="dark" /> 

        <FamilyScreen
          onBack={() => setScreen("learn")}
          onComplete={completeLesson}
          onGoToJourney={() => setScreen("journey")}
        />
      </>
    );
  }

  // -----------------------------
  // TIME
  // -----------------------------

  if (screen === "time") {
    return (
      <>
        <StatusBar style="dark" />

        <TimeScreen
          onBack={() => setScreen("learn")}
          onComplete={completeLesson}
          onGoToJourney={() => setScreen("journey")}
        />
      </>
    );
  }

  // -----------------------------
  // EVERYDAY PHRASES
  // -----------------------------

  if (screen === "everydayPhrases") {
    return (
      <>
        <StatusBar style="dark" />

        <EverydayPhrasesScreen
          onBack={() => setScreen("learn")}
          onComplete={completeLesson}
          onGoToJourney={() => setScreen("journey")}
        />
      </>
    );
  }

  // -----------------------------
  // COMMON VERBS
  // -----------------------------

  if (screen === "verbs") {
    return (
      <>
        <StatusBar style="dark" />

        <CommonVerbsScreen
          onBack={() => setScreen("learn")}
          onComplete={completeLesson}
          onGoToJourney={() => setScreen("journey")}
        />
      </>
    );
  }

  // -----------------------------
  // SPEAK
  // -----------------------------

  if (screen === "speak") {
    return (
      <>
        <StatusBar style="dark" />

        <SpeakScreen
          onBack={() => setScreen("LearnHome")}
          onComplete={completeLesson}
          onGoToJourney={() => setScreen("journey")}
        />
      </>
    );
  }

  // -----------------------------
  // WELCOME
  // -----------------------------

  return (
    <>
      <StatusBar style="dark" />

      <RootsScreen
        onBack={() => setScreen("Welcome")}
        onStart={() => setScreen("LearnHome")}
      />
    </>
  );
}