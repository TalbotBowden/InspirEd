# InspirEd Mobile App

## Overview

InspirEd is a React Native mobile application built with Expo that helps parents of children with chronic pulmonary conditions better understand and manage medical visits. The app allows parents to record doctor visits, receive AI-generated summaries in plain language, ask questions about their child's care, and access curated educational content—all grounded in trusted medical sources managed by administrators.

**Core Purpose:** Empower parents through accessible medical information, reducing the cognitive burden during stressful healthcare interactions.

**Tagline:** "Learn to Empower. Empower to Hope."

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework:** React Native with Expo SDK 54
- Uses the new React Native architecture (`newArchEnabled: true`)
- React 19.1.0 with experimental React Compiler enabled
- Cross-platform support: iOS, Android, and Web

**Navigation Structure:**
- Stack-based navigation using React Navigation 7
- Tab-based main interface with 5 sections:
  - Home (dashboard with recent activity)
  - History (visit recordings and summaries)
  - Planner (next visit question preparation)
  - Education (learning modules and educational chat)
  - Profile (user settings and admin features)
- Modal presentation for recording new visits
- Onboarding flow for new users with automatic reading level detection

**State Management:**
- Context API (`AppContext`) for global state
- AsyncStorage for local data persistence
- No external state management library (Redux, MobX, etc.)

**UI/UX Design Principles:**
- Medical-grade accessibility with high contrast and 16pt minimum font size
- Color palette: Primary Teal (#4DB6AC), Accent Green (#A4D65E)
- Light mode only for medical clarity
- Animated interactions using Reanimated 4
- Blur effects and translucent tab bars (iOS)
- Safe area handling for modern device layouts

**Key Technical Decisions:**
- **Module Resolution:** Custom Babel alias (`@/`) for clean imports
- **Keyboard Handling:** `react-native-keyboard-controller` for better input UX
- **Animations:** Reanimated with worklets for 60fps performance
- **Type Safety:** TypeScript with strict mode enabled

### Authentication & Authorization

**User Roles:**
- **Parent (Default):** Full access to recording, summaries, questions, and education
- **Admin:** Additional access to manage trusted PDF sources that ground AI responses

**Authentication Strategy:**
- Currently designed for local-first usage (no authentication required for parents)
- Admin features require login (implementation pending)
- Profile system with customizable avatars and display names

### AI & Knowledge Management

**Core Principle:** All AI-generated content must be grounded in administrator-vetted PDF sources to prevent medical misinformation.

**AI Features:**
1. **Visit Summarization:**
   - Processes recorded audio transcripts
   - Generates summaries adapted to user's reading level (6th-12th grade SMOG index)
   - Extracts key points, diagnoses, action items, and medical term explanations

2. **Contextual Q&A:**
   - Visit-specific chat for clarifying questions
   - Responses cite PDF sources when available
   - Explicitly states when information is not found in trusted sources

3. **Education Chat:**
   - General medical questions answered from PDF knowledge base
   - Encourages consultation with doctors for specific medical advice

4. **Reading Level Adaptation:**
   - Automatic detection during onboarding using SMOG index calculation
   - Text analysis utilities for syllable counting and complexity measurement
   - User-selectable reading level in profile settings

**PDF Source Management (Admin):**
- Upload trusted medical PDFs (research papers, guidelines, educational materials)
- Processing status tracking (processing → ready)
- Vector database storage for semantic search (backend integration pending)
- Citation tracking for transparency

### Data Storage

**Local Storage (AsyncStorage):**
- User profile (name, avatar, preferences)
- Visit recordings and metadata
- AI-generated summaries and chat history
- Planner questions
- Learning module progress
- Reading level preference
- Onboarding completion status

**Data Models:**
- `Visit`: Recording metadata, transcript, summary, AI-extracted insights
- `Message`: Chat messages with timestamp and user/AI distinction
- `Question`: Planner questions with checked status
- `PDFSource`: Uploaded documents with processing status
- `LearningModule`: Educational content with progress tracking

**Backend Integration (Planned):**
- Vector database for PDF content storage and semantic search
- Audio transcription service
- OpenAI API integration for text generation
- User authentication service for admin features

### Recording & Audio Processing

**Recording Features:**
- Record, pause, and stop functionality
- Timer display with formatted duration
- Doctor name metadata capture
- Quality settings (High/Medium) for storage management

**Audio Workflow:**
1. User records visit audio
2. Audio saved locally with metadata
3. Transcription service processes audio (backend)
4. AI generates summary adapted to reading level
5. Summary stored and displayed with citations

**Current Implementation:**
- Mock transcription and summarization (placeholder for backend)
- Local audio URI storage
- Processing state indicators

### Educational Content System

**Learning Modules:**
- Categorized by topic (e.g., pulmonary care, medication management)
- Difficulty levels: Beginner, Intermediate, Advanced
- Progress tracking with completion states
- Topic tagging for discoverability

**Education Chat:**
- Separate from visit-specific Q&A
- Broader medical education questions
- Grounded in trusted PDF sources
- Encourages professional medical consultation

### Error Handling & Reliability

**Error Boundary Implementation:**
- Class-based error boundary wrapping entire app
- Custom error fallback UI with stack trace display (dev mode)
- App restart functionality via `expo.reloadAppAsync()`
- Graceful degradation for production

**Platform-Specific Fallbacks:**
- `KeyboardAwareScrollView` falls back to standard `ScrollView` on web
- Conditional rendering for iOS-specific blur effects
- Platform-specific styling for tab bars and headers

## External Dependencies

### Core Frameworks
- **Expo SDK 54:** Development platform and native modules
- **React Native 0.81.5:** Core framework
- **React Navigation 7:** Navigation and routing
- **React 19.1.0:** UI library with compiler optimizations

### UI & Animation
- **Reanimated 4:** Performant animations with worklets
- **Gesture Handler 2.28:** Touch interactions
- **Expo Blur:** Translucent UI effects (iOS)
- **Expo Haptics:** Tactile feedback
- **Expo Image:** Optimized image component

### Data & Storage
- **AsyncStorage 2.2.0:** Local key-value persistence
- No database (currently local-first architecture)
- Vector database integration planned for PDF content

### Development Tools
- **TypeScript 5.9.2:** Type safety
- **ESLint 9 + Prettier:** Code quality and formatting
- **Babel Module Resolver:** Path aliasing

### Planned Integrations
- **OpenAI API:** Text summarization and Q&A generation (mock implementation exists)
- **Audio Transcription Service:** Convert recordings to text
- **Vector Database:** Semantic search over PDF content (Pinecone, Weaviate, or similar)
- **Authentication Provider:** Admin user management
- **Cloud Storage:** Backup for recordings and user data

### Platform-Specific
- **iOS:** Bundle identifier `com.inspired.app`, edge-to-edge UI
- **Android:** Adaptive icons, edge-to-edge enabled, predictive back disabled
- **Web:** Single-page output, favicon support