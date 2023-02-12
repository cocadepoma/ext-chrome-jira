import { AddCircleOutlineOutlined } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from "@mui/material"
import { ChangeEvent, useContext, useState } from "react";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { BoardsContext } from "../../../contexts/boards";
import { Category } from "../../../interfaces";

import styles from './OrderBoardDialog.module.css';

interface Props {
  isOpen: boolean;
  handleClose: () => void;
}

export const OrderBoardDialog = ({
  isOpen,
  handleClose,
}: Props) => {
  const { boards, patchBoards } = useContext(BoardsContext);

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

  return (
    <Dialog open={isOpen} onClose={handleClose} PaperProps={{ sx: { width: '400px', maxWidth: '400px' } }}>
      <DialogContent sx={{ padding: '10px' }}>
        <DragDropContext onDragEnd={onDragEndHandler}>
          <div className={styles['order-boards__context']}>

            <div className={styles['order-boards__header--container']}>
              <h2>Board List</h2>
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
      </DialogContent>

      <DialogActions style={{ display: 'flex', padding: '0 1.1rem 1.1rem 1.1rem' }}>
        <Button color="info" variant="outlined" onClick={handleClose}>Close</Button>
      </DialogActions>

    </Dialog>
  )
}
