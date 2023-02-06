import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import { Entry } from "../../../interfaces";

interface Props {
  isOpen: boolean;
  ticket?: Entry | null;
  handleClose: () => void;
  handleDelete: (ticket: Entry) => void;
}

export const DeleteEntryDialog = ({
  isOpen = true,
  ticket,
  handleClose,
  handleDelete,
}: Props) => {

  const onDelete = () => {
    handleDelete(ticket!);
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>Delete ticket</DialogTitle>
      <DialogContent>
        {
          ticket
            ? (
              <>
                <DialogContentText>
                  Are you sure yo want to <strong style={{ color: 'red', textTransform: 'uppercase' }}>delete</strong> the following ticket?
                </DialogContentText>
                <br />
                <DialogContentText style={{ marginBottom: '0.3rem', fontWeight: 'bold' }}>
                  Ticket name:
                </DialogContentText>
                <DialogContentText style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '1rem' }}>
                  {ticket?.description}
                </DialogContentText>
              </>
            )
            : (
              <DialogContentText>
                Are you sure yo want to <strong style={{ color: 'red', textTransform: 'uppercase' }}>delete</strong> the ticket?
              </DialogContentText>
            )
        }

      </DialogContent>
      <DialogActions style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
        <Button color="primary" variant="outlined" onClick={handleClose}>Cancel</Button>
        <Button color="error" variant="outlined" onClick={onDelete}>Delete</Button>
      </DialogActions>
    </Dialog>
  )
}
