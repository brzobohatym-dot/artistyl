

export enum MessageRole {
  USER = 'user',
  MODEL = 'model',
}

export interface Message {
  role: MessageRole;
  content: string;
  sourceUrls?: { uri: string; title?: string }[];
}