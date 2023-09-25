import { useSnackbar } from 'notistack';
import { useContext, useState } from 'react';

import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';

import { CardHeader, DeleteBoardDialog, DeleteEntryDialog, EditBoardDialog, EditEntryDialog, EmptyBoard, EntryList, NewBoardDialog } from '../components/ui';
import { AddEntryDialog } from '../components/ui/AddEntryDialog/AddEntryDialog';

import { BoardsContext } from '../contexts/boards';

import { Category, Entry } from '../interfaces';

import styles from '../styles/modules/Home.module.css';

const Home = () => {
  const { enqueueSnackbar } = useSnackbar();

  const { boards, updateEntry, updateBoards, deleteEntry, addNewBoard, deleteBoard } = useContext(BoardsContext);
  const { addNewEntry } = useContext(BoardsContext);

  const [activeBoard, setActiveBoard] = useState<Category | null>(null);
  const [activeDeleteTicket, setActiveDeleteTicket] = useState<Entry | null>(null);
  const [activeEditTicket, setActiveEditTicket] = useState<Entry | null>(null);
  const [isNewBoardDialogOpen, setIsNewBoardDialogOpen] = useState(false);
  const [activeDeleteBoard, setActiveDeleteBoard] = useState<Category | null>(null);
  const [activeEditBoard, setActiveEditBoard] = useState<Category | null>(null);


  const onDragEndHandler = (result: DropResult) => {
    const { destination, source } = result

    if (!destination || (destination.droppableId === source.droppableId
      && destination.index === source.index)) return

    const boardSource = boards.find(entry => entry._id === source.droppableId);
    const boardDestination = boards.find(entry => entry._id === destination.droppableId);

    const newEntry = {
      ...boardSource!.tickets[source.index],
      categoryId: destination.droppableId
    };

    updateEntry(newEntry);

    if (destination.droppableId === source.droppableId) {
      const copyBoardSource = JSON.parse(JSON.stringify(boardSource)) as Category;
      copyBoardSource.tickets.splice(source.index, 1);
      copyBoardSource.tickets.splice(destination.index, 0, newEntry);

      updateBoards([copyBoardSource]);
    } else {
      const copyBoardSource = JSON.parse(JSON.stringify(boardSource)) as Category;
      copyBoardSource.tickets.splice(source.index, 1);

      const copyBoardDestination = JSON.parse(JSON.stringify(boardDestination)) as Category;
      copyBoardDestination.tickets.splice(destination.index, 0, newEntry);

      updateBoards([copyBoardSource, copyBoardDestination]);
    }
  };

  const onStartAddNewEntry = (board: Category) => {
    setActiveBoard(board);
  };

  const onCloseAddNewTicker = () => {
    setActiveBoard(null);
  };

  const onStartDeleteTicket = (entry: Entry) => {
    setActiveDeleteTicket(entry);
  };

  const onCloseDeleteTicket = () => {
    setActiveDeleteTicket(null);
  };

  const onStartEditTicket = (entry: Entry) => {
    setActiveEditTicket(entry);
  };

  const onCloseEditTicket = () => {
    setActiveEditTicket(null);
  };

  const handleConfirmEditTicket = (newTicket: Entry) => {
    const entryBoard = boards.find(board => board._id === newTicket.categoryId)!;
    const updatedTickets = entryBoard.tickets.map(ticket => ticket._id === newTicket._id ? newTicket : ticket);

    const updatedBoard: Category = {
      ...entryBoard,
      tickets: updatedTickets
    };

    updateEntry(newTicket, true);
    updateBoards([updatedBoard]);

    onCloseEditTicket();
  };

  const handleConfirmAddNewTicket = (value: string, boardId: string) => {
    addNewEntry(value, boardId);
    onCloseAddNewTicker();
  };

  const handleConfirmDeleteTicket = (entry: Entry) => {
    const entryBoard = boards.find(board => board._id === entry.categoryId)!;
    const updatedTickets = entryBoard.tickets.filter(ticket => ticket._id !== entry._id);

    const updatedBoard: Category = {
      ...entryBoard,
      tickets: updatedTickets
    };

    deleteEntry(entry);
    updateBoards([updatedBoard]);

    onCloseDeleteTicket();
  };

  const handleAddNewBoard = (name: string, color: string) => {
    setIsNewBoardDialogOpen(false);
    const cleanedName = name.trim();
    const boardExists = boards.find(board => board.name.toLowerCase() === cleanedName.toLowerCase());

    if (cleanedName.length <= 2) {
      enqueueSnackbar(`The board name should have at least 3 characters`, {
        variant: 'error',
        autoHideDuration: 2000,
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'bottom'
        }
      })
      return;
    }

    if (boardExists) {
      enqueueSnackbar(`The board name name already exists`, {
        variant: 'error',
        autoHideDuration: 2000,
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'bottom'
        }
      })
      return;
    }

    addNewBoard(cleanedName, color);
  };

  const onBoardEdit = (board: Category) => {
    setActiveEditBoard(board);
  };

  const handleConfirmEditBoard = (board: Category) => {
    setActiveEditBoard(null);

    if (board.name.trim().length <= 2) {
      enqueueSnackbar(`The board name should have at least 3 characters`, {
        variant: 'error',
        autoHideDuration: 2000,
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'bottom'
        }
      })
      return;
    }

    updateBoards([{ ...board, name: board.name.trim() }]);
  };

  const onBoardDelete = (board: Category) => {
    setActiveDeleteBoard(board);
  };

  const onBoardAdd = () => {
    setIsNewBoardDialogOpen(true);
  };

  const handleConfirmDeleteBoard = (board: Category) => {
    deleteBoard(board);
    setActiveDeleteBoard(null);
  };

  return (
    <div style={{ height: '545px', animation: 'fadeIn 0.3s' }}>
      {
        boards.length === 0

          ? <EmptyBoard onBoardAdd={onBoardAdd} />

          : (
            <div className={styles['home__context']} style={{ paddingRight: boards.length > 3 ? boards.length * 249 : 0 }}>
              <DragDropContext onDragEnd={onDragEndHandler}>
                {boards.map((board, i) => (
                  <div className={styles['home__board']} key={board._id}>

                    <CardHeader
                      className={styles['home__header--container']}
                      board={board}
                      onClick={onStartAddNewEntry}
                      onRemoveBoard={onBoardDelete}
                      onEditBoard={onBoardEdit}
                    />

                    <Droppable droppableId={board._id}>
                      {
                        (droppableProvided, droppableSnapshot) => (
                          <div className={styles['home__list--container']}
                            ref={droppableProvided.innerRef}
                            {...droppableProvided.droppableProps}
                          >
                            <EntryList
                              tickets={board.tickets}
                              setActiveDeleteTicket={onStartDeleteTicket}
                              setActiveEditTicket={onStartEditTicket}
                            />
                            {droppableProvided.placeholder}
                          </div>
                        )}
                    </Droppable>
                  </div>
                ))}
              </DragDropContext>
            </div>
          )
      }

      {
        activeBoard && (
          <AddEntryDialog
            isOpen={!!activeBoard}
            handleClose={onCloseAddNewTicker}
            handleConfirm={handleConfirmAddNewTicket}
            board={activeBoard}
          />
        )
      }

      {
        activeDeleteTicket && (
          <DeleteEntryDialog
            isOpen={!!activeDeleteTicket}
            handleClose={onCloseDeleteTicket}
            handleDelete={handleConfirmDeleteTicket}
            ticket={activeDeleteTicket}
          />
        )
      }

      {
        activeEditTicket && (
          <EditEntryDialog
            isOpen={!!activeEditTicket}
            handleClose={onCloseEditTicket}
            handleConfirm={handleConfirmEditTicket}
            ticket={activeEditTicket}
          />
        )
      }

      {
        isNewBoardDialogOpen && (
          <NewBoardDialog
            isOpen={isNewBoardDialogOpen}
            handleClose={() => setIsNewBoardDialogOpen(false)}
            handleConfirm={handleAddNewBoard}
          />
        )
      }

      {
        activeDeleteBoard && (
          <DeleteBoardDialog
            isOpen={!!activeDeleteBoard}
            handleClose={() => setActiveDeleteBoard(null)}
            handleDelete={handleConfirmDeleteBoard}
            board={activeDeleteBoard}
          />
        )
      }

      {
        activeEditBoard && (
          <EditBoardDialog
            isOpen={!!activeEditBoard}
            handleClose={() => setActiveEditBoard(null)}
            handleConfirm={handleConfirmEditBoard}
            board={activeEditBoard}
          />
        )
      }
    </div>
  )
}

export default Home;
