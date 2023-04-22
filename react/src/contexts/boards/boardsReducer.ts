import { Category, Entry } from '../../interfaces';
import { BoardsState } from '.';

type BoardsActionType =
  | { type: '[Boards] - Add-Entry', payload: Entry }
  | { type: '[Boards] - Authentication', payload: { email: string, id: string } }
  | { type: '[Boards] - Load data', payload: Category[] }
  | { type: '[Boards] - Update Boards', payload: Category[] }
  | { type: '[Boards] - Add Board', payload: Category }
  | { type: '[Boards] - Remove Board', payload: Category }
  | { type: '[Boards] - Set Loading', payload: boolean };

export const boardsReducer = (state: BoardsState, action: BoardsActionType): BoardsState => {
  switch (action.type) {
    case '[Boards] - Load data':
      return {
        ...state,
        boards: [...action.payload],
      };

    case '[Boards] - Update Boards':
      const boardsIds = action.payload.map(board => board._id);

      const updatedBoards = state.boards.map(stateBoard => {
        if (!boardsIds.includes(stateBoard._id)) {
          return stateBoard;
        } else {
          return action.payload.find(newBoard => newBoard._id === stateBoard._id)!
        }
      });

      const sortedBoards = updatedBoards.sort((a, b) => a.indexOrder - b.indexOrder);

      return {
        ...state,
        boards: sortedBoards
      }

    case '[Boards] - Add-Entry':
      const entryBoard = state.boards.find(board => board._id === action.payload.categoryId)!;
      const updatedTickets = [action.payload, ...entryBoard.tickets];

      const newBoard = {
        ...entryBoard,
        tickets: updatedTickets
      }

      return {
        ...state,
        boards: state.boards.map(board => board._id === newBoard._id ? newBoard : board),
      };

    case '[Boards] - Add Board':
      return {
        ...state,
        boards: [...state.boards, action.payload],
      };

    case '[Boards] - Remove Board':
      const filteredBoards = state.boards.filter(stateBoard => stateBoard._id !== action.payload._id);
      const refreshedSortedIndexBoards = filteredBoards
        .map((board, i) => ({
          ...board,
          indexOrder: i
        }))
        .sort((a, b) => a.indexOrder - b.indexOrder);

      return {
        ...state,
        boards: refreshedSortedIndexBoards
      };

    case '[Boards] - Authentication':
      return {
        ...state,
        userId: action.payload.id,
        userName: action.payload.email
      };

    case '[Boards] - Set Loading': {
      return {
        ...state,
        isLoading: action.payload
      }
    }
    default:
      return state;
  }
};