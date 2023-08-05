import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { ChangeEvent, useState } from "react";

import { agreeButtonStyles, boardsTextField, cancelButtonStyles } from "../../../styles/muiOverrides";
import styles from './AddEntryDialog.module.css';

interface Props {
  isOpen: boolean;
  board: any | null;
  handleClose: () => void;
  handleConfirm: (value: string, boardId: string) => void;
}

export const AddEntryDialog = ({
  isOpen,
  board,
  handleClose,
  handleConfirm,
}: Props) => {
  const [inputValue, setInputValue] = useState('');
  const [isTouched, setIsTouched] = useState(false);

  const onTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const onSave = () => {
    if (!inputValue.trim().length) {
      setIsTouched(true);
      return;
    }

    handleConfirm(inputValue.trim(), board?._id!);
    resetForm();
  };

  const resetForm = () => {
    setIsTouched(false);
    setInputValue('');
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
      <DialogTitle sx={{ fontSize: '0.9rem', color: 'white', padding: 0 }}>New ticket</DialogTitle>
      <DialogContent sx={{ color: 'white', padding: 0, paddingTop: '5px!important' }}>
        <DialogContentText sx={{
          color: 'rgb(255 255 255 / 80%)',
          fontSize: '0.7rem',
          margin: '10px 0 15px'
        }}>
          Add a new ticket to the board: <strong style={{ color: 'rgb(25 111 230)' }}>{board?.name}</strong>
        </DialogContentText>
        <TextField
          className={styles['new-entry-dialog__textfield']}
          fullWidth
          autoFocus
          multiline
          rows={3}
          label="Ticket name"
          helperText={inputValue.trim().length <= 0 && isTouched && "Insert a value"}
          error={inputValue.trim().length <= 0 && isTouched}
          value={inputValue}
          onChange={onTextChange}
          onBlur={() => setIsTouched(true)}
          sx={{
            ...boardsTextField, marginBottom: '0.5rem', height: '7rem', '& div.MuiInputBase-root': {
              color: 'white',
              padding: '10px'
            },
          }}
        />
      </DialogContent>
      <DialogActions style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button sx={cancelButtonStyles} variant="outlined" onClick={handleClose}>Cancel</Button>
        <Button sx={{ ...agreeButtonStyles, marginRight: '0rem', }} variant="outlined" onClick={onSave}>Confirm</Button>
      </DialogActions>
    </Dialog>
  )
}
