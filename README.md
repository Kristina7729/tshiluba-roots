# 🌱 Tshiluba Roots

Tshiluba Roots is a mobile language-learning application designed to help learners reconnect with Tshiluba through practical vocabulary, everyday phrases, conversations, pronunciation practice, and progress tracking.

The application combines a React Native/Expo mobile interface with a serverless AWS backend to provide persistent learning progress.

---

## 🎥 App Demo

[[▶️ Watch the Tshiluba Roots Demo](https://youtube.com/shorts/56U8gYvN34c?is=18Lt1bPCxSDmEJ1A))]

A walkthrough of the application showcasing interactive lessons, audio pronunciation, everyday phrases, conversation practice, and learning progress tracking.

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
- 🎧 Audio pronunciation
- 🌱 Learning journey and lesson completion tracking
- 📊 Words learned tracking
- 🏆 Quiz progress tracking
- 💾 Persistent learning progress
- ☁️ AWS cloud backend

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

Tshiluba Roots uses a serverless AWS architecture to store learning progress.

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
```
---

## 🖼️ Screenshots

### 🏠 Home

<img width="645" height="1398" alt="Home" src="https://github.com/user-attachments/assets/30d7200a-770c-4ac2-8153-2291ef23362a" />


### 🌱 Roots

<img width="645" height="1398" alt="Roots" src="https://github.com/user-attachments/assets/e702c946-6b7f-4149-ae79-7f3686fc68a8" />


### 📚 Lessons

<img width="645" height="1398" alt="Lesson" src="https://github.com/user-attachments/assets/a4336dea-df57-4ddb-861c-54f1c74e2a5b" />

### 💬 Everyday Phrases

<img width="645" height="1398" alt="Everyday Phrases" src="https://github.com/user-attachments/assets/d7b10daf-b30c-433b-b261-f184ed1ae7c1" />

### 🧠 Interactive quiz

<img width="645" height="1398" alt="Quiz" src="https://github.com/user-attachments/assets/7e125ddf-7063-4285-a72d-561ea8aea2e3" />

### 🌱 Journey & Progress

<img width="645" height="1398" alt="Journey" src="https://github.com/user-attachments/assets/1aa86ef6-39fc-457a-8ba7-342440ed80d9" />


## 👩🏾‍💻 Developer

Built by Kristina Ekofo as a full-stack mobile application project combining mobile development, cloud infrastructure, API integration, data persistence, and language-learning design.
