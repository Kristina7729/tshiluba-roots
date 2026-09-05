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

type LessonScreenProps = {
  onBack: () => void;
  onComplete: (lessonId: string, wordsCompleted: number) => Promise<void> | void;
  onGoToJourney: () => void;
};

/* =========================
   LESSON 1 — GREETINGS
========================= */

const greetings = [
  {
    english: "Welcome!",
    tshiluba: "Dilue dinpe!",
    audioKey: "Welcome!",
  },
  {
    english: "Hi!",
    tshiluba: "1) Moyo!\n2) Bishi!",
    audioKey: "Hi!",
  },
  {
    english: "Good Morning",
    tshiluba: "Betuabu",
    audioKey: "Good Morning",
  },
  {
    english: "Good Afternoon",
    tshiluba: "Dilolo dilenga",
    audioKey: "Good Afternoon",
  },
  {
    english: "Good Evening",
    tshiluba: "Butuku Bulenga",
    audioKey: "Good Evening",
  },
  {
    english: "Good Night",
    tshiluba: "1) Lalayi bimpe\n2) Nulala Bilenga",
    audioKey: "Good Night",
  },
  {
    english: "See you",
    tshiluba: "Uye bimpe",
    audioKey: "See you",
  },
  {
    english: "See you tomorrow",
    tshiluba:
      "1) Nitumonagana makelela (from Kananga)\n2) Malaba natumonagana (From Mbuji Mayi)",
    audioKey: "See you tomorrow",
  },
  {
    english: "Have a nice day",
    tshiluba: "1) Dituku dilenga\n2) Dituku bimpe",
    audioKey: "Have a nice day",
  },
  {
    english: "Have a nice trip",
    tshiluba:
      "1) Luendu lulenga\n2) Waya bilenge\n3) Waya bimpe",
    audioKey: "Have a nice trip",
  },
  {
    english: "Goodbye",
    tshiluba: "1) Uya bimpe\n2) Ushala bilenge",
    audioKey: "Goodbye",
  },
];

/* =========================
   LESSON 2 — INTRODUCTIONS
========================= */

const introductions = [
  {
    english: "What is your name?",
    tshiluba: "Dina dieba ngani?",
    audioKey: "What is your name?",
  },
  {
    english: "My name is ____",
    tshiluba: "Dina diani ____",
    audioKey: "My name is ____",
  },
  {
    english: "...and you?",
    tshiluba: "..kadi wewa?",
    audioKey: "...and you?",
  },
  {
    english: "Where are you from?",
    tshiluba: "Kwenu penyi?",
    audioKey: "Where are you from?",
  },
  {
    english: "I am from ____, and you?",
    tshiluba: "Ndi wa ku ____, kadi wewa?",
    audioKey: "I am from ____, and you?",
  },
  {
    english: "Nice to meet you",
    tshiluba: "Ndi ne disanka bua kumanyangana",
    audioKey: "Nice to meet you",
  },
  {
    english: "How old are you?",
    tshiluba: "Udi ni mvula bungi munyi?",
    audioKey: "How old are you?",
  },
  {
    english: "I am ____ years old",
    tshiluba: "Ndi ni mvula ____",
    audioKey: "I am ____ years old",
  },
];

/* =========================
   LESSON 3 — HOW ARE YOU?
========================= */

const howAreYou = [
  {
    english: "How are you?",
    tshiluba: "Udi bishi?",
    audioKey: "How are you?",
  },
  {
    english: "How are things?",
    tshiluba: "Malu kayi?",
    audioKey: "How are things?",
  },
  {
    english: "You good?",
    tshiluba: "Udi bimpe?",
    audioKey: "You good?",
  },
  {
    english: "I'm okay",
    tshiluba: "Ndi bimpe / Ndi biakana",
    audioKey: "I'm okay",
  },
  {
    english: "We are okay",
    tshiluba: "Tudi bimpe",
    audioKey: "We are okay",
  },
  {
    english: "Things are good",
    tshiluba: "Malu bimpe",
    audioKey: "Things are good",
  },
  {
    english: "I'm great",
    tshiluba: "Ndi bilenga",
    audioKey: "I'm great",
  },
  {
    english: "I'm not good",
    tshiluba: "Tshena bilenga to",
    audioKey: "I'm not good",
  },
  {
    english: "I could be better",
    tshiluba: "Ndi buakuikala bilenga",
    audioKey: "I could be better",
  },
  {
    english: "I'm tired",
    tshiluba: "Ndi mutshoke",
    audioKey: "I'm tired",
  },
  {
    english: "I'm hungry",
    tshiluba: "Ndi ne nzala",
    audioKey: "I'm hungry",
  },
  {
    english: "I'm sick",
    tshiluba: "Ndi sama",
    audioKey: "I'm sick",
  },
  {
    english: "I'm a bit sick",
    tshiluba: "Ndi sama kakesa",
    audioKey: "I'm a bit sick",
  },
  {
    english: "Did you sleep well?",
    tshiluba: "Udi mulala bimpe?",
    audioKey: "Did you sleep well?",
  },
  {
    english: "I slept well",
    tshiluba: "Ndi mulala bimpe",
    audioKey: "I slept well",
  },
  {
    english: "I didn't sleep well",
    tshiluba: "Tshena mulala bimpe to",
    audioKey: "I didn't sleep well",
  },
];

/* =========================
   AUDIO
========================= */

const audioMap: Record<string, any> = {
  "Welcome!": require("./audio/dilue-dinpe.m4a"),
  "Hi!": require("./audio/Moyo-bishi.m4a"),
  "Good Morning": require("./audio/betulawu.m4a"),
  "Good Afternoon": require("./audio/dilo dilenga.m4a"),
  "Good Evening": require("./audio/brutuka bulenga.m4a"),
  "Good Night": require("./audio/lalayi bimpe - nulala bilenga.m4a"),
  "See you": require("./audio/uye bimpe1.m4a"),
  "See you tomorrow": require("./audio/nitumonagana makelela.m4a"),
  "Have a nice day": require("./audio/dituku dilenga.m4a"),
  "Have a nice trip": require("./audio/luenda lulenga.m4a"),
  "Goodbye": require("./audio/uya bimpe.m4a"),
  "What is your name?": require("./audio/dina dieba ngani_.m4a"),
  "My name is ____": require("./audio/Dina diani.m4a"),
  "...and you?": require("./audio/kadi wewa.m4a"),
  "Where are you from?": require("./audio/kwenu penyi_.m4a"),
  "I am from ____, and you?": require("./audio/ndi wa ku.m4a"),
  "Nice to meet you": require("./audio/ndi ne disanka bua.m4a"),
  "How old are you?": require("./audio/Udi ni mvula bungi munyi.m4a"),
  "I am ____ years old": require("./audio/Ndi ni muvula.m4a"),
  "How are you?": require("./audio/udi bishi.m4a"),
  "How are things?": require("./audio/malu kayi.m4a"),
  "You good?": require("./audio/udi bimpe.m4a"),
  "I'm okay": require("./audio/ndi bimpe.m4a"),
  "We are okay": require("./audio/tudi bimpe.m4a"),
  "Things are good": require("./audio/malu bimpe.m4a"),
  "I'm great": require("./audio/Ndi bilenga.m4a"),
  "I'm not good": require("./audio/tshena bilenga to.m4a"),
  "I could be better": require("./audio/ndi buakuikala bilenga.m4a"),
  "I'm tired": require("./audio/ndi mutshoke.m4a"),
  "I'm hungry": require("./audio/ndi ne nzala.m4a"),
  "I'm sick": require("./audio/ndi sama.m4a"),
  "I'm a bit sick": require("./audio/Ndi sama kakesa.m4a"),
  "Did you sleep well?": require("./audio/Udi mulala bimpe.m4a"),
  "I slept well": require("./audio/Ndi mulala bimpe.m4a"),
  "I didn't sleep well": require("./audio/tshena mulala bimpe to.m4a"),
};

export default function LessonScreen({
  onBack,
  onComplete,
  onGoToJourney,
}: LessonScreenProps) {
  const [currentLesson, setCurrentLesson] = useState(1);

  /* =========================
     AUDIO PLAYER
  ========================= */

  const audioPlayersRef = useRef(new Map<string, AudioPlayer>());
  const activeAudioKeyRef = useRef<string | null>(null);
  const playRequestRef = useRef(0);

  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
    });
  }, []);

  /* =========================
     PLAY AUDIO
  ========================= */

  const playAudio = (audioKey: string) => {
    const audioSource = audioMap[audioKey];

    if (!audioSource) {
      console.log(
        "No recording added yet for:",
        audioKey
      );
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
        if (requestId !== playRequestRef.current || !isAlive(audioPlayer)) {
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

        if (!(await waitForLoaded(audioPlayer))) {
          removePlayer(audioPlayer, audioKey);
          return;
        }
      }

      if (requestId !== playRequestRef.current || !isAlive(audioPlayer)) {
        return;
      }

      const startPlayer = async (player: AudioPlayer) => {
        try {
          if (!isAlive(player) || !player.isLoaded) {
            return false;
          }

          player.volume = 1;
          await player.seekTo(0);

          if (!isAlive(player) || !player.isLoaded) {
            return false;
          }

          player.play();
          return true;
        } catch {
          return false;
        }
      };

      if (await startPlayer(audioPlayer)) {
        activeAudioKeyRef.current = audioKey;
      } else {
        removePlayer(audioPlayer, audioKey);
        const freshPlayer = createPlayer();

        if (
          requestId === playRequestRef.current &&
          (await waitForLoaded(freshPlayer)) &&
          (await startPlayer(freshPlayer))
        ) {
          activeAudioKeyRef.current = audioKey;
        } else {
          removePlayer(freshPlayer, audioKey);
        }
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
        {/* ENGLISH */}
        <View style={styles.englishSide}>
          <Text style={styles.englishText}>
            {item.english}
          </Text>
        </View>

        {/* TSHILUBA */}
        <View style={styles.tshilubaSide}>
          <TouchableOpacity
            style={styles.playButton}
            onPress={() =>
              playAudio(item.audioKey ?? "")
            }
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
     COMPLETE LESSON
  ========================= */

  const completeCurrentLesson = async () => {
    if (currentLesson === 1) {
      await onComplete(
        "greetings-1",
        greetings.length
      );

      setCurrentLesson(2);
    } else if (currentLesson === 2) {
      await onComplete(
        "greetings-2",
        introductions.length
      );

      setCurrentLesson(3);
    } else {
      await onComplete(
        "greetings-3",
        howAreYou.length
      );

      onGoToJourney();
    }
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
        GREETINGS & INTRODUCTIONS
      </Text>

      <Text style={styles.title}>
        Let’s start talking.
      </Text>

      <Text style={styles.subtitle}>
        Learn the words and phrases you need
        to start conversations in Tshiluba.
      </Text>

      {/* LESSON INDICATOR */}

      <View style={styles.lessonBadge}>
        <Text style={styles.lessonBadgeText}>
          LESSON {currentLesson} OF 3
        </Text>
      </View>

      {/* ==================================================
          LESSON 1
      ================================================== */}

      {currentLesson === 1 && (
        <>
          <View style={styles.lessonIntro}>
            <Text style={styles.lessonNumber}>
              LESSON 1
            </Text>

            <Text style={styles.lessonTitle}>
              Greetings 👋🏾
            </Text>

            <Text style={styles.lessonDescription}>
              Start with the words you'll use
              when greeting family and friends.
            </Text>
          </View>

          <Text style={styles.sectionTitle}>
            👋🏾 Greetings
          </Text>

          {greetings.map(renderVocabularyCard)}

          <View style={styles.endCard}>
            <Text style={styles.endEmoji}>
              👋🏾
            </Text>

            <Text style={styles.endTitle}>
              You know how to greet!
            </Text>

            <Text style={styles.endText}>
              Practice these greetings out loud.
              Try them with someone in your family.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.completeButton}
            onPress={completeCurrentLesson}
            activeOpacity={0.8}
          >
            <Text style={styles.completeButtonText}>
              Complete Lesson 1 ✓
            </Text>
          </TouchableOpacity>
        </>
      )}

      {/* ==================================================
          LESSON 2
      ================================================== */}

      {currentLesson === 2 && (
        <>
          <View style={styles.lessonIntro}>
            <Text style={styles.lessonNumber}>
              LESSON 2
            </Text>

            <Text style={styles.lessonTitle}>
              Introduce Yourself 🙋🏾
            </Text>

            <Text style={styles.lessonDescription}>
              Learn how to tell someone your name,
              where you're from, and more.
            </Text>
          </View>

          <Text style={styles.sectionTitle}>
            🙋🏾 Introduce Yourself
          </Text>

          {introductions.map(renderVocabularyCard)}

          <View style={styles.endCard}>
            <Text style={styles.endEmoji}>
              🙋🏾
            </Text>

            <Text style={styles.endTitle}>
              Now you can introduce yourself!
            </Text>

            <Text style={styles.endText}>
              Practice these phrases with your
              family and start having conversations.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.completeButton}
            onPress={completeCurrentLesson}
            activeOpacity={0.8}
          >
            <Text style={styles.completeButtonText}>
              Complete Lesson 2 ✓
            </Text>
          </TouchableOpacity>
        </>
      )}

      {/* ==================================================
          LESSON 3
      ================================================== */}

      {currentLesson === 3 && (
        <>
          <View style={styles.lessonIntro}>
            <Text style={styles.lessonNumber}>
              LESSON 3
            </Text>

            <Text style={styles.lessonTitle}>
              How Are You? 💬
            </Text>

            <Text style={styles.lessonDescription}>
              Learn how to ask about someone's
              well-being and talk about how you feel.
            </Text>
          </View>

          <Text style={styles.sectionTitle}>
            💬 How Are You?
          </Text>

          {howAreYou.map(renderVocabularyCard)}

          <View style={styles.endCard}>
            <Text style={styles.endEmoji}>
              💚
            </Text>

            <Text style={styles.endTitle}>
              Greetings complete!
            </Text>

            <Text style={styles.endText}>
              You've learned how to greet people,
              introduce yourself, and talk about
              how you're feeling.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.completeButton}
            onPress={completeCurrentLesson}
            activeOpacity={0.8}
          >
            <Text style={styles.completeButtonText}>
              Complete Lesson 3 ✓
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