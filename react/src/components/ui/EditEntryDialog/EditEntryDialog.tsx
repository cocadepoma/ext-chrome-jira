import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material"
import { ChangeEvent, useState } from "react";
import { Entry } from "../../../interfaces";

import styles from './EditEntryDialog.module.css';

interface Props {
  isOpen: boolean;
  ticket: Entry | null;
  handleClose: () => void;
  handleConfirm: (ticket: Entry) => void;
}

export const EditEntryDialog = ({
  isOpen,
  ticket,
  handleClose,
  handleConfirm,
}: Props) => {
  const [inputValue, setInputValue] = useState<string>(ticket?.description!);
  const [isTouched, setIsTouched] = useState(false);

  const onTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const onSave = () => {
    if (!inputValue.length) return;

    const updatedTicket = {
      ...ticket,
      description: inputValue
    } as Entry;

    handleConfirm(updatedTicket);
    resetForm();
  };

  const resetForm = () => {
    setIsTouched(false);
    setInputValue('');
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>Edit ticket</DialogTitle>
      <DialogContent sx={{ paddingTop: '20px!important' }}>
        <TextField
          className={styles['new-entry-dialog__textfield']}
          fullWidth
          autoFocus
          multiline
          label="Ticket name"
          helperText={inputValue.length <= 0 && isTouched && "Insert a value"}
          error={inputValue.length <= 0 && isTouched}
          value={inputValue}
          onChange={onTextChange}
          onBlur={() => setIsTouched(true)}
        />
      </DialogContent>
      <DialogActions style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
        <Button color="error" variant="outlined" onClick={handleClose}>Cancel</Button>
        <Button color="primary" variant="outlined" onClick={onSave}>Confirm</Button>
      </DialogActions>
    </Dialog>
  )
}
