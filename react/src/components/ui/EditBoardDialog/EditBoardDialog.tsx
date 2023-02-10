import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material"
import { ChangeEvent, useState } from "react";
import { Category } from "../../../interfaces";

import styles from './EditBoardDialog.module.css';

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  handleConfirm: (board: Category) => void;
  board: Category | null;
}

export const EditBoardDialog = ({
  isOpen,
  handleClose,
  handleConfirm,
  board,
}: Props) => {
  const [inputValue, setInputValue] = useState(board!.name);
  const [isTouched, setIsTouched] = useState(false);

  const onTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const onSave = () => {
    if (!inputValue.length) return;

    handleConfirm({
      ...board!,
      name: inputValue
    });
    resetForm();
  };

  const resetForm = () => {
    setIsTouched(false);
    setInputValue('');
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} PaperProps={{ sx: { width: '400px', maxWidth: '400px' } }}>
      <DialogTitle>Edit Board</DialogTitle>
      <DialogContent sx={{ paddingTop: '20px!important' }}>
        <TextField
          className={styles['new-board-dialog__textfield']}
          fullWidth
          autoFocus
          multiline
          label="Board name"
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
