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

type CommonVerbsScreenProps = {
  onBack: () => void;
  onComplete: (lessonId: string, wordsCompleted: number) => Promise<void> | void;
  onGoToJourney: () => void;
};

const lessonOneVerbs = [
  { english: "To be", tshiluba: "Kuikala", audioKey: "To be" },
  { english: "To have", tshiluba: "Kuikala ne", audioKey: "To have" },
  { english: "To eat", tshiluba: "Kudia", audioKey: "To eat" },
  { english: "To buy", tshiluba: "Kusumba", audioKey: "To buy" },
  { english: "To know", tshiluba: "Kumanya", audioKey: "To know" },
  { english: "To drink", tshiluba: "Kunua", audioKey: "To drink" },
  { english: "To talk", tshiluba: "Kuakula", audioKey: "To talk" },
  { english: "To run", tshiluba: "Kunyema", audioKey: "To run" },
  { english: "To listen / hear", tshiluba: "Kuteleja", audioKey: "To listen / hear" },
  { english: "To love", tshiluba: "Kunanga", audioKey: "To love" },
];

const lessonTwoVerbs = [
  { english: "To read", tshiluba: "Kubala", audioKey: "To read" },
  { english: "To study / learn", tshiluba: "Kulonga", audioKey: "To study / learn" },
  { english: "To walk", tshiluba: "Kuendakana", audioKey: "To walk" },
  { english: "To work", tshiluba: "Kuenza mudimu", audioKey: "To work" },
  { english: "To do", tshiluba: "Kuenza", audioKey: "To do" },
  { english: "To want", tshiluba: "Kuyinga / Kusua", audioKey: "To want" },
  { english: "To sleep", tshiluba: "Kulala", audioKey: "To sleep" },
  { english: "To write", tshiluba: "Kufunda", audioKey: "To write" },
  { english: "To cook", tshiluba: "Kulamba", audioKey: "To cook" },
  { english: "To call", tshiluba: "Kubikila", audioKey: "To call" },
];

const audioMap: Record<string, number> = {
  "To be": require("./audio/Kuikala.m4a"),
  "To have": require("./audio/kuikala ne.m4a"),
  "To eat": require("./audio/kudia.m4a"),
  "To buy": require("./audio/kusumba.m4a"),
  "To know": require("./audio/Kumanya.m4a"),
  "To drink": require("./audio/kunua.m4a"),
  "To talk": require("./audio/Kuakula.m4a"),
  "To run": require("./audio/kunyema.m4a"),
  "To listen / hear": require("./audio/Kuteleja.m4a"),
  "To love": require("./audio/Kunanga.m4a"),
  "To read": require("./audio/Kubula.m4a"),
  "To study / learn": require("./audio/Kulonga.m4a"),
  "To walk": require("./audio/kuendakana.m4a"),
  "To work": require("./audio/kuenza mudimu.m4a"),
  "To do": require("./audio/kuenza.m4a"),
  "To want": require("./audio/kuyinga.m4a"),
  "To sleep": require("./audio/kulala.m4a"),
  "To write": require("./audio/kufunda.m4a"),
  "To cook": require("./audio/kulamba.m4a"),
  "To call": require("./audio/kubikila.m4a"),
};

export default function CommonVerbsScreen({
  onBack,
  onComplete,
  onGoToJourney,
}: CommonVerbsScreenProps) {
  const [currentLesson, setCurrentLesson] = useState(1);
  const audioPlayersRef = useRef(new Map<string, AudioPlayer>());
  const activeAudioKeyRef = useRef<string | null>(null);
  const playRequestRef = useRef(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true });
    return () => {
      mountedRef.current = false;
      playRequestRef.current += 1;
      audioPlayersRef.current.forEach((player) => {
        try {
          player.remove();
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
    const previousPlayer = previousKey ? audioPlayersRef.current.get(previousKey) : undefined;

    if (previousPlayer && previousKey && previousKey !== audioKey) {
      try {
        if (previousPlayer.isLoaded && previousPlayer.playing) previousPlayer.pause();
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
        for (let attempt = 0; attempt < 20 && !player.isLoaded; attempt += 1) {
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
        if (requestId !== playRequestRef.current || !mountedRef.current || !player.isLoaded) return;
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

  const renderVerbCard = (
    verb: { english: string; tshiluba: string; audioKey?: string },
    index: number
  ) => {
    return (
      <View
        key={`${verb.english}-${index}`}
        style={[
          styles.verbCard,
          index % 5 === 0 && styles.pinkCard,
          index % 5 === 1 && styles.blueCard,
          index % 5 === 2 && styles.yellowCard,
          index % 5 === 3 && styles.lavenderCard,
          index % 5 === 4 && styles.greenCard,
        ]}
      >
        {/* English */}
        <View style={styles.englishSide}>
          <Text style={styles.englishText}>
            {verb.english}
          </Text>
        </View>

        {/* Tshiluba + Audio */}
        <View style={styles.tshilubaSide}>
          <TouchableOpacity
            onPress={() => playAudio(verb.audioKey ?? "")}
            activeOpacity={0.6}
            style={styles.playButton}
          >
            <Text style={styles.playEmoji}>▶️</Text>
          </TouchableOpacity>

          <Text style={styles.tshilubaText}>
            {verb.tshiluba}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Back */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() =>
          currentLesson === 1
            ? onBack()
            : setCurrentLesson((lesson) => lesson - 1)
        }
      >
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      {/* Header */}
      <Text style={styles.logo}>🌱 Tshiluba Roots</Text>

      <Text style={styles.eyebrow}>
        VOCABULARY • LESSON {currentLesson}
      </Text>

      <Text style={styles.title}>
        Common Verbs
      </Text>

      <Text style={styles.subtitle}>
        Learn the words you'll use to talk about
        everyday actions.
      </Text>

      {/* Lesson indicator */}
      <View style={styles.lessonBadge}>
        <Text style={styles.lessonBadgeText}>
          LESSON {currentLesson} OF 2
        </Text>
      </View>

      {/* Info */}
      <View style={styles.infoCard}>
        <Text style={styles.infoEmoji}>💡</Text>

        <Text style={styles.infoTitle}>
          Learn the word first
        </Text>

        <Text style={styles.infoText}>
          These are the basic verb forms. Later,
          we'll use them in the Speak section to
          build sentences.
        </Text>
      </View>

      {/* LESSON 1 */}
      {currentLesson === 1 && (
        <>
          <Text style={styles.sectionTitle}>
            🌱 Everyday Actions
          </Text>

          {lessonOneVerbs.map(renderVerbCard)}

          {/* Complete Lesson 1 */}
          <TouchableOpacity
  style={styles.completeButton}
  onPress={async () => {
    await onComplete(
      "common-verbs-1",
      lessonOneVerbs.length
    );
    setCurrentLesson(2);
  }}
  activeOpacity={0.8}
>
            <Text style={styles.completeButtonText}>
              Complete Lesson 1 ✓
            </Text>
          </TouchableOpacity>
        </>
      )}

      {/* LESSON 2 */}
      {currentLesson === 2 && (
        <>
          <Text style={styles.sectionTitle}>
            💬 More Everyday Verbs
          </Text>

          {lessonTwoVerbs.map(renderVerbCard)}

          {/* End */}
          <View style={styles.endCard}>
            <Text style={styles.endEmoji}>🌱</Text>

            <Text style={styles.endTitle}>
              You've got the basics!
            </Text>

            <Text style={styles.endText}>
              You now know 20 common Tshiluba verbs.
              Next, we'll turn these verbs into real
              Tshiluba sentences.
            </Text>
          </View>

          {/* Complete Entire Category */}
          <TouchableOpacity
            style={styles.completeButton}
            onPress={async () => {
              await onComplete(
                "common-verbs-2",
                lessonTwoVerbs.length
              );
              onGoToJourney();
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.completeButtonText}>
              Complete Common Verbs Lesson ✓
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
    marginBottom: 20,
  },

  lessonBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    color: "#75628F",
  },

  infoCard: {
    backgroundColor: "#FFF1C9",
    borderRadius: 24,
    padding: 22,
    marginBottom: 24,
  },

  infoEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },

  infoTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#332C28",
    marginBottom: 7,
  },

  infoText: {
    fontSize: 14,
    lineHeight: 21,
    color: "#6F625B",
  },

  sectionTitle: {
    fontSize: 25,
    fontWeight: "800",
    color: "#332C28",
    marginBottom: 18,
    textAlign: "center",
  },

  verbCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 14,
    minHeight: 100,
    flexDirection: "row",
    alignItems: "center",
  },

  englishSide: {
    flex: 1,
    paddingRight: 10,
  },

  englishText: {
    fontSize: 18,
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
    fontSize: 27,
  },

  tshilubaText: {
    fontSize: 18,
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

  endCard: {
    backgroundColor: "#E4F3EC",
    borderRadius: 26,
    padding: 26,
    marginTop: 10,
    alignItems: "center",
  },

  endEmoji: {
    fontSize: 32,
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
});