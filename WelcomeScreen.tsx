import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";

type WelcomeScreenProps = {
  onContinue: () => void;
};

export default function WelcomeScreen({
  onContinue,
}: WelcomeScreenProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <Text style={styles.logo}>🌱 Tshiluba Roots</Text>

        {/* Main heading */}
        <Text style={styles.title}>Learn the language.</Text>

        <Text style={styles.subtitle}>Reconnect with home.</Text>

        {/* Welcome card */}
        <View style={styles.welcomeCard}>
          <Text style={styles.emoji}>👋🏾</Text>

          <Text style={styles.cardTitle}>Welcome!</Text>

          <Text style={styles.cardText}>
            Your Tshiluba journey starts here.
          </Text>
        </View>

        {/* Story */}
        <View style={styles.storyCard}>
          <Text style={styles.storyEmoji}>🌍</Text>

          <Text style={styles.storyTitle}>A language. A culture. A home.</Text>

          <Text style={styles.storyText}>
            A language carries more than words. It carries family, culture,
            memory, and home.
          </Text>

          <Text style={styles.storyText}>
            Tshiluba, also known as Luba-Kasai, is a Bantu language from the
            Democratic Republic of the Congo, especially associated with the
            Kasai region.
          </Text>

          <Text style={styles.storyText}>
            For many people in the Congolese diaspora, learning Tshiluba can
            be a way to reconnect with family, heritage, and stories passed
            down through generations.
          </Text>
        </View>

        {/* Continue button */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={onContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.continueText}>
            Discover My Roots →
          </Text>
        </TouchableOpacity>

        <Text style={styles.bottomText}>
          Every word brings you closer to home. 🌱
        </Text>
      </ScrollView>
    </View>
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

  logo: {
    fontSize: 18,
    fontWeight: "700",
    color: "#6F8F7B",
    marginBottom: 28,
  },

  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#332C28",
    lineHeight: 40,
  },

  subtitle: {
    fontSize: 29,
    fontWeight: "700",
    color: "#D4778A",
    marginBottom: 30,
    lineHeight: 36,
  },

  welcomeCard: {
    backgroundColor: "#F7DDE5",
    borderRadius: 26,
    padding: 25,
    marginBottom: 18,
  },

  emoji: {
    fontSize: 34,
    marginBottom: 10,
  },

  cardTitle: {
    fontSize: 23,
    fontWeight: "800",
    color: "#332C28",
    marginBottom: 7,
  },

  cardText: {
    fontSize: 15,
    lineHeight: 23,
    color: "#6F625B",
  },

  storyCard: {
    backgroundColor: "#DDEFF8",
    borderRadius: 26,
    padding: 25,
    marginBottom: 20,
  },

  storyEmoji: {
    fontSize: 32,
    marginBottom: 12,
  },

  storyTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#332C28",
    marginBottom: 14,
    lineHeight: 28,
  },

  storyText: {
    fontSize: 15,
    lineHeight: 23,
    color: "#5F625F",
    marginBottom: 14,
  },

  continueButton: {
    backgroundColor: "#6F8F7B",
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 4,
  },

  continueText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },

  bottomText: {
    textAlign: "center",
    color: "#8B817A",
    fontSize: 13,
    marginTop: 18,
  },
});