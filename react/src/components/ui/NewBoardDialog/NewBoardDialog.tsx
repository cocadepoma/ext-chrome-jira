import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material"
import { ChangeEvent, useState } from "react";
import { ColorResult, GithubPicker } from "react-color";

import { useSnackbar } from "notistack";

import styles from './NewBoardDialog.module.css';

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  handleConfirm: (value: string, color: string) => void;
}

export const NewBoardDialog = ({
  isOpen,
  handleClose,
  handleConfirm,
}: Props) => {
  const { enqueueSnackbar } = useSnackbar();

  const [inputValue, setInputValue] = useState('');
  const [isTouched, setIsTouched] = useState(false);
  const [color, setColor] = useState<string>('rgb(255,255,255)');

  const onTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsTouched(true);
    setInputValue(event.target.value);
  };

  const onSave = () => {
    if (inputValue.trim().length <= 2) {
      enqueueSnackbar(`The board name should have at least 3 characters`, {
        variant: 'error',
        autoHideDuration: 2000,
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'bottom'
        }
      });

      return;
    }

    if (inputValue.trim().length > 20) {
      enqueueSnackbar(`The board name it is too large`, {
        variant: 'error',
        autoHideDuration: 2000,
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'bottom'
        }
      });

      return;
    }

    handleConfirm(inputValue, color);
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
      <DialogTitle sx={{ padding: 0, marginBottom: '0.5rem' }}>New Board</DialogTitle>
      <DialogContent sx={{ padding: 0, paddingTop: '20px!important' }}>
        <TextField
          className={styles['new-board-dialog__textfield']}
          fullWidth
          autoFocus
          multiline
          label="Board name"
          helperText={inputValue.length <= 0 && isTouched && "Insert a value" || inputValue.length > 20 && isTouched && "Name too large"}
          error={isTouched && (inputValue.length <= 0 || inputValue.length > 20)}
          value={inputValue}
          onChange={onTextChange}
          onBlur={() => setIsTouched(true)}
          sx={{ marginBottom: '1rem', height: '4.5rem' }}
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
        ['rgb(255, 255, 255)', 'rgb(248, 211, 211)', 'rgb(242, 221, 173)', 'rgb(243, 242, 193)', 'rgb(207, 243, 193)', 'rgb(193, 243, 232)', 'rgb(193, 230, 243)', 'rgb(193, 202, 243)', 'rgb(222, 193, 243)', 'rgb(243, 193, 236)']
      } />
      <DialogActions style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
        <Button color="error" variant="outlined" onClick={handleClose}>Cancel</Button>
        <Button disabled={!isTouched || (inputValue.length <= 0 || inputValue.length > 20)} color="info" variant="outlined" onClick={onSave}>Confirm</Button>
      </DialogActions>
    </Dialog>
  )
}
