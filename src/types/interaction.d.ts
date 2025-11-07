// src/types/interaction.d.ts
export interface Interaction {
  id: string;
  type: 'MEETING' | 'EMAIL' | 'CALL';
  description: string;
  interactionDate: string;
  createdAt: string;
  userName?: string;
}

export interface InteractionRequest {
  type: 'MEETING' | 'EMAIL' | 'CALL';
  description: string; // Đổi 'content' thành 'description'
  interactionDate: string; // Thêm trường 'interactionDate'
}

export interface InteractionUpdateRequest {
  type: 'MEETING' | 'EMAIL' | 'CALL';
  description: string; // Đổi 'content' thành 'description'
  date: string; // Thêm trường 'interactionDate'
}