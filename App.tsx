import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { lessons } from "./lessons";
import { StatusBar } from "expo-status-bar";

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

  // This keeps track of which journey the learner is on.
  const [journeyNumber, setJourneyNumber] = useState(1);

// PERSIST PROGRESS
useEffect(() => {
  const loadProgress = async () => {
    try {
      const savedProgress = await AsyncStorage.getItem("tshilubaProgress");

      if (savedProgress) {
        const progress = JSON.parse(savedProgress);

        setCompletedLessonIds(progress.completedLessonIds || []);
        setWordsLearned(progress.wordsLearned || 0);
        setBestQuizScore(progress.bestQuizScore ?? null);
        setlatestQuizScore(progress.latestQuizScore ?? null);
      }
    } catch (error) {
      console.log("Error loading progress:", error);
    }
  };

  loadProgress();
}, []);

useEffect(() => {
  AsyncStorage.setItem(
    "tshilubaProgress",
    JSON.stringify({
      completedLessonIds,
      wordsLearned,
      bestQuizScore,
      latestQuizScore,
    })
  ).catch((error) => {
    console.log("Error saving progress:", error);
  });
}, [
  completedLessonIds,
  wordsLearned,
  bestQuizScore,
  latestQuizScore,
]);

// --------------------------------
// COMPLETE A LESSON
// --------------------------------
  // -----------------------------
  // COMPLETE A LESSON
  // -----------------------------

  const completeLesson = (lessonId: string, words: number) => {
  setCompletedLessonIds((current) => {
    if (current.includes(lessonId)) {
      return current;
    }

    setWordsLearned((currentWords) => currentWords + words);

    return [...current, lessonId];
  });

  
};

  // -----------------------------
  // COMPLETE QUIZ
  // -----------------------------

  const completeQuiz = (score: number) => {
    setlatestQuizScore(score);
    setBestQuizScore((current) => Math.max(current, score));

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