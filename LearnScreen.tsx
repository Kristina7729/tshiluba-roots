import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";

export default function LearnScreen({
  onBack,
  onGreetings,
  onNumbers,
  onFamily,
  onTime,
  onEverydayPhrases,
  onVerbs,
  onQuiz,
}: {
  onBack: () => void;
  onGreetings: () => void;
  onNumbers: () => void;
  onFamily: () => void;
  onTime: () => void;
  onEverydayPhrases: () => void;
  onVerbs: () => void;
  onQuiz: () => void;
}) { 
     return (
         <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      <Text style={styles.logo}>🌱 Tshiluba Roots</Text>

      <Text style={styles.eyebrow}>LEARN</Text>

      <Text style={styles.title}>Build your vocabulary.</Text>

      <Text style={styles.subtitle}>
        Choose a topic and start learning words you can use in everyday life.
      </Text>

      <TouchableOpacity
  style={styles.pinkCard}
  onPress={() => {
    console.log("GREETINGS CLICKED");
    onGreetings();
  }}
> 
        <Text style={styles.emoji}>👋🏾</Text>
        <Text style={styles.cardTitle}>Greetings & Introductions</Text>
        <Text style={styles.cardText}>
          Say hello, introduce yourself and greet others.
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
  style={styles.blueCard}
  onPress={onFamily}
>
        <Text style={styles.emoji}>👨‍👩‍👧</Text>
        <Text style={styles.cardTitle}>Family</Text>
        <Text style={styles.cardText}>
          Learn words for family and the people closest to you.
        </Text>
      </TouchableOpacity>
<TouchableOpacity
  style={styles.greenCard}
  onPress={onTime}
>
        <Text style={styles.emoji}>🕐</Text>
        <Text style={styles.cardTitle}>Time</Text>
        <Text style={styles.cardText}>
          Explore expressions, traditions and words connected to home.
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
  style={styles.yellowCard}
  onPress={onNumbers}
>
        <Text style={styles.emoji}>🔢</Text>
        <Text style={styles.cardTitle}>Numbers</Text>
        <Text style={styles.cardText}>
          Learn numbers and practice counting in Tshiluba.
        </Text>
      </TouchableOpacity>

      
      <TouchableOpacity
  style={styles.lavenderCard}
  onPress={onEverydayPhrases}
>
        <Text style={styles.emoji}>💬</Text>
        <Text style={styles.cardTitle}>Everyday Phrases</Text>
        <Text style={styles.cardText}>
          Learn useful phrases for everyday conversations.
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
  style={styles.lavenderCard}
  onPress={onVerbs}
>
        <Text style={styles.emoji}>🏫</Text>
        <Text style={styles.cardTitle}>Common Verbs</Text>
        <Text style={styles.cardText}>
          Discover everyday words for food, meals and drinks.
        </Text>
      </TouchableOpacity>

      
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
    paddingTop: 70,
    paddingBottom: 50,
  },

  backButton: {
    marginBottom: 25,
  },

  backText: {
    fontSize: 52,
    color: "#71927F",
    fontWeight: "300",
  },

  logo: {
    fontSize: 28,
    fontWeight: "800",
    color: "#71927F",
    marginBottom: 55,
  },

  eyebrow: {
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 3,
    color: "#D4778A",
    marginBottom: 12,
  },

  title: {
    fontSize: 36,
    fontWeight: "800",
    color: "#332C28",
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 17,
    lineHeight: 25,
    color: "#756962",
    marginBottom: 30,
  },

  pinkCard: {
    backgroundColor: "#F7DDE5",
    borderRadius: 26,
    padding: 25,
    marginBottom: 18,
  },

  blueCard: {
    backgroundColor: "#DDEFF8",
    borderRadius: 26,
    padding: 25,
    marginBottom: 18,
  },

  yellowCard: {
    backgroundColor: "#FAEDC7",
    borderRadius: 26,
    padding: 25,
    marginBottom: 18,
  },

  peachCard: {
    backgroundColor: "#F9DFD0",
    borderRadius: 26,
    padding: 25,
    marginBottom: 18,
  },

  lavenderCard: {
    backgroundColor: "#E8E0F7",
    borderRadius: 26,
    padding: 25,
    marginBottom: 18,
  },

  greenCard: {
    backgroundColor: "#DDEFE5",
    borderRadius: 26,
    padding: 25,
    marginBottom: 18,
  },

  cultureCard: {
    backgroundColor: "#E5F0E8",
    borderRadius: 26,
    padding: 25,
    marginBottom: 18,
  },

  emoji: {
    fontSize: 34,
    marginBottom: 18,
  },

  cardTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#332C28",
    marginBottom: 8,
  },

  cardText: {
    fontSize: 16,
    lineHeight: 23,
    color: "#756962",
  },
});