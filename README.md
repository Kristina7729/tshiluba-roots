# 🌱 Tshiluba Roots

Tshiluba Roots is a mobile language-learning application designed to help learners reconnect with Tshiluba through practical vocabulary, everyday phrases, conversations, pronunciation practice, and progress tracking.

The application combines a React Native/Expo mobile interface with an AWS serverless backend to provide persistent learning progress.

---

## ✨ Features

- 📚 Structured Tshiluba lessons
- 👋 Greetings & introductions
- 👨‍👩‍👧 Family vocabulary
- 🔢 Numbers
- 🕐 Time expressions
- 💬 Everyday phrases
- 🗣️ Conversation practice
- 🔤 Common verbs
- 🎧 Audio pronunciation for vocabulary and phrases
- 🌱 Learning journey and lesson completion tracking
- 📊 Words learned tracking
- 🏆 Quiz progress tracking
- 💾 Persistent progress across app sessions
- ☁️ Cloud-based progress storage with AWS
- 📱 Built for a mobile-first learning experience

---

## 🛠️ Technology Stack

### Frontend

- React Native
- Expo
- TypeScript
- AsyncStorage

### Backend / Cloud

- AWS API Gateway
- AWS Lambda
- Amazon DynamoDB
- AWS SDK for JavaScript

### Development

- Visual Studio Code
- Git
- GitHub
- Expo CLI
- EAS

---

## ☁️ Cloud Architecture

Tshiluba Roots uses a serverless AWS architecture for storing user learning progress.

```text
┌─────────────────────────┐
│   React Native / Expo   │
│       Mobile App        │
└────────────┬────────────┘
             │
             │ HTTPS
             ▼
┌─────────────────────────┐
│      API Gateway        │
│   Progress API Route    │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│      AWS Lambda         │
│  tshiluba-roots-api     │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│       DynamoDB          │
│   TshilubaProgress      │
└─────────────────────────┘
