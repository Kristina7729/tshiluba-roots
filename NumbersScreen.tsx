import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import {
  createAudioPlayer,
  setAudioModeAsync,
  type AudioPlayer,
} from "expo-audio";

type NumbersScreenProps = {
  onBack: () => void;
  onComplete: (lessonId: string, wordsCompleted: number) => void;
  onGoToJourney: () => void;
};

/* =========================
   LESSON 1 — NUMBERS 1–10
========================= */

const lessonOneNumbers = [
  { english: "1", tshiluba: "Umue", audioKey: "Umue" },
  { english: "2", tshiluba: "Ibidi", audioKey: "Ibidi" },
  { english: "3", tshiluba: "Isantu", audioKey: "Isantu" },
  { english: "4", tshiluba: "Inayi", audioKey: "Inayi" },
  { english: "5", tshiluba: "Itanu", audioKey: "Itanu" },
  { english: "6", tshiluba: "Isambombo", audioKey: "Isambombo" },
  { english: "7", tshiluba: "Muanda Mutekete", audioKey: "Muanda Mutekete" },
  { english: "8", tshiluba: "Muanda Mukulu", audioKey: "Muanda Mukulu" },
  { english: "9", tshiluba: "Tshitema", audioKey: "Tshitema" },
  { english: "10", tshiluba: "Dikumi", audioKey: "Dikumi" },
];

/* =========================
   LESSON 2 — NUMBERS 11–20
========================= */

const lessonTwoNumbers = [
  {
    english: "11",
    tshiluba: "Dikumi ne umue",
    audioKey: "Dikumi ne umue",
  },
  {
    english: "12",
    tshiluba: "Dikumi ne ibidi",
    audioKey: "Dikumi ne ibidi",
  },
  {
    english: "13",
    tshiluba: "Dikumi ne istanu",
    audioKey: "Dikumi ne istanu",
  },
  {
    english: "14",
    tshiluba: "Dikumi ne inayi",
    audioKey: "Dikumi ne inayi",
  },
  {
    english: "15",
    tshiluba: "Dikumi ne itanu",
    audioKey: "Dikumi ne itanu",
  },
  {
    english: "16",
    tshiluba: "Dikumi ne isambombo",
    audioKey: "Dikumi ne isambombo",
  },
  {
    english: "17",
    tshiluba: "Dikumi ne muanda mutekte",
    audioKey: "Dikumi ne muanda mutekte",
  },
  {
    english: "18",
    tshiluba: "Dikumi ne muanda mukulu",
    audioKey: "Dikumi ne muanda mukulu",
  },
  {
    english: "19",
    tshiluba: "Dikumi ne tshitema",
    audioKey: "Dikumi ne tshitema",
  },
  {
    english: "20",
    tshiluba: "Makumi abidi",
    audioKey: "Makumi abidi",
  },
];

const audioMap: Record<string, number> = {
  Umue: require("./audio/umue.m4a"),
  Ibidi: require("./audio/ibidi.m4a"),
  Isantu: require("./audio/isantu.m4a"),
  Inayi: require("./audio/inayi.m4a"),
  Itanu: require("./audio/itanu.m4a"),
  Isambombo: require("./audio/isambombo.m4a"),
  "Muanda Mutekete": require("./audio/muanda mutekete.m4a"),
  "Muanda Mukulu": require("./audio/muanda mukulu.m4a"),
  Tshitema: require("./audio/tshitema.m4a"),
  Dikumi: require("./audio/dikumi.m4a"),
  "Dikumi ne umue": require("./audio/dikumi ne umue.m4a"),
  "Dikumi ne ibidi": require("./audio/dikumi ne ibidi.m4a"),
  "Dikumi ne istanu": require("./audio/dikumi ne isatnu.m4a"),
  "Dikumi ne inayi": require("./audio/dikumi ne inayi.m4a"),
  "Dikumi ne itanu": require("./audio/dikumi ne itanu.m4a"),
  "Dikumi ne isambombo": require("./audio/dikumi ne isambombo.m4a"),
  "Dikumi ne muanda mutekte": require("./audio/dikumi ne muanda mutekte.m4a"),
  "Dikumi ne muanda mukulu": require("./audio/dikumi ne muanda.m4a"),
  "Dikumi ne tshitema": require("./audio/dikume ne tshitema.m4a"),
  "Makumi abidi": require("./audio/makumi abidi.m4a"),
};

export default function NumbersScreen({
  onBack,
  onComplete,
  onGoToJourney,
}: NumbersScreenProps) {
  const [currentLesson, setCurrentLesson] = useState(1);

  const audioPlayersRef = useRef(new Map<string, AudioPlayer>());
  const activeAudioKeyRef = useRef<string | null>(null);
  const playRequestRef = useRef(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
    });

    return () => {
      mountedRef.current = false;
      playRequestRef.current += 1;
      audioPlayersRef.current.forEach((audioPlayer) => {
        try {
          audioPlayer.remove();
        } catch {
        }
      });
      audioPlayersRef.current.clear();
    };
  }, []);

  const playAudio = (audioKey: string) => {
    const audioSource = audioMap[audioKey];
    if (!audioSource || !mountedRef.current) return;

    const requestId = ++playRequestRef.current;
    const previousKey = activeAudioKeyRef.current;
    const previousPlayer = previousKey
      ? audioPlayersRef.current.get(previousKey)
      : undefined;

    if (previousPlayer && previousKey && previousKey !== audioKey) {
      try {
        if (previousPlayer.isLoaded && previousPlayer.playing) {
          previousPlayer.pause();
        }
      } catch {
        audioPlayersRef.current.delete(previousKey);
      }
    }

    const createPlayer = () => {
      const player = createAudioPlayer(audioSource, { downloadFirst: true });
      audioPlayersRef.current.set(audioKey, player);
      return player;
    };

    const playSelectedAudio = async () => {
      let player = audioPlayersRef.current.get(audioKey) ?? createPlayer();

      try {
        if (!player.isLoaded) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        if (requestId !== playRequestRef.current || !mountedRef.current || !player.isLoaded) {
          return;
        }
        await player.seekTo(0);
        player.play();
        activeAudioKeyRef.current = audioKey;
      } catch {
        try {
          player.remove();
        } catch {
        }
        audioPlayersRef.current.delete(audioKey);
      }
    };

    void playSelectedAudio();
  };

  const renderNumberCard = (
    item: {
      english: string;
      tshiluba: string;
      audioKey?: string;
    },
    index: number
  ) => {
    return (
      <View
        key={`${item.english}-${index}`}
        style={[
          styles.numberCard,
          index % 5 === 0 && styles.pinkCard,
          index % 5 === 1 && styles.blueCard,
          index % 5 === 2 && styles.yellowCard,
          index % 5 === 3 && styles.lavenderCard,
          index % 5 === 4 && styles.greenCard,
        ]}
      >
        {/* NUMBER */}

        <View style={styles.numberSide}>
          <Text style={styles.numberText}>
            {item.english}
          </Text>
        </View>

        {/* TSHILUBA */}

        <View style={styles.tshilubaSide}>
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => playAudio(item.audioKey ?? "")}
            activeOpacity={0.6}
          >
            <Text style={styles.playEmoji}>
              ▶️
            </Text>
          </TouchableOpacity>

          <Text style={styles.tshilubaText}>
            {item.tshiluba}
          </Text>
        </View>
      </View>
    );
  };

  /* =========================
     COMPLETE LESSON 1
  ========================= */

  const completeLessonOne = () => {
    onComplete(
      "numbers-1",
      lessonOneNumbers.length
    );

    setCurrentLesson(2);
  };

  /* =========================
     COMPLETE LESSON 2
  ========================= */

  const completeLessonTwo = () => {
    onComplete(
      "numbers-2",
      lessonTwoNumbers.length
    );

    onGoToJourney();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* BACK BUTTON */}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() =>
          currentLesson === 1
            ? onBack()
            : setCurrentLesson((lesson) => lesson - 1)
        }
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
        NUMBERS
      </Text>

      <Text style={styles.title}>
        Let’s count together.
      </Text>

      <Text style={styles.subtitle}>
        Learn how to count from one to twenty
        in Tshiluba.
      </Text>

      {/* LESSON INDICATOR */}

      <View style={styles.lessonBadge}>
        <Text style={styles.lessonBadgeText}>
          LESSON {currentLesson} OF 2
        </Text>
      </View>

      {/* ==================================================
          LESSON 1 — 1 TO 10
      ================================================== */}

      {currentLesson === 1 && (
        <>
          <View style={styles.lessonIntro}>
            <Text style={styles.lessonNumber}>
              LESSON 1
            </Text>

            <Text style={styles.lessonTitle}>
              Numbers 1–10 🔢
            </Text>

            <Text style={styles.lessonDescription}>
              Start with the first ten numbers.
              Listen, repeat, and practice counting
              out loud.
            </Text>
          </View>

          <Text style={styles.sectionTitle}>
            🔢 One to Ten
          </Text>

          {lessonOneNumbers.map(renderNumberCard)}

          <View style={styles.endCard}>
            <Text style={styles.endEmoji}>
              🔢
            </Text>

            <Text style={styles.endTitle}>
              You can count to ten!
            </Text>

            <Text style={styles.endText}>
              Try counting objects around you in
              Tshiluba. Practice makes it easier to
              remember.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.completeButton}
            onPress={completeLessonOne}
            activeOpacity={0.8}
          >
            <Text style={styles.completeButtonText}>
              Complete Lesson 1 ✓
            </Text>
          </TouchableOpacity>
        </>
      )}

      {/* ==================================================
          LESSON 2 — 11 TO 20
      ================================================== */}

      {currentLesson === 2 && (
        <>
          <View style={styles.lessonIntro}>
            <Text style={styles.lessonNumber}>
              LESSON 2
            </Text>

            <Text style={styles.lessonTitle}>
              Numbers 11–20 🔢
            </Text>

            <Text style={styles.lessonDescription}>
              You've got the first ten. Now let's
              continue counting all the way to twenty.
            </Text>
          </View>

          <Text style={styles.sectionTitle}>
            🔢 Eleven to Twenty
          </Text>

          {lessonTwoNumbers.map(renderNumberCard)}

          <View style={styles.endCard}>
            <Text style={styles.endEmoji}>
              🎉
            </Text>

            <Text style={styles.endTitle}>
              You can count to twenty!
            </Text>

            <Text style={styles.endText}>
              Amazing! Keep practicing until these
              numbers become second nature.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.completeButton}
            onPress={completeLessonTwo}
            activeOpacity={0.8}
          >
            <Text style={styles.completeButtonText}>
              Complete Numbers Lesson ✓
            </Text>
          </TouchableOpacity>
        </>
      )}

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
    paddingBottom: 50,
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
    marginBottom: 20,
  },

  eyebrow: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: "#9B8CB5",
    marginBottom: 8,
  },

  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#332C28",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: "#6F625B",
    marginBottom: 18,
  },

  lessonBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#E9E1F5",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginBottom: 24,
  },

  lessonBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    color: "#75628F",
  },

  lessonIntro: {
    backgroundColor: "#E4F3EC",
    borderRadius: 24,
    padding: 22,
    marginBottom: 26,
  },

  lessonNumber: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: "#6F8F7B",
    marginBottom: 7,
  },

  lessonTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#332C28",
    marginBottom: 7,
  },

  lessonDescription: {
    fontSize: 14,
    lineHeight: 21,
    color: "#6F625B",
  },

  sectionTitle: {
    fontSize: 25,
    fontWeight: "800",
    color: "#332C28",
    textAlign: "center",
    marginBottom: 18,
  },

  numberCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 14,
    minHeight: 90,
    flexDirection: "row",
    alignItems: "center",
  },

  numberSide: {
    width: 70,
    alignItems: "center",
    justifyContent: "center",
  },

  numberText: {
    fontSize: 32,
    fontWeight: "800",
    color: "#332C28",
  },

  tshilubaSide: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
  },

  playButton: {
    marginRight: 8,
  },

  playEmoji: {
    fontSize: 26,
  },

  tshilubaText: {
    flex: 1,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "600",
    color: "#332C28",
    flexShrink: 1,
  },

  pinkCard: {
    backgroundColor: "#F7DDE5",
  },

  blueCard: {
    backgroundColor: "#DDEFF8",
  },

  yellowCard: {
    backgroundColor: "#FFF1C9",
  },

  lavenderCard: {
    backgroundColor: "#E9E1F5",
  },

  greenCard: {
    backgroundColor: "#DDEEE3",
  },

  endCard: {
    backgroundColor: "#E4F3EC",
    borderRadius: 26,
    padding: 26,
    marginTop: 10,
    alignItems: "center",
  },

  endEmoji: {
    fontSize: 34,
    marginBottom: 10,
  },

  endTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#332C28",
    marginBottom: 8,
    textAlign: "center",
  },

  endText: {
    fontSize: 14,
    lineHeight: 21,
    color: "#6F625B",
    textAlign: "center",
  },

  completeButton: {
    backgroundColor: "#6F8F7B",
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },

  completeButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },
});