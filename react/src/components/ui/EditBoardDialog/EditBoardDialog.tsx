import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material"
import { ChangeEvent, useState } from "react";
import { ColorResult, GithubPicker } from "react-color";
import { Category } from "../../../interfaces";

import styles from './EditBoardDialog.module.css';

interface Props {
  isOpen: boolean;
  board: Category | null;
  handleClose: () => void;
  handleConfirm: (board: Category) => void;
}

export const EditBoardDialog = ({
  isOpen,
  handleClose,
  handleConfirm,
  board,
}: Props) => {
  const [inputValue, setInputValue] = useState(board!.name);
  const [isTouched, setIsTouched] = useState(false);
  const [color, setColor] = useState<string>(board?.color || '#ffffff');

  const onTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const onSave = () => {
    if (!inputValue.length) return;

    handleConfirm({
      ...board!,
      name: inputValue,
      color,
    });
    resetForm();
  };

  const resetForm = () => {
    setIsTouched(false);
    setInputValue('');
  };

  const onColorChange = (e: ColorResult) => {
    setColor(e.hex);
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} PaperProps={{ sx: { width: '360px', maxWidth: '360px', padding: '1.5rem' } }}>

      <DialogTitle sx={{ padding: 0, marginBottom: '0.5rem' }}>Edit Board</DialogTitle>
      <DialogContent sx={{ padding: 0, paddingTop: '20px!important' }}>
        <TextField
          className={styles['new-board-dialog__textfield']}
          fullWidth
          autoFocus
          label="Board name"
          helperText={inputValue.length <= 0 && isTouched && "Insert a value"}
          error={inputValue.length <= 0 && isTouched}
          value={inputValue}
          onChange={onTextChange}
          onBlur={() => setIsTouched(true)}
          sx={{ marginBottom: '1rem' }}
        />
      </DialogContent>

      <Typography variant="body1" sx={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem', padding: 0 }}>
        Board Color:
        <span style={{
          boxShadow: '1px 1px 2px -1px rgba(0,0,0,0.6)',
          backgroundColor: color,
          height: '1.5rem',
          width: '1.5rem',
          display: 'inline-block',
        }} />
      </Typography>
      <GithubPicker color={color} onChangeComplete={onColorChange} colors={
        ['rgb(255,255,255)', 'rgb(250 192 192 / 42%)', 'rgb(242 218 164 / 42%)', 'rgb(235 242 164 / 42%)', 'rgb(168 242 164 / 42%)', 'rgb(164 242 231 / 42%)', 'rgb(164 205 242 / 42%)', 'rgb(164 174 242 / 42%)', 'rgb(189 164 242 / 42%)', 'rgb(240 164 242 / 42%)']
      } />

      <DialogActions style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
        <Button color="error" variant="outlined" onClick={handleClose}>Cancel</Button>
        <Button color="info" variant="outlined" onClick={onSave}>Confirm</Button>
      </DialogActions>
    </Dialog>
  )
}
