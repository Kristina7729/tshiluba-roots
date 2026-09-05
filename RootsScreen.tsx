import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";

type RootsScreenProps = {
  onBack: () => void;
  onStart: () => void;
};

export default function RootsScreen({
  onBack,
  onStart,
}: RootsScreenProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Back arrow */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        {/* Logo */}
        <Text style={styles.logo}>🌱 Tshiluba Roots</Text>

        {/* Heading */}
        <Text style={styles.title}>Our Roots</Text>

        <Text style={styles.subtitle}>
          A language. A culture. A home.
        </Text>

        {/* Intro */}
        <View style={styles.pinkCard}>
          <Text style={styles.emoji}>🌱</Text>

          <Text style={styles.cardTitle}>
            Where our journey begins
          </Text>

          <Text style={styles.cardText}>
            A language carries more than words. It carries family,
            culture, memory, and home.
          </Text>
        </View>

        {/* Where is Tshiluba from? */}
        <View style={styles.blueCard}>
          <Text style={styles.emoji}>🌍</Text>

          <Text style={styles.sectionTitle}>
            Where is Tshiluba from?
          </Text>

          <Text style={styles.cardText}>
            Tshiluba, also known as Luba-Kasai, is a Bantu language
            from the Democratic Republic of the Congo. It is especially
            associated with the Kasai region.
          </Text>
        </View>

        {/* Kasai */}
        <View style={styles.yellowCard}>
          <Text style={styles.emoji}>🗺️</Text>

          <Text style={styles.sectionTitle}>
            From the Kasai region
          </Text>

          <Text style={styles.cardText}>
            Tshiluba is part of the rich family of Bantu languages
            spoken across Central and Southern Africa.
          </Text>
        </View>

        {/* Family */}
        <View style={styles.peachCard}>
          <Text style={styles.emoji}>👨🏾‍👩🏾‍👧🏾</Text>

          <Text style={styles.sectionTitle}>
            A language of family
          </Text>

          <Text style={styles.cardText}>
            For many people in the Congolese diaspora, learning
            Tshiluba can be a way to reconnect with family, heritage,
            and stories passed down through generations.
          </Text>
        </View>

        {/* Why we're here */}
        <View style={styles.greenCard}>
          <Text style={styles.emoji}>💚</Text>

          <Text style={styles.sectionTitle}>
            Why we're here
          </Text>

          <Text style={styles.cardText}>
            Maybe you grew up hearing Tshiluba but never learned to
            speak it.
          </Text>

          <Text style={styles.cardText}>
            Maybe your parents speak it, but you don't.
          </Text>

          <Text style={styles.cardText}>
            Maybe you simply want to understand where you come from.
          </Text>

          <Text style={styles.cardText}>
            Wherever you are starting from, you're welcome here.
          </Text>
        </View>

        {/* Start journey */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={onStart}
          activeOpacity={0.8}
        >
          <Text style={styles.continueText}>
            Start My Journey →
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
    paddingTop: 55,
    paddingBottom: 50,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  backText: {
    fontSize: 28,
    color: "#332C28",
    marginTop: -2,
  },

  logo: {
    fontSize: 18,
    fontWeight: "700",
    color: "#6F8F7B",
    marginBottom: 25,
  },

  title: {
    fontSize: 36,
    fontWeight: "800",
    color: "#332C28",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#D4778A",
    marginBottom: 25,
  },

  pinkCard: {
    backgroundColor: "#F7DDE5",
    borderRadius: 26,
    padding: 24,
    marginBottom: 16,
  },

  blueCard: {
    backgroundColor: "#DDEFF8",
    borderRadius: 26,
    padding: 24,
    marginBottom: 16,
  },

  yellowCard: {
    backgroundColor: "#FFF1BF",
    borderRadius: 26,
    padding: 24,
    marginBottom: 16,
  },

  peachCard: {
    backgroundColor: "#F9DEC9",
    borderRadius: 26,
    padding: 24,
    marginBottom: 16,
  },

  greenCard: {
    backgroundColor: "#DCEBDD",
    borderRadius: 26,
    padding: 24,
    marginBottom: 22,
  },

  emoji: {
    fontSize: 32,
    marginBottom: 12,
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#332C28",
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#332C28",
    marginBottom: 10,
  },

  cardText: {
    fontSize: 15,
    lineHeight: 23,
    color: "#625952",
    marginBottom: 8,
  },

  continueButton: {
    backgroundColor: "#6F8F7B",
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: "center",
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