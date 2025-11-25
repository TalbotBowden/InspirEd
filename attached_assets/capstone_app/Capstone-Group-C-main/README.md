<div align="center">

# InspirEd

![splash-icon](https://github.com/user-attachments/assets/bb659fdb-f834-4799-b01b-1796b76a9b1c)

</div>

**InspirEd** is an educational app designed to help caregivers and parents improve their health literacy, better understand their child’s medical care, and feel more confident in making care decisions.

## Features  

- **AI Scribe Tool:** Transcribes and summarizes medical appointments locally for privacy and accuracy.  
- **On-Device Natural Language Processing:** Extracts key medical terms, diagnoses, tests, treatments, and patient concerns from conversations.  
- **Prebuilt Medical Content with Metadata:** Provides physician-vetted written and video materials tagged by relationships and reading levels.  
- **AI-Powered Content Matching:** Connects scribe-derived medical terms with relevant educational content in the database.  
- **Custom Educational Platform:** Delivers dynamic, personalized learning materials tailored to caregiver and patient needs.  
- **Interactive Chatbot:** Answers questions, generates adaptive responses, and recommends supplementary resources like videos.  
- **Continuous Model Refinement:** Learns from user queries to improve accuracy and personalization over time.

## 🛠️ Technologies Used

- **React Native:** An open-source UI software framework developed by Meta Platforms (formerly Facebook Inc.) for building native mobile applications using JavaScript and React.
- **Expo:** An open-source framework and platform that simplifies and enhances the development of React Native applications.

## 📦 Build Instructions

To set up InspirEd for development,
1. Clone the repository
2. Inside the directory, install dependencies: npm install
3. If it's your first time developing for mobile,
   - **iOS (Mac only):** Follow [Expo’s iOS setup guide](https://docs.expo.dev/get-started/set-up-your-environment/?platform=ios&device=simulated&mode=development-build)  
   - **Android:** Follow [Expo’s Android setup guide](https://docs.expo.dev/get-started/set-up-your-environment/?platform=android&device=simulated&mode=development-build)
     
   ⚡ **Note:** You don’t need to use `eas build` to get started. Just follow the guide up to the development build step, then run:  
   ```bash
   npx expo run:ios     # for iOS  
   npx expo run:android # for Android
4. The previous step should automatically open the app in your emulator. If not, start the development server with: npx expo start
5. Run the app:  
   - Press i to launch the iOS simulator  
   - Press a to launch the Android emulator  
   - Or scan the QR code with the Expo Go app on your device
  
⏱️ **Note:** The first `npx expo run:ios` or `npx expo run:android` build may take **10–20 minutes** to complete which is crazy ngl. After this initial setup, you only need to rerun it if you change native code. For day-to-day development, you can skip this step and just use **steps 4–5**, which will start much faster.

⏱️ **Note:** If you are on Windows, you may get a "Filename longer than 260 characters" error when first setting up the app. If you do, follow this [fix](https://kirillzyusko.github.io/react-native-keyboard-controller/docs/troubleshooting) at the very bottom of the page.

🧠 Firestore Vector Database + Gemini Integration
---

InspirEd now uses **Google Firestore Vector Search** together with **Gemini** for embedding, storing, and querying educational medical content.  
This replaces the old local Chroma setup — everything now runs securely and centrally inside Firebase.

### ⚙️ How It Works

1. **Gemini (via Firebase Extension)** automatically creates *embeddings* (numeric text representations) for uploaded content such as educational PDFs.
2. These embeddings are stored in a Firestore collection called **`educational`**.
3. When a user or chatbot asks a question (e.g., *“What is pulmonary surfactant?”*), Gemini embeds that query and compares it to all stored vectors.
4. The most relevant chunks are retrieved, and Gemini summarizes them into clear, educational explanations.

This setup:
- ✅ Keeps data private and within your Firebase project  
- ✅ Allows team-wide and user-wide access (no local DB setup needed)  
- ✅ Scales easily — embeddings are created automatically by the Firestore Vector Search extension  

---

### 🧩 Collections in Firestore

| Collection Name | Purpose | Type |
|-----------------|----------|------|
| **`educational`** | Stores vetted educational PDFs (split into text chunks) | Vector-enabled |
| **`user_summaries_vector`** | Stores anonymized appointment summaries for chatbot context | Vector-enabled |
| **`users`** | Holds user info, appointments, and plaintext summaries | Standard Firestore collection |

---

### ⚡ How to Upload Educational PDFs (One-Time Setup)

To upload PDFs to Firestore for embedding:

```bash
py -3.12 src/firestore_embed_upload.py


## Contributors

We are proud of the talented team behind InspirEd:

- **Hunter Mena**,
- **Ethan Le**,
- **Jason Nguyen**,
- **Talbot Bowden**,
- **Hoc Nguyen**,
