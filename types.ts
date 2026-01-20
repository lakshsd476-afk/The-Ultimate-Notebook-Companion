
export interface Note {
  id: string;
  title: string;
  content: string; // Used for text representation or extracted text
  type: 'text' | 'pdf' | 'url' | 'image' | 'file';
  createdAt: number;
  metadata?: {
    mimeType?: string;
    data?: string; // Base64 for files/images
    url?: string;
  };
}

export interface Flashcard {
  question: string;
  answer: string;
}

export enum AppTab {
  CHAT = 'Chat',
  FLASHCARDS = 'Flashcards',
  AUDIO = 'Audio Guide',
  VIDEO = 'Video Summary',
  SOURCES = 'Sources'
}

export interface Message {
  role: 'user' | 'model';
  parts: { 
    text?: string;
    inlineData?: {
      mimeType: string;
      data: string;
    }
  }[];
}
