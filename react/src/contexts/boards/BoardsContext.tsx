import { createContext } from 'react';
import { Category, Entry } from '../../interfaces';
import { Board } from '../../interfaces/user';

export interface ContextProps {
  boards: Category[];
  isLoading: boolean;

  loadBoards: (boards: Board[]) => void;
  addNewEntry: (description: string, boardId: string) => Promise<void>;
  updateEntry: (entry: Entry, showSnack?: boolean) => Promise<void>;
  deleteEntry: (entry: Entry) => Promise<void>;
  deleteBoard: (board: Category) => Promise<void>;
  addNewBoard: (name: string, color: string) => Promise<void>;
  updateBoards: (boards: Category[]) => Promise<void>;
  patchBoards: (boards: Category[]) => Promise<void>;
}

export const BoardsContext = createContext({} as ContextProps);