import React, { useEffect, useRef, useState } from "react";
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

type SpeakScreenProps = {
  onBack: () => void;
  onComplete: (lessonId: string, wordsCompleted: number) => Promise<void> | void;
  onGoToJourney: () => void;
};

const lessonOne = [
  { english: "Hello!", tshiluba: "Moyo!", audioKey: "Moyo" },
  { english: "How are you?", tshiluba: "Udi bishi?", audioKey: "How are you?" },
  { english: "I'm okay.", tshiluba: "Ndi bimpe / Ndi biakana", audioKey: "I'm okay." },
  { english: "What is your name?", tshiluba: "Dina dieba ngani?", audioKey: "What is your name?" },
  { english: "My name is ____.", tshiluba: "Dina diani ____", audioKey: "My name is _____." },
];

const lessonTwo = [
  { english: "Where are you from?", tshiluba: "Kwenu penyi?", audioKey: "Where are you from?" },
  { english: "I am from ____, and you?", tshiluba: "Ndi wa ku ____, kadi wewa?", audioKey: "I am from ____, and you?" },
  { english: "Nice to meet you.", tshiluba: "Ndi ne disanka bua kumanyangana", audioKey: "Nice to meet you." },
  { english: "...and you?", tshiluba: "..kadi wewa?", audioKey: "...and you?" },
  { english: "How old are you?", tshiluba: "Udi ni mvula bungi munyi?", audioKey: "How old are you?" },
  { english: "I am ____ years old.", tshiluba: "Ndi ni mvula ____", audioKey: "I am ____ years old." },
];

const lessonThree = [
  { english: "Did you sleep well?", tshiluba: "Udi mulala bimpe?", audioKey: "Did you sleep well?" },
  { english: "I slept well.", tshiluba: "Ndi mulala bimpe", audioKey: "I slept well." },
  { english: "I'm hungry.", tshiluba: "Ndi ne nzala", audioKey: "I'm hungry." },
  { english: "I'm tired.", tshiluba: "Ndi mutshoke", audioKey: "I'm tired." },
  { english: "I'm sick.", tshiluba: "Ndi sama", audioKey: "I'm sick." },
];

type ConversationLine = {
  speaker: string;
  english: string;
  tshiluba: string;
  audioKey?: string;
};

const conversationOne: ConversationLine[] = [
  { speaker: "👩 Person A", english: "Good morning.", tshiluba: "Betuabu", audioKey: "Good morning." },
  { speaker: "👩 Person B", english: "How are things?", tshiluba: "Malu kayi?", audioKey: "How are things?" },
  { speaker: "👩 Person A", english: "Things are good.", tshiluba: "Malu bimpe", audioKey: "Things are good." },
  { speaker: "👩 Person B", english: "And you?", tshiluba: "..kadi wewa?", audioKey: "And you?" },
  { speaker: "👩 Person A", english: "I could be better.", tshiluba: "Ndi buakuikala bilenga", audioKey: "I could be better." },
  { speaker: "👩 Person B", english: "How did you sleep?", tshiluba: "Udi mulala bimpe?", audioKey: "How did you sleep?" },
  { speaker: "👩 Person A", english: "I slept good.", tshiluba: "Ndi mulala bimpe", audioKey: "I slept good." },
  { speaker: "👩 Person B", english: "See you later.", tshiluba: "Uye bimpe", audioKey: "See you later." },
];

const conversationTwo: ConversationLine[] = [
  { speaker: "👩 Person A", english: "What is your name?", tshiluba: "Dina dieba ngani?", audioKey: "What is your name?" },
  { speaker: "👩 Person B", english: "My name is ____.", tshiluba: "Dina diani ____", audioKey: "My name is _____." },
  { speaker: "👩 Person A", english: "Where are you from?", tshiluba: "Kwenu penyi?", audioKey: "Where are you from?" },
  { speaker: "👩 Person B", english: "I am from ____, and you?", tshiluba: "Ndi wa ku ____, kadi wewa?", audioKey: "I am from ____, and you?" },
  { speaker: "👩 Person A", english: "I am from ____.", tshiluba: "Ndi wa ku ____", audioKey: "I am from ____" },
  { speaker: "👩 Person A", english: "Nice to meet you.", tshiluba: "Ndi ne disanka bua kumanyangana", audioKey: "Nice to meet you." },
  { speaker: "👩 Person A", english: "How old are you?", tshiluba: "Udi ni mvula bungi munyi?", audioKey: "How old are you?" },
  { speaker: "👩 Person B", english: "I am ____ years old.", tshiluba: "Ndi ni mvula ____", audioKey: "I am ____ years old." },
];

const conversationThree: ConversationLine[] = [
  { speaker: "👩 Person A", english: "What's the time?", tshiluba: "Tundi diba kayi?", audioKey: "What's the time?" },
  { speaker: "👩 Person B", english: "I don't understand what you said.", tshiluba: "Tshena ngunvua bindi wamba to", audioKey: "I don't understand what you said" },
  { speaker: "👩 Person B", english: "Can you speak slower?", tshiluba: "Akula koku biteketa?", audioKey: "Can you speak slower?" },
  { speaker: "👩 Person A", english: "No.", tshiluba: "To", audioKey: "No." },
  { speaker: "👩 Person A", english: "Come, let's learn Tshiluba.", tshiluba: "Luaku tulonga Tshiluba.", audioKey: "Come, let's learn Tshiluba" },
  { speaker: "👩 Person B", english: "Yes.", tshiluba: "Eyowa", audioKey: "Yes." },
  { speaker: "👩 Person A", english: "See you tomorrow.", tshiluba: "nitumonagana makelela / malaba natumonagana", audioKey: "See you tomorrow." },
];

const audioMap: Record<string, number> = {
  Moyo: require("./audio/Moyo.m4a"),
  "Good morning.": require("./audio/betulawu.m4a"),
  "How are things?": require("./audio/malu kayi.m4a"),
  "Things are good.": require("./audio/malu bimpe.m4a"),
  "And you?": require("./audio/kadi wewa.m4a"),
  "I could be better.": require("./audio/ndi buakuikala bilenga.m4a"),
  "How did you sleep?": require("./audio/Udi mulala bimpe.m4a"),
  "I slept good.": require("./audio/Ndi mulala bimpe.m4a"),
  "See you later.": require("./audio/uye bimpe1.m4a"),
  "Good Morning": require("./audio/betulawu.m4a"),
  "Things are good": require("./audio/malu bimpe.m4a"),
  "I could be better": require("./audio/ndi buakuikala bilenga.m4a"),
  "See you": require("./audio/uye bimpe1.m4a"),
  "How are you?": require("./audio/udi bishi.m4a"),
  "I'm okay.": require("./audio/ndi bimpe.m4a"),
  "What is your name?": require("./audio/dina dieba ngani_.m4a"),
  "My name is _____.": require("./audio/Dina diani.m4a"),
  "Where are you from?": require("./audio/kwenu penyi_.m4a"),
  "I am from ____, and you?": require("./audio/ndi wa ku.m4a"),
  "Nice to meet you.": require("./audio/ndi ne disanka bua.m4a"),
  "...and you?": require("./audio/kadi wewa.m4a"),
  "How old are you?": require("./audio/Udi ni mvula bungi munyi.m4a"),
  "Did you sleep well?": require("./audio/Udi mulala bimpe.m4a"),
  "I slept well.": require("./audio/Ndi mulala bimpe.m4a"),
  "I'm hungry.": require("./audio/ndi ne nzala.m4a"),
  "I'm tired.": require("./audio/ndi mutshoke.m4a"),
  "I'm sick.": require("./audio/ndi sama.m4a"),
  "Did you understand?": require("./audio/undi muvua.m4a"),
  "Can you repeat this again?": require("./audio/bangulula kabidi.m4a"),
  "I don't understand what you said": require("./audio/tshena ngunvua bindi.m4a"),
  "I am from ____": require("./audio/ndi wa ku1.m4a"),
  "I am ____ years old.": require("./audio/Ndi ni muvula.m4a"),
  "Thank you": require("./audio/tuasadidila.m4a"),
  "I didn't hear": require("./audio/tshena muvua to.m4a"),
  "Can you speak slower?": require("./audio/akula koku biteketa.m4a"),
  "I understood": require("./audio/ndi muvua.m4a"),
  "Come, let's learn Tshiluba": require("./audio/luaku tulonga tshiluba.m4a"),
  "What's the time?": require("./audio/tundi diba kayi.m4a"),
  "No.": require("./audio/to.m4a"),
  "Yes.": require("./audio/eyowa.m4a"),
  "See you tomorrow.": require("./audio/nitumonagana makelela.m4a"),
};

export default function SpeakScreen({ onBack, onComplete, onGoToJourney }: SpeakScreenProps) {
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

  const renderPhraseCard = (english: string, tshiluba: string, audioKey: string | undefined, index: number) => (
    <View key={index} style={styles.phraseCard}>
      <View style={styles.englishBox}>
        <Text style={styles.englishText}>{english}</Text>
      </View>
      <View style={styles.tshilubaRow}>
        <Text style={styles.tshilubaText}>{tshiluba}</Text>
        <TouchableOpacity style={styles.playButton} onPress={() => playAudio(audioKey ?? "")}>
          <Text style={styles.playText}>▶</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderConversation = (lines: ConversationLine[]) => (
    <>
      <Text style={styles.conversationTitle}>💬 Conversation Practice</Text>
      {lines.map((line, index) => (
        <View key={`${line.speaker}-${index}`} style={styles.phraseCard}>
          <Text style={styles.conversationSpeaker}>{line.speaker}</Text>
          <View style={styles.englishBox}>
            <Text style={styles.englishText}>{line.english}</Text>
          </View>
          <View style={styles.tshilubaRow}>
            <Text style={styles.tshilubaText}>{line.tshiluba}</Text>
            <TouchableOpacity style={styles.playButton} onPress={() => playAudio(line.audioKey ?? "")}>
              <Text style={styles.playText}>▶</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </>
  );

  const completeCurrentLesson = async () => {
    if (currentLesson === 1) {
      await onComplete("speak-1", lessonOne.length);
      setCurrentLesson(2);
      return;
    }
    if (currentLesson === 2) {
      await onComplete("speak-2", lessonTwo.length);
      setCurrentLesson(3);
      return;
    }
    await onComplete("speak-3", lessonThree.length);
    onGoToJourney();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
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
      <Text style={styles.logo}>🌱 Tshiluba Roots</Text>
      <Text style={styles.eyebrow}>SPEAK</Text>
      <Text style={styles.title}>Let’s practice speaking.</Text>
      <Text style={styles.subtitle}>Use what you’ve learned in real conversations.</Text>

      {currentLesson === 1 && (
        <>
          <View style={styles.lessonHeader}>
            <Text style={styles.lessonNumber}>LESSON 1</Text>
            <Text style={styles.lessonTitle}>Everyday Conversations 💬</Text>
          </View>
          {lessonOne.map((item, index) => renderPhraseCard(item.english, item.tshiluba, item.audioKey, index))}
          {renderConversation(conversationOne)}
          <TouchableOpacity style={styles.completeButton} onPress={completeCurrentLesson} activeOpacity={0.8}>
            <Text style={styles.completeButtonText}>Complete Lesson 1 ✓</Text>
          </TouchableOpacity>
        </>
      )}

      {currentLesson === 2 && (
        <>
          <View style={styles.lessonHeader}>
            <Text style={styles.lessonNumber}>LESSON 2</Text>
            <Text style={styles.lessonTitle}>At Home & With Family 🏠</Text>
          </View>
          {lessonTwo.map((item, index) => renderPhraseCard(item.english, item.tshiluba, item.audioKey, index))}
          {renderConversation(conversationTwo)}
          <TouchableOpacity style={styles.completeButton} onPress={completeCurrentLesson} activeOpacity={0.8}>
            <Text style={styles.completeButtonText}>Complete Lesson 2 ✓</Text>
          </TouchableOpacity>
        </>
      )}

      {currentLesson === 3 && (
        <>
          <View style={styles.lessonHeader}>
            <Text style={styles.lessonNumber}>LESSON 3</Text>
            <Text style={styles.lessonTitle}>Real-Life Conversations 🌍</Text>
          </View>
          {lessonThree.map((item, index) => renderPhraseCard(item.english, item.tshiluba, item.audioKey, index))}
          {renderConversation(conversationThree)}
          <View style={styles.finishedCard}>
            <Text style={styles.finishedEmoji}>🌱</Text>
            <Text style={styles.finishedTitle}>You did it!</Text>
            <Text style={styles.finishedText}>You’ve completed all three Speak lessons.</Text>
          </View>
          <TouchableOpacity style={styles.completeButton} onPress={completeCurrentLesson} activeOpacity={0.8}>
            <Text style={styles.completeButtonText}>Complete Speak Lesson ✓</Text>
          </TouchableOpacity>
        </>
      )}
      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF9F4" },
  content: { padding: 24, paddingTop: 55 },
  backButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center", marginBottom: 18 },
  backText: { fontSize: 28, color: "#332C28" },
  logo: { fontSize: 18, fontWeight: "800", color: "#6F8F7B", marginBottom: 28 },
  eyebrow: { fontSize: 13, fontWeight: "800", color: "#6F8F7B", letterSpacing: 1.5, marginBottom: 8 },
  title: { fontSize: 31, fontWeight: "900", color: "#332C28", marginBottom: 8 },
  subtitle: { fontSize: 16, lineHeight: 24, color: "#6F625B", marginBottom: 28 },
  lessonHeader: { backgroundColor: "#DDEFF8", borderRadius: 24, padding: 22, marginBottom: 18 },
  lessonNumber: { fontSize: 13, fontWeight: "800", color: "#6F8F7B", letterSpacing: 1, marginBottom: 7 },
  lessonTitle: { fontSize: 22, fontWeight: "900", color: "#332C28" },
  conversationTitle: { fontSize: 22, fontWeight: "900", color: "#332C28", marginTop: 10, marginBottom: 18 },
  conversationSpeaker: { fontSize: 13, fontWeight: "800", color: "#6F8F7B", letterSpacing: 1, marginBottom: 10 },
  phraseCard: { backgroundColor: "#FFFFFF", borderRadius: 22, padding: 18, marginBottom: 14 },
  englishBox: { backgroundColor: "#F7DDE5", borderRadius: 16, padding: 15, marginBottom: 12 },
  englishText: { fontSize: 17, fontWeight: "800", color: "#332C28" },
  tshilubaRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  tshilubaText: { flex: 1, fontSize: 17, fontWeight: "700", color: "#6F8F7B", lineHeight: 24, paddingRight: 12 },
  playButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#DDEEE3", justifyContent: "center", alignItems: "center" },
  playText: { fontSize: 17, color: "#6F8F7B" },
  completeButton: { backgroundColor: "#6F8F7B", borderRadius: 20, paddingVertical: 17, alignItems: "center", marginTop: 10 },
  completeButtonText: { color: "#FFFFFF", fontSize: 17, fontWeight: "900" },
  finishedCard: { backgroundColor: "#E9E1F5", borderRadius: 24, padding: 24, alignItems: "center", marginTop: 10, marginBottom: 10 },
  finishedEmoji: { fontSize: 34, marginBottom: 8 },
  finishedTitle: { fontSize: 22, fontWeight: "900", color: "#332C28", marginBottom: 6 },
  finishedText: { fontSize: 15, color: "#6F625B", textAlign: "center", lineHeight: 22 },
});
