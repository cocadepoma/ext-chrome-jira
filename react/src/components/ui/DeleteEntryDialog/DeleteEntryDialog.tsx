import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Entry } from "../../../interfaces";
import { agreeButtonStyles, cancelButtonStyles } from "../../../styles/muiOverrides";

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
    <Dialog
      open={isOpen}
      onClose={handleClose}
      PaperProps={{
        sx: {
          backgroundColor: 'var(--gray-body)',
          width: '360px',
          maxWidth: '360px',
          padding: '1rem',
          boxShadow: 'var(--shadow-2)'
        }
      }}
    >
      <DialogTitle sx={{ fontSize: '0.9rem', color: 'white', padding: 0 }}>Delete ticket</DialogTitle>
      <DialogContent sx={{ color: 'white', padding: 0, paddingTop: '20px!important' }}>
        {
          ticket
            ? (
              <>
                <DialogContentText
                  sx={{
                    paddingTop: '18px',
                    color: 'rgb(255 255 255 / 80%)',
                    fontSize: '0.7rem',
                  }}
                >
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
              <DialogContentText
                sx={{
                  color: 'rgb(255 255 255 / 80%)',
                  fontSize: '0.7rem',
                }}
              >
                Are you sure yo want to <strong style={{ color: 'red', textTransform: 'uppercase' }}>delete</strong> the ticket?
              </DialogContentText>
            )
        }

      </DialogContent>
      <DialogActions style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.3rem', padding: 0 }}>
        <Button sx={{ ...agreeButtonStyles, marginRight: '0rem', }} color="info" variant="outlined" onClick={handleClose}>Cancel</Button>
        <Button sx={cancelButtonStyles} color="error" variant="outlined" onClick={onDelete}>Delete</Button>
      </DialogActions>
    </Dialog>
  )
}
