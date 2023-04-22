import { FC, useEffect, useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { BoardsContext, boardsReducer } from '.';
import { Category, Entry } from '../../interfaces';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { UserResponse } from '../../interfaces/user';
import { sleep } from '../../utils';

export interface BoardsState {
  boards: Category[];
  userName: null | string;
  userId: null | string;
  isLoading: boolean;
}

interface BoardsProviderProps {
  children: React.ReactNode
}

const Boards_INITIAL_STATE: BoardsState = {
  boards: [],
  userName: null,
  userId: null,
  isLoading: true,
};

axios.defaults.baseURL = import.meta.env.VITE_BASE_API;

export const BoardsProvider: FC<BoardsProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(boardsReducer, Boards_INITIAL_STATE);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    getUserCredentials();
  }, []);

  const getUserCredentials = async () => {
    try {
      chrome.identity.getProfileUserInfo(async function (userInfo) {
        if (userInfo.email && userInfo.id) {
          dispatch({ type: '[Boards] - Authentication', payload: userInfo });
          await loadBoards(userInfo);
        }
      });
    } catch (error) {
      console.warn(error);
      dispatch({ type: '[Boards] - Set Loading', payload: false });
    }

    // For local tests
    // loadBoards({ email: 'myemail@gmail.com', id: '123' });
    // dispatch({ type: '[Boards] - Authentication', payload: { email: 'myemail@gmail.com', id: '123' } });
  };

  const loadBoards = async ({ email, id }: { email: string, id: string }) => {
    try {
      const { categories = [] as Category[] } = await chrome.storage.sync.get(null);
      const resp = await axios.post<UserResponse>('/api/users', { email, id });

      if (categories.length > 0) {
        await axios.post<UserResponse>(`/api/users/${resp.data.uid}`, { boards: categories });
        chrome.storage.sync.clear();

        dispatch({ type: '[Boards] - Load data', payload: categories });
      } else {
        dispatch({ type: '[Boards] - Load data', payload: categories });
      }

      await sleep(150);
      dispatch({ type: '[Boards] - Set Loading', payload: false });
    } catch (error) {
      console.log(error, 'An error ocurred while getting the Boards');
    }
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

      dispatch({ type: '[Boards] - Load data', payload: newBoards });

      await axios.post<UserResponse>(`/api/users/${state.userName}-${state.userId}`, { boards: newBoards });
    } catch (error) {
      console.log(error, 'An error ocurred while adding a new entriy');
    }
  };

  const updateEntry = async (ticket: Entry, showSnack = false) => {
    try {
      const copyBoard = structuredClone(state.boards.find(board => board._id === ticket.categoryId)) as Category;
      copyBoard.tickets = copyBoard.tickets.map(tk => tk._id === ticket._id ? ticket : tk);

      const newBoards = state.boards.map(board => board._id === copyBoard._id ? copyBoard : board);

      dispatch({ type: '[Boards] - Load data', payload: newBoards });

      await axios.post<UserResponse>(`/api/users/${state.userName}-${state.userId}`, { boards: newBoards });

      if (showSnack) {
        enqueueSnackbar('Ticket updated succesfully', {
          variant: 'success',
          autoHideDuration: 2000,
          anchorOrigin: {
            horizontal: 'right',
            vertical: 'bottom'
          }
        })
      }
    } catch (error) {
      console.log({ error });
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
      dispatch({ type: '[Boards] - Load data', payload: updatedBoards });

      await axios.post<UserResponse>(`/api/users/${state.userName}-${state.userId}`, { boards: updatedBoards });

      enqueueSnackbar(`Board added succesfully`, {
        variant: 'success',
        autoHideDuration: 2000,
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'bottom'
        }
      })
    } catch (error) {
      console.log({ error });
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

      dispatch({ type: '[Boards] - Load data', payload: updatedBoards });

      await axios.post<UserResponse>(`/api/users/${state.userName}-${state.userId}`, { boards: updatedBoards });
    } catch (error) {
      console.log({ error });
    }
  };

  const patchBoards = async (boards: Category[]) => {
    try {
      dispatch({ type: '[Boards] - Load data', payload: boards });

      await axios.post<UserResponse>(`/api/users/${state.userName}-${state.userId}`, { boards: boards });
    } catch (error) {
      console.log({ error });
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

      dispatch({ type: '[Boards] - Load data', payload: refreshedSortedIndexBoards });

      await axios.post<UserResponse>(`/api/users/${state.userName}-${state.userId}`, { boards: refreshedSortedIndexBoards });
      enqueueSnackbar('Board removed succesfully', {
        variant: 'success',
        autoHideDuration: 2000,
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'bottom'
        }
      });
    } catch (error) {
      console.log({ error });
    }
  };

  const deleteEntry = async ({ _id, categoryId }: Entry) => {
    try {
      const copyBoard = structuredClone(state.boards.find(board => board._id === categoryId)) as Category;
      const updatedTickets = copyBoard.tickets.filter(ticket => ticket._id !== _id);
      copyBoard.tickets = updatedTickets;

      const newBoards = state.boards.map(board => board._id === copyBoard._id ? copyBoard : board);
      dispatch({ type: '[Boards] - Load data', payload: newBoards });

      await axios.post<UserResponse>(`/api/users/${state.userName}-${state.userId}`, { boards: newBoards });

      enqueueSnackbar('Ticket removed succesfully', {
        variant: 'success',
        autoHideDuration: 2000,
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'bottom'
        }
      });
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <BoardsContext.Provider
      value={{
        ...state,
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