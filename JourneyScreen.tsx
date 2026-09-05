import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { calculateWordsLearned } from "./lessons";

type JourneyScreenProps = {
  completedLessonIds: string[];
  wordsLearned: number;
  latestQuizScore: number | null;
  bestQuizScore: number | null;
  onBack: () => void;
};

/*
  ============================================================
  TSHILUBA ROOTS — 15 TOTAL LESSONS
  ============================================================

  Greetings & Introductions = 3
  Family                    = 2
  Numbers                   = 2
  Time                      = 1
  Common Verbs              = 2
  Speak                     = 3

  TOTAL                     = 15
*/

const TOTAL_LESSONS = 14;

const lessonGroups = [
  {
    id: "greetings",
    title: "Greetings & Introductions",
    emoji: "👋🏾",
    color: "#F7DDE5",
    lessons: [
      "greetings-1",
      "greetings-2",
      "greetings-3",
    ],
  },

  {
    id: "family",
    title: "Family",
    emoji: "👨🏾‍👩🏾‍👧🏾",
    color: "#DDEFF8",
    lessons: [
      "family-1",
      "family-2",
    ],
  },

  {
    id: "numbers",
    title: "Numbers",
    emoji: "🔢",
    color: "#FFF1C9",
    lessons: [
      "numbers-1",
      "numbers-2",
    ],
  },

  {
    id: "time",
    title: "Time",
    emoji: "🕐",
    color: "#E9E1F5",
    lessons: [
      "time-1",
    ],
  },

  {
    id: "everyday-phrases",
    title: "Everyday Phrases",
    emoji: "💬",
    color: "#E9E1F5",
    lessons: [
      "everyday-phrases-1",
    ],
  },

  {
    id: "common-verbs",
    title: "Common Verbs",
    emoji: "💬",
    color: "#F8E2D5",
    lessons: [
      "common-verbs-1",
      "common-verbs-2",
    ],
  },

  {
    id: "speak",
    title: "Speak",
    emoji: "🗣️",
    color: "#DDEFF8",
    lessons: [
      "speak-1",
      "speak-2",
      "speak-3",
    ],
  },
];

export default function JourneyScreen({
  completedLessonIds,
  wordsLearned,
  latestQuizScore,
  bestQuizScore,
  onBack,
}: JourneyScreenProps) {
  /*
    ============================================================
    COMPLETED LESSON COUNT

    We count UNIQUE lesson IDs.

    Example:

    greetings-1
    greetings-2
    greetings-3
    family-1
    family-2
    numbers-1
    numbers-2

    = 7 completed lessons
    ============================================================
  */

  const uniqueCompletedLessons = Array.from(
    new Set(completedLessonIds)
  );

  const effectiveWordsLearned = Math.max(
    wordsLearned,
    calculateWordsLearned(uniqueCompletedLessons)
  );

  const completedCount = uniqueCompletedLessons.filter(
    (id) =>
      lessonGroups.some((group) =>
        group.lessons.includes(id)
      )
  ).length;

  const progressPercentage = Math.round(
    (completedCount / TOTAL_LESSONS) * 100
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* BACK */}

      <TouchableOpacity
        style={styles.backButton}
        onPress={onBack}
        activeOpacity={0.7}
      >
        <Text style={styles.backText}>
          ←
        </Text>
      </TouchableOpacity>

      {/* LOGO */}

      <Text style={styles.logo}>
        🌱 Tshiluba Roots
      </Text>

      {/* HEADER */}

      <Text style={styles.eyebrow}>
        YOUR JOURNEY
      </Text>

      <Text style={styles.title}>
        Look how far you've come. 🌱
      </Text>

      <Text style={styles.subtitle}>
        Every word brings you closer to your
        language, your family, and home.
      </Text>

      {/* =========================
          MAIN PROGRESS CARD
      ========================= */}

      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <View>
            <Text style={styles.progressLabel}>
              LESSONS COMPLETED
            </Text>

            <Text style={styles.progressNumber}>
              {completedCount}
              <Text style={styles.progressTotal}>
                {" "}
                / {TOTAL_LESSONS}
              </Text>
            </Text>
          </View>

          <View style={styles.percentCircle}>
            <Text style={styles.percentText}>
              {progressPercentage}%
            </Text>
          </View>
        </View>

        {/* PROGRESS BAR */}

        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${Math.min(
                  progressPercentage,
                  100
                )}%`,
              },
            ]}
          />
        </View>

        <Text style={styles.progressMessage}>
          {completedCount === 0
            ? "Your journey starts here. 🌱"
            : completedCount === TOTAL_LESSONS
            ? "You completed the entire journey! 🎉"
            : `${TOTAL_LESSONS - completedCount} lessons left to explore.`}
        </Text>
      </View>

      {/* =========================
          STATS
      ========================= */}

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>
            📚
          </Text>

          <Text style={styles.statNumber}>
            {completedCount}
          </Text>

          <Text style={styles.statLabel}>
            Lessons
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>
            🌱
          </Text>

          <Text style={styles.statNumber}>
            {effectiveWordsLearned}
          </Text>

          <Text style={styles.statLabel}>
            Words Learned
          </Text>
        </View>
      </View>

      {/* =========================
          QUIZ
      ========================= */}

      <View style={styles.quizCard}>
        <View style={styles.quizHeader}>
          <Text style={styles.quizEmoji}>
            🧠
          </Text>

          <View style={styles.quizHeaderText}>
            <Text style={styles.quizTitle}>
              Quiz Progress
            </Text>

            <Text style={styles.quizSubtitle}>
              Keep practicing and beat your best.
            </Text>
          </View>
        </View>

        <View style={styles.quizScores}>
          <View style={styles.quizScoreBox}>
            <Text style={styles.quizScoreLabel}>
              LATEST SCORE
            </Text>

            <Text style={styles.quizScore}>
              {latestQuizScore !== null
                ? `${latestQuizScore}/15`
                : "—"}
            </Text>
          </View>

          <View style={styles.quizScoreBox}>
            <Text style={styles.quizScoreLabel}>
              BEST SCORE
            </Text>

            <Text style={styles.quizScore}>
              {bestQuizScore !== null
                ? `${bestQuizScore}/15`
                : "—"}
            </Text>
          </View>
        </View>

        {latestQuizScore !== null &&
          bestQuizScore !== null &&
          latestQuizScore === bestQuizScore && (
            <View style={styles.bestBadge}>
              <Text style={styles.bestBadgeText}>
                🏆 BEST SCORE
              </Text>
            </View>
          )}
      </View>

      {/* =========================
          LEARNING PATH
      ========================= */}

      <Text style={styles.sectionTitle}>
        Your Learning Path
      </Text>

      <Text style={styles.sectionSubtitle}>
        15 lessons to help you reconnect with
        Tshiluba.
      </Text>

      {/* =========================
          CATEGORY CARDS
      ========================= */}

      {lessonGroups.map((group) => {
        const completedInGroup =
          group.lessons.filter((lessonId) =>
            uniqueCompletedLessons.includes(
              lessonId
            )
          ).length;

        const isComplete =
          completedInGroup === group.lessons.length;

        const isStarted =
          completedInGroup > 0;

        const groupPercentage =
          Math.round(
            (completedInGroup /
              group.lessons.length) *
              100
          );

        return (
          <View
            key={group.id}
            style={[
              styles.categoryCard,
              {
                backgroundColor: group.color,
              },
            ]}
          >
            {/* CATEGORY HEADER */}

            <View style={styles.categoryHeader}>
              <View style={styles.categoryIcon}>
                <Text style={styles.categoryEmoji}>
                  {group.emoji}
                </Text>
              </View>

              <View style={styles.categoryInfo}>
                <Text style={styles.categoryTitle}>
                  {group.title}
                </Text>

                <Text style={styles.categoryCount}>
                  {completedInGroup} /{" "}
                  {group.lessons.length} lessons
                </Text>
              </View>

              <View
                style={[
                  styles.statusCircle,
                  isComplete &&
                    styles.statusComplete,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    isComplete &&
                      styles.statusTextComplete,
                  ]}
                >
                  {isComplete
                    ? "✓"
                    : isStarted
                    ? "•"
                    : "○"}
                </Text>
              </View>
            </View>

            {/* CATEGORY PROGRESS */}

            <View
              style={styles.categoryProgressBackground}
            >
              <View
                style={[
                  styles.categoryProgressFill,
                  {
                    width: `${groupPercentage}%`,
                  },
                ]}
              />
            </View>

            {/* INDIVIDUAL LESSONS */}

            <View style={styles.lessonList}>
              {group.lessons.map(
                (lessonId, index) => {
                  const completed =
                    uniqueCompletedLessons.includes(
                      lessonId
                    );

                  return (
                    <View
                      key={lessonId}
                      style={styles.lessonRow}
                    >
                      <View
                        style={[
                          styles.lessonNumberCircle,
                          completed &&
                            styles.lessonNumberCircleComplete,
                        ]}
                      >
                        <Text
                          style={[
                            styles.lessonNumberText,
                            completed &&
                              styles.lessonNumberTextComplete,
                          ]}
                        >
                          {completed
                            ? "✓"
                            : index + 1}
                        </Text>
                      </View>

                      <Text
                        style={[
                          styles.lessonText,
                          completed &&
                            styles.lessonTextComplete,
                        ]}
                      >
                        Lesson {index + 1}
                      </Text>

                      {completed && (
                        <Text
                          style={styles.completedLabel}
                        >
                          Completed
                        </Text>
                      )}
                    </View>
                  );
                }
              )}
            </View>
          </View>
        );
      })}

      {/* =========================
          MOTIVATION
      ========================= */}

      <View style={styles.motivationCard}>
        <Text style={styles.motivationEmoji}>
          🌿
        </Text>

        <Text style={styles.motivationTitle}>
          Keep going.
        </Text>

        <Text style={styles.motivationText}>
          You don't have to learn everything at
          once. One word, one phrase, one
          conversation at a time.
        </Text>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF9F4",
  },

  content: {
    padding: 24,
    paddingBottom: 60,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },

  backText: {
    fontSize: 30,
    color: "#332C28",
    marginTop: -3,
  },

  logo: {
    fontSize: 18,
    fontWeight: "700",
    color: "#6F8F7B",
    marginBottom: 22,
  },

  eyebrow: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: "#9B8CB5",
    marginBottom: 8,
  },

  title: {
    fontSize: 32,
    lineHeight: 39,
    fontWeight: "800",
    color: "#332C28",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 23,
    color: "#6F625B",
    marginBottom: 24,
  },

  progressCard: {
    backgroundColor: "#E4F3EC",
    borderRadius: 26,
    padding: 24,
    marginBottom: 16,
  },

  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  progressLabel: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.3,
    color: "#6F8F7B",
    marginBottom: 4,
  },

  progressNumber: {
    fontSize: 42,
    fontWeight: "800",
    color: "#332C28",
  },

  progressTotal: {
    fontSize: 20,
    fontWeight: "600",
    color: "#6F625B",
  },

  percentCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  percentText: {
    fontSize: 17,
    fontWeight: "800",
    color: "#6F8F7B",
  },

  progressBarBackground: {
    height: 12,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },

  progressBarFill: {
    height: "100%",
    borderRadius: 10,
    backgroundColor: "#6F8F7B",
  },

  progressMessage: {
    fontSize: 13,
    color: "#6F625B",
    marginTop: 12,
  },

  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 20,
  },

  statEmoji: {
    fontSize: 25,
    marginBottom: 8,
  },

  statNumber: {
    fontSize: 28,
    fontWeight: "800",
    color: "#332C28",
  },

  statLabel: {
    fontSize: 12,
    color: "#6F625B",
    marginTop: 3,
  },

  quizCard: {
    backgroundColor: "#FFF1C9",
    borderRadius: 26,
    padding: 22,
    marginBottom: 30,
  },

  quizHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  quizEmoji: {
    fontSize: 30,
    marginRight: 12,
  },

  quizHeaderText: {
    flex: 1,
  },

  quizTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#332C28",
  },

  quizSubtitle: {
    fontSize: 13,
    color: "#6F625B",
    marginTop: 3,
  },

  quizScores: {
    flexDirection: "row",
    gap: 12,
  },

  quizScoreBox: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
  },

  quizScoreLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    color: "#9B8CB5",
    marginBottom: 5,
  },

  quizScore: {
    fontSize: 25,
    fontWeight: "800",
    color: "#332C28",
  },

  bestBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 14,
  },

  bestBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#6F8F7B",
  },

  sectionTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#332C28",
    marginBottom: 6,
  },

  sectionSubtitle: {
    fontSize: 14,
    color: "#6F625B",
    marginBottom: 18,
  },

  categoryCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 14,
  },

  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  categoryEmoji: {
    fontSize: 25,
  },

  categoryInfo: {
    flex: 1,
  },

  categoryTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#332C28",
  },

  categoryCount: {
    fontSize: 13,
    color: "#6F625B",
    marginTop: 3,
  },

  statusCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  statusComplete: {
    backgroundColor: "#6F8F7B",
  },

  statusText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#6F8F7B",
  },

  statusTextComplete: {
    color: "#FFFFFF",
  },

  categoryProgressBackground: {
    height: 8,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    marginTop: 16,
    overflow: "hidden",
  },

  categoryProgressFill: {
    height: "100%",
    borderRadius: 8,
    backgroundColor: "#6F8F7B",
  },

  lessonList: {
    marginTop: 12,
  },

  lessonRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },

  lessonNumberCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  lessonNumberCircleComplete: {
    backgroundColor: "#6F8F7B",
  },

  lessonNumberText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#9B8CB5",
  },

  lessonNumberTextComplete: {
    color: "#FFFFFF",
  },

  lessonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6F625B",
  },

  lessonTextComplete: {
    color: "#332C28",
  },

  completedLabel: {
    marginLeft: "auto",
    fontSize: 11,
    fontWeight: "700",
    color: "#6F8F7B",
  },

  motivationCard: {
    backgroundColor: "#E9E1F5",
    borderRadius: 26,
    padding: 26,
    alignItems: "center",
    marginTop: 10,
  },

  motivationEmoji: {
    fontSize: 34,
    marginBottom: 10,
  },

  motivationTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#332C28",
    marginBottom: 8,
  },

  motivationText: {
    fontSize: 14,
    lineHeight: 21,
    color: "#6F625B",
    textAlign: "center",
  },
});