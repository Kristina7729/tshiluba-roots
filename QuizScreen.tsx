import React, { useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";

type Question = {
  question: string;
  answers: string[];
  correct: string;
};

type QuizScreenProps = {
  onBack: () => void;
  onComplete: (score: number) => void;
};

/*
  TSHILUBA ROOTS
  15 questions per quiz.
  The quiz set changes automatically based on the day.
*/

const quizSets: Question[][] = [
  // =========================
  // DAY SET 1
  // =========================
  [
    {
      question: 'How do you say "Welcome!"?',
      answers: [
        "Dilue dinpe!",
        "Betuabu",
        "Moyo!",
        "Udi bimpe?",
      ],
      correct: "Dilue dinpe!",
    },
    {
      question: 'How do you say "Hi!"?',
      answers: [
        "Moyo!",
        "Dilue dinpe!",
        "Butuku Bulenga",
        "Uye bimpe",
      ],
      correct: "Moyo!",
    },
    {
      question: 'How do you say "Good Morning"?',
      answers: [
        "Betuabu",
        "Dilolo dilenga",
        "Dituku dilenga",
        "Ndi bimpe",
      ],
      correct: "Betuabu",
    },
    {
      question: 'How do you say "Good Afternoon"?',
      answers: [
        "Dilolo dilenga",
        "Betuabu",
        "Butuku Bulenga",
        "Ushala bilenge",
      ],
      correct: "Dilolo dilenga",
    },
    {
      question: 'How do you say "Good Evening"?',
      answers: [
        "Butuku Bulenga",
        "Betuabu",
        "Malu bimpe",
        "Uye bimpe",
      ],
      correct: "Butuku Bulenga",
    },
    {
      question: 'How do you say "Good Night"?',
      answers: [
        "Lalayi bimpe",
        "Ndi mutshoke",
        "Udi bishi?",
        "Kwenu penyi?",
      ],
      correct: "Lalayi bimpe",
    },
    {
      question: 'How do you say "See you"?',
      answers: [
        "Uye bimpe",
        "Udi bimpe?",
        "Waya bimpe",
        "Dina dieba ngani?",
      ],
      correct: "Uye bimpe",
    },
    {
      question: 'How do you say "What is your name?"?',
      answers: [
        "Dina dieba ngani?",
        "Kwenu penyi?",
        "Udi bishi?",
        "Kadi wewa?",
      ],
      correct: "Dina dieba ngani?",
    },
    {
      question: 'How do you say "Where are you from?"?',
      answers: [
        "Kwenu penyi?",
        "Dina dieba ngani?",
        "Udi ni mvula bungi munyi?",
        "Malu kayi?",
      ],
      correct: "Kwenu penyi?",
    },
    {
      question: 'How do you say "Nice to meet you"?',
      answers: [
        "Ndi ne disanka bua kumanyangana",
        "Ndi bimpe",
        "Malu bimpe",
        "Uye bimpe",
      ],
      correct: "Ndi ne disanka bua kumanyangana",
    },
    {
      question: 'How do you say "How are you?"?',
      answers: [
        "Udi bishi?",
        "Malu kayi?",
        "Kwenu penyi?",
        "Udi ni mvula bungi munyi?",
      ],
      correct: "Udi bishi?",
    },
    {
      question: 'How do you say "I am okay"?',
      answers: [
        "Ndi bimpe",
        "Ndi bilenga",
        "Ndi sama",
        "Ndi mutshoke",
      ],
      correct: "Ndi bimpe",
    },
    {
      question: 'How do you say "I am tired"?',
      answers: [
        "Ndi mutshoke",
        "Ndi ne nzala",
        "Ndi sama",
        "Ndi bilenga",
      ],
      correct: "Ndi mutshoke",
    },
    {
      question: 'How do you say "I am hungry"?',
      answers: [
        "Ndi ne nzala",
        "Ndi mutshoke",
        "Ndi sama",
        "Ndi bimpe",
      ],
      correct: "Ndi ne nzala",
    },
    {
      question: 'How do you say "I am sick"?',
      answers: [
        "Ndi sama",
        "Ndi bilenga",
        "Ndi bimpe",
        "Ndi ne nzala",
      ],
      correct: "Ndi sama",
    },
  ],

  // =========================
  // DAY SET 2
  // =========================
  [
    {
      question: 'How do you say "See you tomorrow"?',
      answers: [
        "Nitumonagana makelela",
        "Uye bimpe",
        "Betuabu",
        "Ushala bilenge",
      ],
      correct: "Nitumonagana makelela",
    },
    {
      question: 'How do you say "Have a nice day"?',
      answers: [
        "Dituku dilenga",
        "Luendu lulenga",
        "Dilue dinpe!",
        "Malu bimpe",
      ],
      correct: "Dituku dilenga",
    },
    {
      question: 'How do you say "Have a nice trip"?',
      answers: [
        "Luendu lulenga",
        "Dituku dilenga",
        "Udi bimpe?",
        "Ndi ne nzala",
      ],
      correct: "Luendu lulenga",
    },
    {
      question: 'How do you say "Goodbye"?',
      answers: [
        "Uya bimpe",
        "Udi bishi?",
        "Moyo!",
        "Betuabu",
      ],
      correct: "Uya bimpe",
    },
    {
      question: 'How do you say "And you?"?',
      answers: [
        "..kadi wewa?",
        "Kwenu penyi?",
        "Dina dieba ngani?",
        "Malu kayi?",
      ],
      correct: "..kadi wewa?",
    },
    {
      question: 'How do you say "My name is ____"?',
      answers: [
        "Dina diani ____",
        "Ndi wa ku ____",
        "Dina dieba ngani?",
        "Kadi wewa?",
      ],
      correct: "Dina diani ____",
    },
    {
      question: 'How do you say "I am from ____, and you?"?',
      answers: [
        "Ndi wa ku ____, kadi wewa?",
        "Kwenu penyi?",
        "Dina diani ____",
        "Ndi ne disanka bua kumanyangana",
      ],
      correct: "Ndi wa ku ____, kadi wewa?",
    },
    {
      question: 'How do you say "How old are you?"?',
      answers: [
        "Udi ni mvula bungi munyi?",
        "Udi bishi?",
        "Malu kayi?",
        "Kwenu penyi?",
      ],
      correct: "Udi ni mvula bungi munyi?",
    },
    {
      question: 'How do you say "I am ____ years old"?',
      answers: [
        "Ndi ni mvula ____",
        "Ndi wa ku ____",
        "Dina diani ____",
        "Ndi bimpe",
      ],
      correct: "Ndi ni mvula ____",
    },
    {
      question: 'How do you say "How are things?"?',
      answers: [
        "Malu kayi?",
        "Udi bishi?",
        "Udi bimpe?",
        "Ndi bilenga",
      ],
      correct: "Malu kayi?",
    },
    {
      question: 'How do you say "You good?"?',
      answers: [
        "Udi bimpe?",
        "Malu kayi?",
        "Udi bishi?",
        "Ndi bimpe",
      ],
      correct: "Udi bimpe?",
    },
    {
      question: 'How do you say "We are okay"?',
      answers: [
        "Tudi bimpe",
        "Ndi bimpe",
        "Malu bimpe",
        "Ndi biakana",
      ],
      correct: "Tudi bimpe",
    },
    {
      question: 'How do you say "Things are good"?',
      answers: [
        "Malu bimpe",
        "Tudi bimpe",
        "Ndi bilenga",
        "Ndi bimpe",
      ],
      correct: "Malu bimpe",
    },
    {
      question: 'How do you say "I am great"?',
      answers: [
        "Ndi bilenga",
        "Ndi bimpe",
        "Ndi sama",
        "Ndi mutshoke",
      ],
      correct: "Ndi bilenga",
    },
    {
      question: 'How do you say "I could be better"?',
      answers: [
        "Ndi buakuikala bilenga",
        "Tshena bilenga to",
        "Ndi bilenga",
        "Malu bimpe",
      ],
      correct: "Ndi buakuikala bilenga",
    },
  ],

  // =========================
  // DAY SET 3
  // =========================
  [
    {
      question: 'Which phrase means "I did not sleep well"?',
      answers: [
        "Tshena mulala bimpe to",
        "Ndi mulala bimpe",
        "Udi mulala bimpe?",
        "Ndi mutshoke",
      ],
      correct: "Tshena mulala bimpe to",
    },
    {
      question: 'Which phrase means "Did you sleep well?"?',
      answers: [
        "Udi mulala bimpe?",
        "Ndi mulala bimpe",
        "Tshena mulala bimpe to",
        "Udi bimpe?",
      ],
      correct: "Udi mulala bimpe?",
    },
    {
      question: 'Which phrase means "I slept well"?',
      answers: [
        "Ndi mulala bimpe",
        "Tshena mulala bimpe to",
        "Udi mulala bimpe?",
        "Ndi bimpe",
      ],
      correct: "Ndi mulala bimpe",
    },
    {
      question: 'Which phrase means "I am a bit sick"?',
      answers: [
        "Ndi sama kakesa",
        "Ndi sama",
        "Ndi mutshoke",
        "Ndi ne nzala",
      ],
      correct: "Ndi sama kakesa",
    },
    {
      question: 'Which phrase means "I am not good"?',
      answers: [
        "Tshena bilenga to",
        "Ndi bilenga",
        "Ndi bimpe",
        "Malu bimpe",
      ],
      correct: "Tshena bilenga to",
    },
    {
      question: 'Which phrase means "I am great"?',
      answers: [
        "Ndi bilenga",
        "Ndi sama",
        "Ndi mutshoke",
        "Ndi ne nzala",
      ],
      correct: "Ndi bilenga",
    },
    {
      question: 'Which phrase means "I am hungry"?',
      answers: [
        "Ndi ne nzala",
        "Ndi sama",
        "Ndi mutshoke",
        "Ndi bimpe",
      ],
      correct: "Ndi ne nzala",
    },
    {
      question: 'Which phrase means "I am tired"?',
      answers: [
        "Ndi mutshoke",
        "Ndi ne nzala",
        "Ndi sama kakesa",
        "Ndi bilenga",
      ],
      correct: "Ndi mutshoke",
    },
    {
      question: 'Which phrase means "I am okay"?',
      answers: [
        "Ndi bimpe",
        "Tshena bilenga to",
        "Ndi sama",
        "Ndi ne nzala",
      ],
      correct: "Ndi bimpe",
    },
    {
      question: 'Which phrase means "Things are good"?',
      answers: [
        "Malu bimpe",
        "Tudi bimpe",
        "Ndi bilenga",
        "Udi bimpe?",
      ],
      correct: "Malu bimpe",
    },
    {
      question: 'Which phrase means "We are okay"?',
      answers: [
        "Tudi bimpe",
        "Ndi bimpe",
        "Malu kayi?",
        "Ndi biakana",
      ],
      correct: "Tudi bimpe",
    },
    {
      question: 'Which phrase means "How are things?"?',
      answers: [
        "Malu kayi?",
        "Udi bishi?",
        "Udi bimpe?",
        "Ndi bilenga",
      ],
      correct: "Malu kayi?",
    },
    {
      question: 'Which phrase means "How are you?"?',
      answers: [
        "Udi bishi?",
        "Malu kayi?",
        "Kwenu penyi?",
        "Dina dieba ngani?",
      ],
      correct: "Udi bishi?",
    },
    {
      question: 'Which phrase means "Nice to meet you"?',
      answers: [
        "Ndi ne disanka bua kumanyangana",
        "Uye bimpe",
        "Ndi bimpe",
        "Malu bimpe",
      ],
      correct: "Ndi ne disanka bua kumanyangana",
    },
    {
      question: 'Which phrase means "Where are you from?"?',
      answers: [
        "Kwenu penyi?",
        "Dina dieba ngani?",
        "Udi bishi?",
        "Kadi wewa?",
      ],
      correct: "Kwenu penyi?",
    },
  ],
];

export default function QuizScreen({
  onBack,
  onComplete,
}: QuizScreenProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);

  /*
    Automatically changes the quiz based on the current day.
    Day 1 = Set 1
    Day 2 = Set 2
    Day 3 = Set 3
    Day 4 = Set 1 again
    etc.

    So the user gets a different 15-question quiz
    on different days.
  */
  const today = new Date();

  const dayNumber = Math.floor(
    Date.UTC(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    ) /
      (1000 * 60 * 60 * 24)
  );

  const quiz = useMemo(() => {
    return quizSets[dayNumber % quizSets.length];
  }, [dayNumber]);

  const question = quiz[currentQuestion];

  const handleAnswer = (answer: string) => {
    if (selectedAnswer !== null) {
      return;
    }

    setSelectedAnswer(answer);

    if (answer === question.correct) {
      setScore((previousScore) => previousScore + 1);
    }
  };

  const handleNext = () => {
    if (selectedAnswer === null) {
      return;
    }

    const isCorrect = selectedAnswer === question.correct;

    /*
      We need to include the current answer because
      React state updates happen asynchronously.
    */
    const finalScore = isCorrect ? score + 1 : score;

    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion((previous) => previous + 1);
      setSelectedAnswer(null);
    } else {
      const percentage = Math.round(
        (finalScore / quiz.length) * 100
      );

      setFinished(true);

      // Send the number of correct answers back to App.tsx
      onComplete(score);
    }
  };

  if (finished) {
    const percentage = Math.round(
      (score / quiz.length) * 100
    );

    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.resultsContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.logo}>🌱 Tshiluba Roots</Text>

          <Text style={styles.resultsEmoji}>🎉</Text>

          <Text style={styles.resultsTitle}>
            Quiz complete!
          </Text>

          <Text style={styles.resultsScore}>
            {score}/{quiz.length}
          </Text>

          <Text style={styles.resultsText}>
            You got {score} out of {quiz.length} questions correct.
          </Text>

          {percentage >= 80 ? (
            <Text style={styles.resultsMessage}>
              Amazing work! You are getting closer to home. 💚
            </Text>
          ) : percentage >= 60 ? (
            <Text style={styles.resultsMessage}>
              Good job! Keep practicing and you'll get stronger. 🌱
            </Text>
          ) : (
            <Text style={styles.resultsMessage}>
              Keep going! Every word you learn brings you closer to home. 💕
            </Text>
          )}

          <TouchableOpacity
            style={styles.homeButton}
            onPress={onBack}
            activeOpacity={0.8}
          >
            <Text style={styles.homeButtonText}>
              Back to Learning
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.logo}>
          🌱 Tshiluba Roots
        </Text>

        <Text style={styles.eyebrow}>
          DAILY QUIZ
        </Text>

        <Text style={styles.title}>
          Test what you remember.
        </Text>

        <Text style={styles.subtitle}>
          15 questions. Choose an answer and see if you got it right.
        </Text>

        {/* Progress */}
        <View style={styles.progressRow}>
          <Text style={styles.progressText}>
            Question {currentQuestion + 1} of {quiz.length}
          </Text>

          <Text style={styles.scoreText}>
            Score: {score}
          </Text>
        </View>

        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${
                  ((currentQuestion + 1) / quiz.length) * 100
                }%`,
              },
            ]}
          />
        </View>

        {/* Question */}
        <View style={styles.questionCard}>
          <Text style={styles.questionNumber}>
            QUESTION {currentQuestion + 1}
          </Text>

          <Text style={styles.question}>
            {question.question}
          </Text>
        </View>

        {/* Answers */}
        <Text style={styles.chooseText}>
          Choose your answer
        </Text>

        {question.answers.map((answer) => {
          const isSelected = selectedAnswer === answer;
          const isCorrect = answer === question.correct;

          let answerStyle = styles.answerButton;
          let answerTextStyle = styles.answerText;

          if (selectedAnswer !== null && isCorrect) {
            answerStyle = styles.correctAnswer;
            answerTextStyle = styles.correctAnswerText;
          } else if (
            selectedAnswer !== null &&
            isSelected &&
            !isCorrect
          ) {
            answerStyle = styles.wrongAnswer;
            answerTextStyle = styles.wrongAnswerText;
          }

          return (
            <TouchableOpacity
              key={answer}
              style={answerStyle}
              onPress={() => handleAnswer(answer)}
              activeOpacity={0.8}
              disabled={selectedAnswer !== null}
            >
              <View style={styles.answerCircle}>
                <Text style={styles.answerCircleText}>
                  {question.answers.indexOf(answer) + 1}
                </Text>
              </View>

              <Text style={answerTextStyle}>
                {answer}
              </Text>

              {selectedAnswer !== null && isCorrect && (
                <Text style={styles.checkMark}>✓</Text>
              )}

              {selectedAnswer !== null &&
                isSelected &&
                !isCorrect && (
                  <Text style={styles.xMark}>✕</Text>
                )}
            </TouchableOpacity>
          );
        })}

        {/* Feedback */}
        {selectedAnswer !== null && (
          <View
            style={
              selectedAnswer === question.correct
                ? styles.feedbackCorrect
                : styles.feedbackWrong
            }
          >
            <Text style={styles.feedbackTitle}>
              {selectedAnswer === question.correct
                ? "✓ Correct!"
                : "✕ Not quite!"}
            </Text>

            <Text style={styles.feedbackText}>
              {selectedAnswer === question.correct
                ? "You got it! 🌱"
                : `The correct answer is: ${question.correct}`}
            </Text>
          </View>
        )}

        {/* Next */}
        {selectedAnswer !== null && (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>
              {currentQuestion === quiz.length - 1
                ? "Finish Quiz"
                : "Next Question →"}
            </Text>
          </TouchableOpacity>
        )}
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

  resultsContainer: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 70,
    paddingBottom: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  backButton: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  backText: {
    fontSize: 26,
    color: "#332C28",
  },

  logo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6F8F7B",
    marginBottom: 25,
  },

  eyebrow: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#D4778A",
    letterSpacing: 1.5,
    marginBottom: 8,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#332C28",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 23,
    color: "#6F625B",
    marginBottom: 25,
  },

  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  progressText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#6F625B",
  },

  scoreText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#6F8F7B",
  },

  progressBackground: {
    height: 9,
    backgroundColor: "#E8DED7",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 25,
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#6F8F7B",
    borderRadius: 10,
  },

  questionCard: {
    backgroundColor: "#E8DFF5",
    borderRadius: 26,
    padding: 25,
    marginBottom: 22,
  },

  questionNumber: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#806A9B",
    letterSpacing: 1.2,
    marginBottom: 12,
  },

  question: {
    fontSize: 23,
    lineHeight: 31,
    fontWeight: "bold",
    color: "#332C28",
  },

  chooseText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#332C28",
    marginBottom: 12,
  },

  answerButton: {
    minHeight: 65,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    marginBottom: 12,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEE4DE",
  },

  correctAnswer: {
    minHeight: 65,
    backgroundColor: "#DDEFE4",
    borderRadius: 18,
    marginBottom: 12,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#6F8F7B",
  },

  wrongAnswer: {
    minHeight: 65,
    backgroundColor: "#F7DDE5",
    borderRadius: 18,
    marginBottom: 12,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#D4778A",
  },

  answerCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F1EAE5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  answerCircleText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#6F625B",
  },

  answerText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 21,
    color: "#332C28",
    fontWeight: "bold",
  },

  correctAnswerText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 21,
    color: "#456B55",
    fontWeight: "bold",
  },

  wrongAnswerText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 21,
    color: "#A64D64",
    fontWeight: "bold",
  },

  checkMark: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4D8B64",
  },

  xMark: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#C45D76",
  },

  feedbackCorrect: {
    backgroundColor: "#DDEFE4",
    borderRadius: 20,
    padding: 18,
    marginTop: 5,
    marginBottom: 18,
  },

  feedbackWrong: {
    backgroundColor: "#F7DDE5",
    borderRadius: 20,
    padding: 18,
    marginTop: 5,
    marginBottom: 18,
  },

  feedbackTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#332C28",
    marginBottom: 5,
  },

  feedbackText: {
    fontSize: 14,
    lineHeight: 21,
    color: "#5F514B",
  },

  nextButton: {
    backgroundColor: "#6F8F7B",
    borderRadius: 18,
    paddingVertical: 17,
    alignItems: "center",
    marginTop: 3,
  },

  nextButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },

  resultsEmoji: {
    fontSize: 55,
    marginBottom: 15,
  },

  resultsTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#332C28",
    textAlign: "center",
    marginBottom: 10,
  },

  resultsScore: {
    fontSize: 58,
    fontWeight: "bold",
    color: "#D4778A",
    marginBottom: 10,
  },

  resultsText: {
    fontSize: 16,
    color: "#6F625B",
    textAlign: "center",
    marginBottom: 15,
  },

  resultsMessage: {
    fontSize: 16,
    lineHeight: 24,
    color: "#6F625B",
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 15,
  },

  homeButton: {
    width: "100%",
    backgroundColor: "#6F8F7B",
    borderRadius: 18,
    paddingVertical: 17,
    alignItems: "center",
  },

  homeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});