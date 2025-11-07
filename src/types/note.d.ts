// "Bản thiết kế" cho một Ghi chú (Note)
export interface Note {
  id: string;
  content: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotesResponse {
  total: number;
  data: Note[];
}