export interface Entry {
  _id: string;
  description: string;
  createdAt: number;
  categoryId: string;
  content?: string;
  color?: string;
}

export interface EntryResponse {
  entry: Entry;
}

export interface Entries {
  _id: string;
  name: string;
  tickets: Entry[];
}
// export type EntryStatus = 'pending' | 'in-progress' | 'finished';