import React, { useEffect, useRef } from "react";
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

type TimeScreenProps = {
  onBack: () => void;
  onComplete: (lessonId: string, wordsCompleted: number) => Promise<void> | void;
  onGoToJourney: () => void;
};

const timeWords = [
  {
    english: "Always",
    tshiluba: "Katsha katsha",
    audioKey: "Always",
  },
  {
    english: "Never",
    tshiluba: "Kashindi",
    audioKey: "Never",
  },
  {
    english: "Now",
    tshiluba: "Pidiweu",
    audioKey: "Now",
  },
  {
    english: "Sometimes",
    tshiluba: "Meba makuabu",
    audioKey: "Sometimes",
  },
  {
    english: "Late",
    tshiluba: "Diba dipita",
    audioKey: "Late",
  },
  {
    english: "Later",
    tshiluba: "Pashisha",
    audioKey: "Later",
  },
  {
    english: "Early",
    tshiluba: "Pakutanga",
    audioKey: "Early",
  },
];

const timeQuestions = [
  {
    english: "What's the time?",
    tshiluba: "Tundi diba kayi?",
    audioKey: "What's the time?",
  },
];

const dayParts = [
  {
    english: "Morning",
    tshiluba: "Mujinda",
    audioKey: "Morning",
  },
  {
    english: "Afternoon",
    tshiluba: "Mumunya",
    audioKey: "Afternoon",
  },
  {
    english: "Evening",
    tshiluba: "Dilolu",
    audioKey: "Evening",
  },
  {
    english: "Night",
    tshiluba: "Butuku",
    audioKey: "Night",
  },
];

const audioMap: Record<string, number> = {
  Always: require("./audio/katsha katsha.m4a"),
  Never: require("./audio/kashindi.m4a"),
  Now: require("./audio/pidiweu.m4a"),
  Sometimes: require("./audio/meba makuabu.m4a"),
  Late: require("./audio/diba dipita.m4a"),
  Later: require("./audio/pashisha.m4a"),
  Early: require("./audio/pakuntaga.m4a"),
  "What's the time?": require("./audio/tundi diba kayi.m4a"),
  Morning: require("./audio/mujinda.m4a"),
  Afternoon: require("./audio/mumunya.m4a"),
  Evening: require("./audio/dilolu.m4a"),
  Night: require("./audio/butuku.m4a"),
};

export default function TimeScreen({
  onBack,
  onComplete,
  onGoToJourney,
}: TimeScreenProps) {
  const audioPlayersRef = useRef(new Map<string, AudioPlayer>());
  const activeAudioKeyRef = useRef<string | null>(null);
  const playRequestRef = useRef(0);
  const mountedRef = useRef(true);
  const totalWords =
    timeWords.length +
    timeQuestions.length +
    dayParts.length;

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
      activeAudioKeyRef.current = null;
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

    const isAlive = (player: AudioPlayer) => {
      try {
        void player.isLoaded;
        return true;
      } catch {
        return false;
      }
    };

    const removePlayer = (player: AudioPlayer) => {
      if (audioPlayersRef.current.get(audioKey) === player) {
        audioPlayersRef.current.delete(audioKey);
      }
      if (isAlive(player)) {
        try {
          player.remove();
        } catch {
        }
      }
    };

    const waitForLoaded = async (player: AudioPlayer) => {
      for (let attempt = 0; attempt < 20; attempt += 1) {
        if (
          requestId !== playRequestRef.current ||
          !mountedRef.current ||
          !isAlive(player)
        ) {
          return false;
        }
        try {
          if (player.isLoaded) return true;
        } catch {
          return false;
        }
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      return false;
    };

    const createPlayer = () => {
      const player = createAudioPlayer(audioSource, { downloadFirst: true });
      audioPlayersRef.current.set(audioKey, player);
      return player;
    };

    const playSelectedAudio = async () => {
      let player = audioPlayersRef.current.get(audioKey);
      if (!player || !isAlive(player)) {
        if (player) removePlayer(player);
        player = createPlayer();
      }

      if (!(await waitForLoaded(player))) {
        removePlayer(player);
        player = createPlayer();
      }

      if (!(await waitForLoaded(player))) {
        removePlayer(player);
        return;
      }

      try {
        player.volume = 1;
        await player.seekTo(0);
        if (requestId !== playRequestRef.current || !isAlive(player)) {
          return;
        }
        player.play();
        activeAudioKeyRef.current = audioKey;
      } catch {
        removePlayer(player);
      }
    };

    void playSelectedAudio();
  };

  const renderVocabularyCard = (
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
          styles.vocabularyCard,
          index % 5 === 0 && styles.pinkCard,
          index % 5 === 1 && styles.blueCard,
          index % 5 === 2 && styles.yellowCard,
          index % 5 === 3 && styles.lavenderCard,
          index % 5 === 4 && styles.greenCard,
        ]}
      >
        <View style={styles.englishSide}>
          <Text style={styles.englishText}>
            {item.english}
          </Text>
        </View>

        <View style={styles.tshilubaSide}>
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => playAudio(item.audioKey ?? "")}
            activeOpacity={0.6}
          >
            <Text style={styles.playEmoji}>▶️</Text>
          </TouchableOpacity>

          <Text style={styles.tshilubaText}>
            {item.tshiluba}
          </Text>
        </View>
      </View>
    );
  };

  const completeLesson = async () => {
    await onComplete("time-1", totalWords);
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
        onPress={onBack}
        activeOpacity={0.7}
      >
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      {/* LOGO */}

      <Text style={styles.logo}>
        🌱 Tshiluba Roots
      </Text>

      {/* HEADER */}

      <Text style={styles.eyebrow}>
        TIME
      </Text>

      <Text style={styles.title}>
        Let’s talk about time.
      </Text>

      <Text style={styles.subtitle}>
        Learn useful words and phrases for
        talking about time and different parts
        of the day.
      </Text>

      {/* LESSON BADGE */}

      <View style={styles.lessonBadge}>
        <Text style={styles.lessonBadgeText}>
          LESSON 1 OF 1
        </Text>
      </View>

      {/* LESSON INTRO */}

      <View style={styles.lessonIntro}>
        <Text style={styles.lessonNumber}>
          LESSON 1
        </Text>

        <Text style={styles.lessonTitle}>
          Time & Day Parts 🕐
        </Text>

        <Text style={styles.lessonDescription}>
          Learn the vocabulary you need to talk
          about when things happen.
        </Text>
      </View>

      {/* TIME WORDS */}

      <Text style={styles.sectionTitle}>
        🕐 Time Words
      </Text>

      {timeWords.map(renderVocabularyCard)}

      {/* TIME QUESTION */}

      <Text style={styles.sectionTitle}>
        ❓ Asking About Time
      </Text>

      {timeQuestions.map(renderVocabularyCard)}

      {/* DAY PARTS */}

      <Text style={styles.sectionTitle}>
        🌅 Parts of the Day
      </Text>

      {dayParts.map(renderVocabularyCard)}

      {/* END CARD */}

      <View style={styles.endCard}>
        <Text style={styles.endEmoji}>
          🕐
        </Text>

        <Text style={styles.endTitle}>
          Time lesson complete!
        </Text>

        <Text style={styles.endText}>
          Practice these words throughout your
          day. Try describing what time it is and
          when different things happen.
        </Text>
      </View>

      {/* COMPLETE */}

      <TouchableOpacity
        style={styles.completeButton}
        onPress={completeLesson}
        activeOpacity={0.8}
      >
        <Text style={styles.completeButtonText}>
          Complete Time Lesson ✓
        </Text>
      </TouchableOpacity>

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
    marginTop: 8,
  },

  vocabularyCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 14,
    minHeight: 90,
    flexDirection: "row",
    alignItems: "center",
  },

  englishSide: {
    flex: 1,
    paddingRight: 10,
  },

  englishText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#332C28",
  },

  tshilubaSide: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 5,
  },

  playButton: {
    marginRight: 8,
  },

  playEmoji: {
    fontSize: 26,
  },

  tshilubaText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 23,
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