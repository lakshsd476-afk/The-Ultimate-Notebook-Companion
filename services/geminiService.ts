
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Note, Flashcard, Message } from "../types";

// Note: API_KEY is handled via process.env.API_KEY
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

/**
 * Helper to convert Notes into Gemini Parts
 */
function notesToParts(notes: Note[]) {
  return notes.flatMap(n => {
    const parts: any[] = [{ text: `Source Title: ${n.title}` }];
    
    if (n.metadata?.data && n.metadata?.mimeType) {
      parts.push({
        inlineData: {
          mimeType: n.metadata.mimeType,
          data: n.metadata.data
        }
      });
    } else {
      parts.push({ text: n.content });
    }
    return parts;
  });
}

/**
 * Generate Flashcards from notes
 */
export async function generateFlashcards(notes: Note[]): Promise<Flashcard[]> {
  const ai = getAI();
  const contentParts = notesToParts(notes);
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      { parts: contentParts },
      { parts: [{ text: "Based on the provided sources, generate a list of exactly 10 comprehensive flashcards (Question/Answer pairs) to help study the material. Ensure the questions cover key technical details and conceptual overviews." }] }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            answer: { type: Type.STRING }
          },
          required: ["question", "answer"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse flashcards", e);
    return [];
  }
}

/**
 * Generate an Audio Lesson (PCM Data)
 */
export async function generateAudioLesson(notes: Note[]): Promise<string | undefined> {
  const ai = getAI();
  const contextText = notes.map(n => n.content).join("\n");
  const prompt = `Act as an expert professor. Create a concise 2-minute audio summary of the provided source materials for a student to listen to. Focus on key concepts, terminology, and practical takeaways.\n\nContext:\n${contextText}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });

  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
}

/**
 * Generate a video summary using Veo
 */
export async function generateVideoSummary(prompt: string) {
  const ai = getAI();
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: `An educational documentary style visual representing: ${prompt}`,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  return `${downloadLink}&key=${process.env.API_KEY}`;
}

/**
 * Main Chat Interaction
 */
export async function* chatWithNotes(history: Message[], notes: Note[]) {
  const ai = getAI();
  const contextParts = notesToParts(notes);
  
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: `You are NexusAI, a personal research and learning assistant. Your job is to answer questions based strictly on the provided sources (text, images, or documents). If the answer isn't in the sources, say you don't know, but offer to provide general knowledge if requested. Use markdown for better readability.`,
    }
  });

  // Inject context as first message if not empty
  if (contextParts.length > 0) {
    await chat.sendMessage({ 
      message: { parts: [{ text: "Please analyze these sources for our conversation:" }, ...contextParts] } 
    });
  }

  const lastMessage = history[history.length - 1].parts[0].text;
  const streamResponse = await chat.sendMessageStream({ message: lastMessage });
  
  for await (const chunk of streamResponse) {
    yield chunk.text;
  }
}
