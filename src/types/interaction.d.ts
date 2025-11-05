// src/types/interaction.d.ts
export interface Interaction {
  id: string;
  type: 'MEETING' | 'EMAIL' | 'CALL';
  content: string;
  createdAt: string;
  userName: string;
}

export interface InteractionRequest {
  type: 'MEETING' | 'EMAIL' | 'CALL';
  content: string;
  customerId: string;
}