// FIX: Implemented full type definitions for the application.
export enum PostStatus {
  Pendiente = 'Pendiente',
  EnRevision = 'EnRevision',
  Aprobado = 'Aprobado',
}

export interface User {
  name: string;
  avatarInitial: string;
  avatarColor: string;
}

export interface Comment {
  id: string;
  user: User;
  timestamp: string;
  text: string;
  mention?: string[];
  reaction?: { emoji: string; count: number };
  assignedTo?: string;
}

export interface Client {
  id: string;
  name: string;
  avatarUrl?: string; // Optional avatar for mockup
}

export interface ContentPost {
  id: string;
  clientId: string;
  platform: 'Instagram';
  format: 'Reel' | 'Static';
  topic: string;
  objective: string;
  date: string;
  brief: string;
  idea: string;
  imagePrompt: string; // New field for the image prompt
  copyIn: string;
  copyOut: string;
  mediaUrl: string;
  mediaType: 'video' | 'image';
  status: PostStatus;
  comments: Comment[];
}
