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

type FamilyScreenProps = {
  onBack: () => void;
  onComplete: (lessonId: string, wordsCompleted: number) => void;
  onGoToJourney: () => void;
};

const familyWords = [
  {
    english: "My children",
    tshiluba: "Bana bani",
    audioKeys: ["Bana bani"],
  },
  {
    english: "Mother",
    tshiluba: "Mamu",
    audioKeys: ["Malu"],
  },
  {
    english: "Father",
    tshiluba: "1) Tatu\n2) Baba",
    audioKeys: ["Tatu"],
  },
  {
    english: "Parents",
    tshiluba: "Baledi",
    audioKeys: ["Baledi"],
  },
  {
    english: "Sister",
    tshiluba: "Muakuni wa bakaji",
    audioKeys: ["Muakuni wa bakaji"],
  },
  {
    english: "Brother",
    tshiluba: "Muakunyï wa balume",
    audioKeys: ["Muakunyï wa balume"],
  },
  {
    english: "Son",
    tshiluba: "Mwana wa baluma",
    audioKeys: ["Mwana wa baluma"],
  },
  {
    english: "Daughter",
    tshiluba: "Muana wa bakaji",
    audioKeys: ["Muana wa bakaji"],
  },
  {
    english: "Husband",
    tshiluba: "1) Bayani\n2) Mulume",
    audioKeys: ["Bayani"],
  },
  {
    english: "Wife",
    tshiluba: "Mukajanyi",
    audioKeys: ["Mukajanyi"],
  },
  {
    english: "Aunt",
    tshiluba: "Tatu mukaji",
    audioKeys: ["Tatu mukaji"],
  },
  {
    english: "Uncle",
    tshiluba: "1) Manseba (Maternal Uncle)\n2) Papa leki (Paternal Uncle)",
    audioKeys: ["Manseba"],
  },
  {
    english: "Grandmother",
    tshiluba: "Kaku mukaji",
    audioKeys: ["Kaku mukaji"],
  },
  {
    english: "Grandfather",
    tshiluba: "Kaku mulume",
    audioKeys: ["Kaku mulume"],
  },
];

const pluralExamples = [
  {
    english: "My children",
    tshiluba: "Bana bani",
    audioKeys: ["Bana bani"],
  },
  {
    english: "His parents",
    tshiluba: "Batatu babu",
    audioKeys: ["Batatu babu"],
  },
  {
    english: "Your wives",
    tshiluba: "Bakaji benda",
    audioKeys: ["Bakaji benda"],
  },
];

const audioMap: Record<string, number> = {
  Malu: require("./audio/Malu.m4a"),
  "Tatu mukaji": require("./audio/tatu mukaji.m4a"),
  Manseba: require("./audio/manseba.m4a"),
  "Kaku mukaji": require("./audio/kaku mukaji.m4a"),
  "Bakaji benda": require("./audio/bakaji benda.m4a"),
  "Batatu babu": require("./audio/batatu babu.m4a"),
  "Bana bani": require("./audio/bana bani.m4a"),
  "Kaku mulume": require("./audio/kaku mulume.m4a"),
  Tatu: require("./audio/Tatu.m4a"),
  Baledi: require("./audio/baledi.m4a"),
  "Muakuni wa bakaji": require("./audio/muakani.m4a"),
  Bayani: require("./audio/bayani.m4a"),
  "Muana wa bakaji": require("./audio/mwana wa bakaji.m4a"),
  "Mwana wa baluma": require("./audio/mwana wa bailla.m4a"),
  "Muakunyï wa balume": require("./audio/muakunyi.m4a"),
  Mukajanyi: require("./audio/mukajanyi.m4a"),
};

export default function FamilyScreen({
  onBack,
  onComplete,
  onGoToJourney,
}: FamilyScreenProps) {
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

      audioPlayersRef.current.forEach((audioPlayer, audioKey) => {
        try {
          void audioPlayer.isLoaded;
          audioPlayer.remove();
        } catch {
          audioPlayersRef.current.delete(audioKey);
        }
      });
      audioPlayersRef.current.clear();
      activeAudioKeyRef.current = null;
    };
  }, []);

  const playAudio = (audioKeys: string[]) => {
    const audioKey = audioKeys[0];
    const audioSource = audioKey ? audioMap[audioKey] : undefined;

    if (!audioKey || !audioSource || !mountedRef.current) {
      return;
    }

    const requestId = ++playRequestRef.current;
    const previousAudioKey = activeAudioKeyRef.current;
    const previousAudioPlayer = previousAudioKey
      ? audioPlayersRef.current.get(previousAudioKey)
      : undefined;

    if (previousAudioPlayer && previousAudioKey && previousAudioKey !== audioKey) {
      try {
        if (previousAudioPlayer.isLoaded && previousAudioPlayer.playing) {
          previousAudioPlayer.pause();
        }
      } catch {
        audioPlayersRef.current.delete(previousAudioKey);
      }
    }

    const isAlive = (audioPlayer: AudioPlayer) => {
      try {
        void audioPlayer.isLoaded;
        return true;
      } catch {
        return false;
      }
    };

    const removePlayer = (audioPlayer: AudioPlayer, key: string) => {
      if (audioPlayersRef.current.get(key) === audioPlayer) {
        audioPlayersRef.current.delete(key);
      }

      if (isAlive(audioPlayer)) {
        try {
          audioPlayer.remove();
        } catch {
        }
      }
    };

    const waitForLoaded = async (audioPlayer: AudioPlayer) => {
      for (let attempt = 0; attempt < 20; attempt += 1) {
        if (
          requestId !== playRequestRef.current ||
          !mountedRef.current ||
          !isAlive(audioPlayer)
        ) {
          return false;
        }

        try {
          if (audioPlayer.isLoaded) {
            return true;
          }
        } catch {
          return false;
        }

        await new Promise((resolve) => setTimeout(resolve, 50));
      }

      return false;
    };

    const createPlayer = () => {
      const freshPlayer = createAudioPlayer(audioSource, {
        downloadFirst: true,
      });
      audioPlayersRef.current.set(audioKey, freshPlayer);
      return freshPlayer;
    };

    const startPlayer = async (audioPlayer: AudioPlayer) => {
      try {
        if (!isAlive(audioPlayer) || !audioPlayer.isLoaded) {
          return false;
        }

        audioPlayer.volume = 1;
        await audioPlayer.seekTo(0);

        if (!isAlive(audioPlayer) || !audioPlayer.isLoaded) {
          return false;
        }

        audioPlayer.play();
        return true;
      } catch {
        return false;
      }
    };

    const playSelectedAudio = async () => {
      let audioPlayer = audioPlayersRef.current.get(audioKey);

      if (!audioPlayer || !isAlive(audioPlayer)) {
        if (audioPlayer) {
          removePlayer(audioPlayer, audioKey);
        }
        audioPlayer = createPlayer();
      }

      if (!(await waitForLoaded(audioPlayer))) {
        removePlayer(audioPlayer, audioKey);
        audioPlayer = createPlayer();
      }

      if (
        requestId !== playRequestRef.current ||
        !mountedRef.current ||
        !(await waitForLoaded(audioPlayer))
      ) {
        removePlayer(audioPlayer, audioKey);
        return;
      }

      if (await startPlayer(audioPlayer)) {
        activeAudioKeyRef.current = audioKey;
        return;
      }

      removePlayer(audioPlayer, audioKey);
      const freshPlayer = createPlayer();

      if (
        requestId === playRequestRef.current &&
        mountedRef.current &&
        (await waitForLoaded(freshPlayer)) &&
        (await startPlayer(freshPlayer))
      ) {
        activeAudioKeyRef.current = audioKey;
      } else {
        removePlayer(freshPlayer, audioKey);
      }
    };

    void playSelectedAudio();
  };

  const renderVocabularyCard = (
    item: {
      english: string;
      tshiluba: string;
      audioKeys?: string[];
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
            onPress={() => playAudio(item.audioKeys ?? [])}
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

  const completeLessonOne = () => {
    onComplete("family-1", familyWords.length);
    setCurrentLesson(2);
  };

  const completeLessonTwo = () => {
    onComplete(
      "family-2",
      pluralExamples.length
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
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      {/* LOGO */}
      <Text style={styles.logo}>🌱 Tshiluba Roots</Text>

      {/* HEADER */}
      <Text style={styles.eyebrow}>
        FAMILY • LESSON {currentLesson} OF 2
      </Text>

      <Text style={styles.title}>
        Family & Home.
      </Text>

      <Text style={styles.subtitle}>
        Learn the words you need to talk about
        the people closest to you.
      </Text>

      {/* ================= LESSON 1 ================= */}
      {currentLesson === 1 && (
        <>
          <View style={styles.lessonIntro}>
            <Text style={styles.lessonNumber}>
              LESSON 1
            </Text>

            <Text style={styles.lessonTitle}>
              Family Vocabulary 👨🏾‍👩🏾‍👧🏾‍👦🏾
            </Text>

            <Text style={styles.lessonDescription}>
              Start by learning the names for the
              people in your family.
            </Text>
          </View>

          <Text style={styles.sectionTitle}>
            👨🏾‍👩🏾‍👧🏾 Family Members
          </Text>

          {familyWords.map(renderVocabularyCard)}

          <View style={styles.endCard}>
            <Text style={styles.endEmoji}>🏠🏾</Text>

            <Text style={styles.endTitle}>
              You know your family!
            </Text>

            <Text style={styles.endText}>
              Take your time with each word. Try
              saying them out loud and practice with
              someone in your family.
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

      {/* ================= LESSON 2 ================= */}
      {currentLesson === 2 && (
        <>
          <View style={styles.lessonIntro}>
            <Text style={styles.lessonNumber}>
              LESSON 2
            </Text>

            <Text style={styles.lessonTitle}>
              Talk About Family 💬
            </Text>

            <Text style={styles.lessonDescription}>
              Now let's use your family vocabulary
              in real sentences.
            </Text>
          </View>

          <Text style={styles.sectionTitle}>
            👨🏾‍👩🏾‍👧🏾 Plural Examples
          </Text>

          {pluralExamples.map(renderVocabularyCard)}

          <View style={styles.endCard}>
            <Text style={styles.endEmoji}>💚</Text>

            <Text style={styles.endTitle}>
              Family lesson complete!
            </Text>

            <Text style={styles.endText}>
              You can now talk about family members
              and use them in simple sentences.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.completeButton}
            onPress={completeLessonTwo}
            activeOpacity={0.8}
          >
            <Text style={styles.completeButtonText}>
              Complete Family Lesson ✓
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
    letterSpacing: 1.4,
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
    marginBottom: 22,
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
    marginTop: 4,
  },

  vocabularyCard: {
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