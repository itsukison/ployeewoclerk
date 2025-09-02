# AI Interview System

A real-time AI-powered interview system with voice recognition, transcription, and conversation memory.

## Features

### Core Functionality

- **Real-time Voice Recognition**: Uses Gemini AI to transcribe user speech
- **Conversation Memory**: Maintains full conversation history and context
- **Interview Phases**: Structured interview flow (introduction → experience → skills → motivation → closing)
- **TTS Response**: AI responses are converted to speech using Google TTS
- **Transcript Download**: Complete interview transcripts can be downloaded

### Technical Features

- **Audio Analysis**: Real-time audio level monitoring for silence detection
- **Session Management**: Robust recording session handling with cleanup
- **Error Handling**: Comprehensive error handling and user feedback
- **Responsive UI**: Clean, modern interface with real-time status indicators

## Architecture

### Component Structure

```
my-app/
├── app/
│   └── test-gemini-pipeline/
│       └── page.tsx                 # Main interview page
├── components/
│   ├── InterviewControls.tsx        # Recording start/stop controls
│   ├── InterviewStatus.tsx          # Real-time status indicators
│   ├── InterviewPhase.tsx           # Interview phase display
│   ├── InterviewResponse.tsx        # AI responses and errors
│   ├── InterviewTranscript.tsx      # Transcript display and download
│   └── InterviewInstructions.tsx    # Usage instructions
├── hooks/
│   └── useInterviewSession.ts       # Custom hook for interview logic
└── api/
    └── interview-conversation/
        └── route.ts                 # API endpoint for AI processing
```

### Key Components

#### `useInterviewSession` Hook

- Manages all interview state and logic
- Handles audio recording, analysis, and processing
- Provides conversation memory and transcript tracking
- Exports clean interface for components

#### `InterviewControls`

- Start/stop recording button
- Disabled state during processing

#### `InterviewStatus`

- Real-time speaking indicator
- Silence timer with progress bar
- Processing status display

#### `InterviewPhase`

- Shows current interview phase
- Displays conversation exchange count

#### `InterviewResponse`

- Shows AI interviewer questions
- Displays error messages

#### `InterviewTranscript`

- Shows user's transcribed speech
- Displays full conversation history
- Download transcript functionality

## API Integration

### `/api/interview-conversation`

- **Input**: Audio file, system prompt, conversation context
- **Process**:
  1. Transcribe audio using Gemini
  2. Generate AI response with full context
  3. Convert response to speech using Google TTS
- **Output**: Transcript, response text, and audio data

### Conversation Context

The API receives comprehensive context including:

- Full conversation history
- Current interview phase
- Candidate information
- Complete transcript
- Exchange count

## Memory System

The system maintains conversation memory through:

1. **Conversation History**: Array of user/assistant messages with timestamps
2. **Full Transcript**: Complete text record of the interview
3. **Interview Phase**: Current stage of the interview process
4. **Candidate Info**: Extracted information about the candidate

This ensures the AI interviewer:

- Remembers previous answers
- Avoids repeating questions
- Maintains conversation flow
- Provides contextual follow-up questions

## Configuration

### Audio Settings

- **Silence Threshold**: 0.05 (audio level for silence detection)
- **Silence Duration**: 1500ms (time to wait before sending)
- **Sample Rate**: 44100Hz
- **Analysis Interval**: 100ms

### Interview Flow

- **Introduction**: First 2 exchanges
- **Experience**: Exchanges 3-5
- **Skills**: Exchanges 6-8
- **Motivation**: Exchanges 9-11
- **Closing**: Exchange 12+

## Usage

1. Click "会話開始" to start the interview
2. Speak clearly when the AI asks questions
3. Wait 1.5 seconds of silence for automatic submission
4. Listen to AI responses
5. Continue through all interview phases
6. Download transcript when finished

## Environment Variables

Required environment variables:

- `GOOGLE_API_KEY`: Gemini API key
- `GOOGLE_APPLICATION_CREDENTIALS_JSON`: Google Cloud credentials for TTS

## Development

The codebase is structured for maintainability:

- **Separation of Concerns**: Logic in hooks, UI in components
- **Type Safety**: Full TypeScript implementation
- **Reusable Components**: Modular component architecture
- **Clean API**: Well-defined interfaces and props
