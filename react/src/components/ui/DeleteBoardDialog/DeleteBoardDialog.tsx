import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Category } from "../../../interfaces";
import { agreeButtonStyles, cancelButtonStyles } from "../../../styles/muiOverrides";

interface Props {
  isOpen: boolean;
  board: Category | null;
  handleClose: () => void;
  handleDelete: (board: Category) => void;
}

export const DeleteBoardDialog = ({
  isOpen = true,
  board,
  handleClose,
  handleDelete,
}: Props) => {

  const onDelete = () => {
    handleDelete(board!);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: '28rem',
          minHeight: '13rem',
          color: 'rgb(255 255 255 / 90%)',
          backgroundColor: 'rgb(59 58 65 / 96%)',
          boxShadow: 'var(--shadow-2)',
          '& h2': {
            backgroundColor: 'rgb(0 0 0 / 20%)',
            fontSize: '1rem',
          },
        },
      }}
    >
      <DialogTitle>Delete board</DialogTitle>
      <DialogContent sx={{
        paddingTop: '24px',
        backgroundColor: 'rgb(59 58 65 / 96%)',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '5rem',
        height: '5rem',
        overflow: 'hidden'
      }}>
        <DialogContentText
          sx={{
            paddingTop: '18px',
            color: 'rgb(255 255 255 / 80%)',
            fontSize: '0.7rem',
          }}
        >
          Are you sure yo want to <strong style={{ color: 'red', textTransform: 'uppercase' }}>delete</strong> the board named <strong style={{ color: 'green' }}>{board?.name}</strong>?
        </DialogContentText>
        <DialogContentText
          sx={{
            paddingTop: '18px',
            color: 'rgb(255 255 255 / 80%)',
            fontSize: '0.7rem',
            marginBottom: '0.3rem',
            fontWeight: 'bold',
            textAlign: 'center'
          }}
        >
          You will lose all the containing tickets on this board!
        </DialogContentText>
      </DialogContent>
      <DialogActions style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem' }}>
        <Button sx={cancelButtonStyles} variant="outlined" onClick={handleClose}>Cancel</Button>
        <Button sx={{ ...agreeButtonStyles, marginRight: 0 }} variant="outlined" onClick={onDelete}>Delete</Button>
      </DialogActions>
    </Dialog>
  )
}
