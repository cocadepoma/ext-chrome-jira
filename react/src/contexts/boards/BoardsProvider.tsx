import { useSnackbar } from 'notistack';
import { FC, useContext, useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { BoardsContext, boardsReducer } from '.';
import { AuthContext } from '../auth';


import { Category, Entry } from '../../interfaces';
import { Board, UserResponse } from '../../interfaces/user';

import kanbanifyApi from '../../api/kanbanify';

export interface BoardsState {
  boards: Category[];
  isLoading: boolean;
}

interface BoardsProviderProps {
  children: React.ReactNode
}

const Boards_INITIAL_STATE: BoardsState = {
  boards: [],
  isLoading: false,
};

export const BoardsProvider: FC<BoardsProviderProps> = ({ children }) => {
  const { userId } = useContext(AuthContext);

  const [state, dispatch] = useReducer(boardsReducer, Boards_INITIAL_STATE);
  const { enqueueSnackbar } = useSnackbar();

  const loadBoards = async (boards: Board[]) => {
    dispatch({ type: '[Boards] - Load data', payload: boards });
  };

  const addNewEntry = async (description: string, boardId: string) => {
    try {
      const newEntry: Entry = {
        _id: uuidv4(),
        description,
        categoryId: boardId,
        color: '',
        content: '',
        createdAt: Date.now(),
      };

      const copyBoard = structuredClone(state.boards.find(board => board._id === boardId)) as Category;
      copyBoard.tickets = [newEntry, ...copyBoard.tickets];

      const newBoards = state.boards.map(board => board._id === copyBoard._id ? copyBoard : board);

      await patchBoards(newBoards);
    } catch (error) {
      console.warn(error, 'An error ocurred while adding a new entriy');
    }
  };

  const updateEntry = async (ticket: Entry, showSnack = false) => {
    try {
      const copyBoard = structuredClone(state.boards.find(board => board._id === ticket.categoryId)) as Category;
      copyBoard.tickets = copyBoard.tickets.map(tk => tk._id === ticket._id ? ticket : tk);

      const newBoards = state.boards.map(board => board._id === copyBoard._id ? copyBoard : board);

      await patchBoards(newBoards);

      if (showSnack) {
        enqueueSnackbar('Ticket updated succesfully', {
          variant: 'success',
          autoHideDuration: 2000,
          anchorOrigin: {
            horizontal: 'right',
            vertical: 'bottom'
          }
        });
      }
    } catch (error) {
      console.warn({ error });
    }
  };

  const addNewBoard = async (name: string, color: string) => {
    try {
      const newBoard: Category = {
        _id: uuidv4(),
        name,
        tickets: [],
        createdAt: Date.now(),
        indexOrder: !state.boards.length ? 0 : state.boards.length,
        color,
      };

      const updatedBoards = [...state.boards, newBoard];

      await patchBoards(updatedBoards);

      enqueueSnackbar(`Board added succesfully`, {
        variant: 'success',
        autoHideDuration: 2000,
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'bottom'
        }
      })
    } catch (error) {
      console.warn({ error });
    }
  };

  const updateBoards = async ([board1, board2]: Category[]) => {
    try {
      const updatedBoards = state.boards.map(board => {
        if (board._id === board1._id) {
          return board1
        }
        if (board._id === board2?._id) {
          return board2;
        }
        return board;
      })

      await patchBoards(updatedBoards);
    } catch (error) {
      console.warn({ error });
    }
  };

  const deleteBoard = async ({ _id }: Category) => {
    try {
      const filteredBoards = state.boards.filter(stateBoard => stateBoard._id !== _id);
      const refreshedSortedIndexBoards = filteredBoards
        .map((board, i) => ({
          ...board,
          indexOrder: i
        }))
        .sort((a, b) => a.indexOrder - b.indexOrder);

      await patchBoards(refreshedSortedIndexBoards);

      enqueueSnackbar('Board removed succesfully', {
        variant: 'success',
        autoHideDuration: 2000,
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'bottom'
        }
      });
    } catch (error) {
      console.warn({ error });
    }
  };

  const deleteEntry = async ({ _id, categoryId }: Entry) => {
    try {
      const copyBoard = structuredClone(state.boards.find(board => board._id === categoryId)) as Category;
      const updatedTickets = copyBoard.tickets.filter(ticket => ticket._id !== _id);
      copyBoard.tickets = updatedTickets;

      const newBoards = state.boards.map(board => board._id === copyBoard._id ? copyBoard : board);

      await patchBoards(newBoards);

      enqueueSnackbar('Ticket removed succesfully', {
        variant: 'success',
        autoHideDuration: 2000,
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'bottom'
        }
      });
    } catch (error) {
      console.warn({ error });
    }
  };

  const patchBoards = async (boards: Category[]) => {
    try {
      dispatch({ type: '[Boards] - Load data', payload: boards });

      await kanbanifyApi.patch<UserResponse>(`/api/users/${userId}`, { boards: boards });
    } catch (error) {
      console.warn({ error });
    }
  };

  return (
    <BoardsContext.Provider
      value={{
        ...state,
        loadBoards,
        addNewEntry,
        updateEntry,
        deleteEntry,
        deleteBoard,
        addNewBoard,
        updateBoards,
        patchBoards,
      }}
    >
      {children}
    </BoardsContext.Provider>
  );
};