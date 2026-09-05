import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen({
  onBack,
  onLearn,
  onSpeak,
  onQuiz,
  onJourney,
}: {
  onBack: () => void;
  onLearn: () => void;
  onSpeak: () => void;
  onQuiz: () => void;
  onJourney: () => void;
}) {
  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
  <Text style={styles.backButtonText}>←</Text>
</TouchableOpacity>
      <Text style={styles.logo}>🌱 Tshiluba Roots</Text>

      <Text style={styles.greeting}>Welcome back! 👋🏾</Text>

      <Text style={styles.title}>What do you want to learn?</Text>

      <Text style={styles.subtitle}>
        Take your time. Every word brings you closer to home.
      </Text>

      <View style={styles.grid}>
        

        <TouchableOpacity
  style={styles.lavenderCard}
  onPress={onLearn}
>
    
          <Text style={styles.emoji}>📚</Text>
          <Text style={styles.cardTitle}>Learn</Text>
          <Text style={styles.cardText}>Build your vocabulary</Text>
        </TouchableOpacity>

        <TouchableOpacity
  style={styles.pinkCard}
  onPress={onSpeak}
>
  <Text style={styles.emoji}>📚</Text>

  <Text style={styles.cardTitle}>Speak</Text>

  <Text style={styles.cardText}>
    Practice useful phrases
  </Text>
</TouchableOpacity>

        <TouchableOpacity
  style={styles.quizCard}
  onPress={onQuiz}
>
          <Text style={styles.emoji}>🧠</Text>
          <Text style={styles.cardTitle}>Quiz</Text>
          <Text style={styles.cardText}>Test what you remember</Text>
        </TouchableOpacity>

        <TouchableOpacity
  style={styles.journeyCard}
  onPress={onJourney}
  activeOpacity={0.8}
>
  <Text style={styles.emoji}>🌱</Text>

  <Text style={styles.cardTitle}>
    My Journey
  </Text>

  <Text style={styles.cardText}>
    See your progress and celebrate how far you've come.
  </Text>
</TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
      quizCard: {
    backgroundColor: "#F8E8A8",
    borderRadius: 26,
    padding: 24,
    marginBottom: 16,
  },
    scrollView: {
  flex: 1,
},
  container: {
  backgroundColor: "#FFF9F4",
  padding: 24,
  paddingTop: 70,
  paddingBottom: 40,
},
backButton: {
  marginBottom: 20,
},

backButtonText: {
  fontSize: 48,
  color: "#6F8F7B",
  fontWeight: "500",
},
  logo: {
    fontSize: 18,
    fontWeight: "700",
    color: "#6F8F7B",
    marginBottom: 28,
  },

  greeting: {
    fontSize: 17,
    fontWeight: "600",
    color: "#8A7B73",
    marginBottom: 8,
  },

  title: {
    fontSize: 29,
    fontWeight: "800",
    color: "#332C28",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: "#756962",
    marginBottom: 24,
  },

  grid: {
  flexDirection: "column",
  gap: 16,
},

  pinkCard: {
    width: "100%",
    backgroundColor: "#F7DDE5",
    borderRadius: 22,
    padding: 20,
    marginBottom: 14,
  },

  blueCard: {
    width: "100%",
    backgroundColor: "#DDEFF8",
    borderRadius: 22,
    padding: 20,
    marginBottom: 14,
  },

  lavenderCard: {
    width: "100%",
    backgroundColor: "#E8E0F5",
    borderRadius: 22,
    padding: 20,
    marginBottom: 14,
  },

  yellowCard: {
    width: "100%",
    backgroundColor: "#F8EDC9",
    borderRadius: 22,
    padding: 20,
    marginBottom: 14,
  },
journeyCard: {
  backgroundColor: "#DDF2E5",
  borderRadius: 26,
  padding: 24,
  marginBottom: 16,
},
  emoji: {
    fontSize: 30,
    marginBottom: 12,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#332C28",
    marginBottom: 5,
  },

  cardText: {
    fontSize: 12,
    lineHeight: 17,
    color: "#756962",
  },

  storyCard: {
    backgroundColor: "#DDEBDD",
    borderRadius: 22,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },

  storyEmoji: {
    fontSize: 30,
    marginRight: 14,
  },

  storyContent: {
    flex: 1,
  },

  storyTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#332C28",
    marginBottom: 4,
  },

  storyText: {
    fontSize: 12,
    lineHeight: 17,
    color: "#756962",
  },

  arrow: {
    fontSize: 26,
    fontWeight: "600",
    color: "#6F8F7B",
    marginLeft: 8,
  },

 
  progressEmoji: {
    fontSize: 28,
    marginRight: 14,
  },

  progressContent: {
    flex: 1,
  },

  progressTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#332C28",
    marginBottom: 4,
  },

  progressText: {
    fontSize: 12,
    color: "#756962",
  },
});