import { useContext, useState } from 'react'

import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { useSnackbar } from 'notistack';
import { AddCircleOutlineOutlined, DeleteOutline, Edit } from '@mui/icons-material';
import { IconButton } from '@mui/material'

import { BoardsContext } from '../../contexts/boards'

import { DeleteBoardDialog, EditBoardDialog, NewBoardDialog } from '../../components/ui';

import { Category } from '../../interfaces'
import styles from '../../styles/modules/Boards.module.css';

const BoardsView = () => {
  const { boards, patchBoards, addNewBoard, deleteBoard, updateBoards } = useContext(BoardsContext);
  const [isNewBoardDialogOpen, setIsNewBoardDialogOpen] = useState(false);
  const [activeDeleteBoard, setActiveDeleteBoard] = useState<Category | null>(null);
  const [activeEditBoard, setActiveEditBoard] = useState<Category | null>(null);

  const { enqueueSnackbar } = useSnackbar();

  const onDragEndHandler = (result: DropResult) => {
    const { destination, source } = result

    if (!destination || (destination.droppableId === source.droppableId
      && destination.index === source.index)) return

    const fromIndex = source.index;
    const toIndex = destination.index;

    const boardToMove = boards[fromIndex];
    const copyBoards = JSON.parse(JSON.stringify(boards)) as Category[];
    copyBoards.splice(fromIndex, 1);
    copyBoards.splice(toIndex, 0, boardToMove)

    const updatedBoards = copyBoards.map((board, i) => ({
      ...board,
      indexOrder: i
    }));

    patchBoards(updatedBoards);
  };

  const handleAddNewBoard = (name: string) => {
    setIsNewBoardDialogOpen(false);

    if (name.trim().length <= 2) {
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
    addNewBoard(name);
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

    updateBoards([board]);
  };

  const onBoardDelete = (board: Category) => {
    setActiveDeleteBoard(board);
  };

  const handleConfirmDeleteBoard = (board: Category) => {
    deleteBoard(board);
    setActiveDeleteBoard(null);
  };

  return (
    <div>

      <DragDropContext onDragEnd={onDragEndHandler}>
        <div className={styles['order-boards__context']}>

          <div className={styles['order-boards__header--container']}>
            <h2>Board List</h2>
            <IconButton onClick={() => setIsNewBoardDialogOpen(true)}>
              <AddCircleOutlineOutlined />
            </IconButton>
          </div>

          <Droppable droppableId={'reorder-boards'} >
            {
              (droppableProvided, droppableSnapshot) => (
                <div className={styles['order-boards__droppable--container']}
                  ref={droppableProvided.innerRef}
                  {...droppableProvided.droppableProps}
                >
                  {boards.map((board, index) => (
                    <Draggable draggableId={board._id} index={index} key={board._id}>
                      {
                        (draggableProvided, draggableSnapshot) => (
                          <div
                            className={styles['order-boards__draggable--container']}
                            {...draggableProvided.draggableProps}
                            {...draggableProvided.dragHandleProps}
                            ref={draggableProvided.innerRef}
                          >
                            <div className={styles['order-boards____actions--container']}>
                              <p><span style={{ fontWeight: 'bold' }}>{index + 1}</span> - {board.name}</p>

                              <div className={styles['order-boards____buttons--container']}>
                                <IconButton
                                  className={styles['entrycard__button--edit']}
                                  onClick={() => onBoardEdit(board)}
                                >
                                  <Edit fontSize="small" />
                                </IconButton>

                                <IconButton
                                  className={styles['order-boards____button--delete']}
                                  onClick={() => onBoardDelete(board)}
                                >
                                  <DeleteOutline fontSize="small" />
                                </IconButton>
                              </div>
                            </div>
                          </div>
                        )
                      }
                    </Draggable>
                  ))}
                  {droppableProvided.placeholder}
                </div>
              )}
          </Droppable>
        </div>
      </DragDropContext>

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

export default BoardsView;
