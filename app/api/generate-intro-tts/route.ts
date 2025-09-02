import { NextRequest, NextResponse } from 'next/server';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';

// Configure runtime for Vercel
export const runtime = 'nodejs';

// Initialize TTS client with proper credentials handling and error checking
let ttsClient: TextToSpeechClient | null = null;

try {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    // Use JSON credentials for deployment (Vercel, etc.)
    const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
    
    // Validate credentials have required fields
    if (credentials.project_id && credentials.client_email && credentials.private_key) {
      ttsClient = new TextToSpeechClient({ credentials });
      console.log('Google TTS client initialized successfully');
    } else {
      console.error('Invalid Google credentials - missing required fields');
    }
  } else {
    // Use file path for local development
    ttsClient = new TextToSpeechClient();
    console.log('Google TTS client initialized with default credentials');
  }
} catch (error) {
  console.error('Failed to initialize Google TTS client:', error);
  ttsClient = null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Check if TTS client is available
    if (!ttsClient) {
      console.log('Google TTS not available, returning fallback response');
      return NextResponse.json({ 
        error: "TTS service temporarily unavailable",
        fallback: true,
        text: text
      }, { status: 503 });
    }

    // Generate TTS audio using the same settings as interview conversation
    const ttsRequest = {
      input: { text },
      voice: { 
        languageCode: 'ja-JP',
        name: 'ja-JP-Neural2-C', // Professional male voice (same as interview)
        ssmlGender: 'MALE' as const
      },
      audioConfig: { 
        audioEncoding: 'MP3' as const,
        speakingRate: 1.0,
        pitch: 0.0
      },
    };

    const [ttsResponse] = await ttsClient.synthesizeSpeech(ttsRequest);
    
    // Return audio data
    return NextResponse.json({
      audio: Buffer.from(ttsResponse.audioContent!).toString('base64'),
      mimeType: 'audio/mp3',
    });

  } catch (error) {
    console.error("Error in generate-intro-tts route:", error);
    
    // Return fallback response instead of error
    return NextResponse.json({ 
      error: "TTS service temporarily unavailable",
      fallback: true,
      text: request.body ? (await request.json()).text : "面接を開始します"
    }, { status: 503 });
  }
}
