import { Box } from "@mui/material"
import { useSnackbar } from "notistack";
import { useContext, useState } from "react";
import { BoardsContext } from "../../contexts/boards";
import { Navbar, NewBoardDialog, OrderBoardDialog, Sidebar } from "../ui";

import styles from './Layout.module.css';

interface Props {
  title?: string;
  children?: React.ReactNode
}

export const Layout: React.FC<Props> = ({ title = 'OpenJira', children }: Props) => {
  const { boards, addNewBoard } = useContext(BoardsContext);
  const [isNewBoardDialogOpen, setIsNewBoardDialogOpen] = useState(false);
  const [isOrderBoardDialogOpen, setIsOrderBoardDialogOpen] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const handleAddNewBoard = (name: string, color: string) => {
    setIsNewBoardDialogOpen(false);
    const boardExists = boards.find(board => board.name.toLowerCase() === name.toLowerCase());

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

    addNewBoard(name, color);
  };

  const onBoardAdd = () => {
    setIsNewBoardDialogOpen(true);
  };

  const onOrderBoards = () => {
    setIsOrderBoardDialogOpen(true);
  };

  return (
    <div className={styles.layout__container}>

      <Navbar onBoardAdd={onBoardAdd} onOrderBoards={onOrderBoards} />
      <Sidebar />

      <div className={styles['layout__content--container']}>
        {children}
      </div>

      {
        isOrderBoardDialogOpen && (
          <OrderBoardDialog
            isOpen={isOrderBoardDialogOpen}
            handleClose={() => setIsOrderBoardDialogOpen(false)}
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
    </div>
  )
}
