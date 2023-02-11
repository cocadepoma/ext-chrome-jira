import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import { Category } from "../../../interfaces";

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
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>Delete board</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure yo want to <strong style={{ color: 'red', textTransform: 'uppercase' }}>delete</strong> the board named <strong style={{ color: 'green' }}>{board?.name}</strong>?
        </DialogContentText>
        <br />
        <DialogContentText style={{ marginBottom: '0.3rem', fontWeight: 'bold', textAlign: 'center' }}>
          You will lose all the containing tickets on this board!
        </DialogContentText>
      </DialogContent>
      <DialogActions style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', padding: '1rem' }}>
        <Button color="info" variant="outlined" onClick={handleClose}>Cancel</Button>
        <Button color="error" variant="outlined" onClick={onDelete}>Delete</Button>
      </DialogActions>
    </Dialog>
  )
}
