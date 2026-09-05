import React, { useEffect, useRef } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  createAudioPlayer,
  setAudioModeAsync,
  type AudioPlayer,
} from "expo-audio";

type EverydayPhrasesScreenProps = {
  onBack: () => void;
  onComplete: (lessonId: string, wordsCompleted: number) => void;
  onGoToJourney: () => void;
};

type Phrase = {
  english: string;
  tshiluba: string;
  audioKey?: string;
};

const phraseCategories: { title: string; phrases: Phrase[] }[] = [
  {
    title: "💬 Everyday Expressions",
    phrases: [
      { english: "Yes", tshiluba: "Eyowa", audioKey: "Yes" },
      { english: "No", tshiluba: "To", audioKey: "No" },
      { english: "Maybe", tshiluba: "Ku misangu", audioKey: "Maybe" },
      { english: "Please", tshiluba: "Bua luse", audioKey: "Please: Bua luse" },
      { english: "Thank you", tshiluba: "Tuasakidila", audioKey: "Thank you" },
    ],
  },
  {
    title: "💬 Understanding",
    phrases: [
      { english: "Did you understand?", tshiluba: "Udi muvua?", audioKey: "Did you understand?" },
      { english: "I understood", tshiluba: "Ndi muvua", audioKey: "I understood" },
      { english: "I didn't hear", tshiluba: "Tshena muvua to", audioKey: "I didn't hear" },
      { english: "I didn’t understand", tshiluba: "Tshena muvua to", audioKey: "I didn’t understand" },
      {
        english: "I don’t understand what you said",
        tshiluba: "Tshena ngunvua bindi wamba to",
        audioKey: "I don’t understand what you said",
      },
    ],
  },
  {
    title: "💬 Conversation Practice",
    phrases: [
      { english: "Can you speak slower?", tshiluba: "Akula koku biteketa?", audioKey: "Can you speak slower?" },
      { english: "Can you repeat this again?", tshiluba: "Bangulula kabidi?", audioKey: "Can you repeat this again?" },
      { english: "Come, let’s learn Tshiluba", tshiluba: "Luaku tulonga Tshiluba", audioKey: "Come, let’s learn Tshiluba" },
    ],
  },
];

export default function EverydayPhrasesScreen({
  onBack,
  onComplete,
  onGoToJourney,
}: EverydayPhrasesScreenProps) {
  const audioPlayersRef = useRef(new Map<string, AudioPlayer>());
  const activeAudioKeyRef = useRef<string | null>(null);
  const playRequestRef = useRef(0);
  const mountedRef = useRef(true);
  let cardIndex = 0;
  const totalPhrases = phraseCategories.reduce(
    (total, category) => total + category.phrases.length,
    0
  );

  const audioMap: Record<string, number> = {
    Yes: require("./audio/eyowa.m4a"),
    No: require("./audio/to.m4a"),
    Maybe: require("./audio/ku misangu.m4a"),
    "Please: Bua luse": require("./audio/bua luse.m4a"),
    "Thank you": require("./audio/tuasadidila.m4a"),
    "Did you understand?": require("./audio/undi muvua.m4a"),
    "I understood": require("./audio/ndi muvua.m4a"),
    "I don't know": require("./audio/tshena mumanya.m4a"),
    "I didn't hear": require("./audio/tshena muvua to.m4a"),
    "I didn’t understand": require("./audio/tshena munvua to.m4a"),
    "I don’t understand what you said": require("./audio/tshena ngunvua bindi.m4a"),
    "Can you speak slower?": require("./audio/akula koku biteketa.m4a"),
    "Can you repeat this again?": require("./audio/bangulula kabidi.m4a"),
    "Come, let’s learn Tshiluba": require("./audio/luaku tulonga tshiluba.m4a"),
  };

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

  const renderPhraseCard = (phrase: Phrase) => {
    const index = cardIndex++;
    return (
      <View
        key={`${phrase.english}-${index}`}
        style={[
          styles.phraseCard,
          index % 5 === 0 && styles.pinkCard,
          index % 5 === 1 && styles.blueCard,
          index % 5 === 2 && styles.yellowCard,
          index % 5 === 3 && styles.lavenderCard,
          index % 5 === 4 && styles.greenCard,
        ]}
      >
        <View style={styles.englishSide}>
          <Text style={styles.englishText}>{phrase.english}</Text>
        </View>

        <View style={styles.tshilubaSide}>
          <TouchableOpacity
            onPress={() => playAudio(phrase.audioKey ?? "")}
            activeOpacity={0.6}
            style={styles.playButton}
          >
            <Text style={styles.playEmoji}>▶️</Text>
          </TouchableOpacity>

          <Text style={styles.tshilubaText}>{phrase.tshiluba}</Text>
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
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      <Text style={styles.logo}>🌱 Tshiluba Roots</Text>
      <Text style={styles.eyebrow}>VOCABULARY</Text>
      <Text style={styles.title}>Everyday Phrases</Text>
      <Text style={styles.subtitle}>
        Learn useful phrases for everyday conversations.
      </Text>

      <View style={styles.infoCard}>
        <Text style={styles.infoEmoji}>💬</Text>
        <Text style={styles.infoTitle}>Everyday communication</Text>
        <Text style={styles.infoText}>
          Practice these phrases for clear, natural conversations.
        </Text>
      </View>

      {phraseCategories.map((category) => (
        <View key={category.title}>
          <Text style={styles.sectionTitle}>{category.title}</Text>
          {category.phrases.map(renderPhraseCard)}
        </View>
      ))}

      <TouchableOpacity
        style={styles.completeButton}
        onPress={() => {
          onComplete("everyday-phrases-1", totalPhrases);
          onGoToJourney();
        }}
        activeOpacity={0.8}
      >
        <Text style={styles.completeButtonText}>
          Complete Everyday Phrases ✓
        </Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF9F4" },
  content: { padding: 24, paddingBottom: 50 },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },
  backText: { fontSize: 30, color: "#332C28", marginTop: -3 },
  logo: { fontSize: 18, fontWeight: "700", color: "#6F8F7B", marginBottom: 20 },
  eyebrow: { fontSize: 12, fontWeight: "800", letterSpacing: 1.5, color: "#9B8CB5", marginBottom: 8 },
  title: { fontSize: 34, fontWeight: "800", color: "#332C28", marginBottom: 10 },
  subtitle: { fontSize: 16, lineHeight: 24, color: "#6F625B", marginBottom: 18 },
  infoCard: { backgroundColor: "#FFF1C9", borderRadius: 24, padding: 22, marginBottom: 24 },
  infoEmoji: { fontSize: 28, marginBottom: 8 },
  infoTitle: { fontSize: 19, fontWeight: "800", color: "#332C28", marginBottom: 7 },
  infoText: { fontSize: 14, lineHeight: 21, color: "#6F625B" },
  sectionTitle: { fontSize: 25, fontWeight: "800", color: "#332C28", marginBottom: 18, marginTop: 4, textAlign: "center" },
  phraseCard: { borderRadius: 24, padding: 20, marginBottom: 14, minHeight: 100, flexDirection: "row", alignItems: "center" },
  englishSide: { flex: 1, paddingRight: 10 },
  englishText: { fontSize: 18, fontWeight: "700", color: "#332C28" },
  tshilubaSide: { flex: 1, flexDirection: "row", alignItems: "center", paddingLeft: 5 },
  playButton: { marginRight: 8 },
  playEmoji: { fontSize: 27 },
  tshilubaText: { fontSize: 18, fontWeight: "600", color: "#332C28", flexShrink: 1 },
  pinkCard: { backgroundColor: "#F7DDE5" },
  blueCard: { backgroundColor: "#DDEFF8" },
  yellowCard: { backgroundColor: "#FFF1C9" },
  lavenderCard: { backgroundColor: "#E9E1F5" },
  greenCard: { backgroundColor: "#DDEEE3" },
  completeButton: {
    backgroundColor: "#6F8F7B",
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  completeButtonText: { color: "#FFFFFF", fontSize: 17, fontWeight: "800" },
});
