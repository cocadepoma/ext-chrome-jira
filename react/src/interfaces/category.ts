import { Entry } from "./entry";

export interface Category {
  _id: string;
  name: string;
  tickets: Entry[] | [];
  createdAt: number;
  indexOrder: number;
}