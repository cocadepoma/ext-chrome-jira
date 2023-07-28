export interface UserResponse {
  id: string;
  email: string;
  token: string;
  boards: Board[];
}

export interface Board {
  _id: string;
  name: string;
  createdAt: number;
  indexOrder: number;
  color: string;
  tickets: Ticket[];
}

export interface Ticket {
  _id: string;
  description: string;
  createdAt: number;
  categoryId: string;
  content: string;
  color: string;
}