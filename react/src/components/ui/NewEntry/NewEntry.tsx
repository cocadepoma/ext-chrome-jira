import { ChangeEvent, useContext, useState } from "react"
import { AddCircleOutlineOutlined, SaveOutlined } from "@mui/icons-material"
import { Box, Button, TextField } from "@mui/material"
import { BoardsContext } from "../../../contexts/boards";
import { UIContext } from "../../../contexts/ui";


export const NewEntry = () => {
  // const { addNewEntry } = useContext(BoardsContext);
  const { isAddingEntry, setIsAddingEntry } = useContext(UIContext);

  const [isAdding, setIsAdding] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTouched, setIsTouched] = useState(false);

  const onTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const onSave = () => {
    if (!inputValue.length) return;

    // addNewEntry(inputValue);
    resetForm();
  };

  const resetForm = () => {
    setIsTouched(false);
    setIsAddingEntry(false);
    setInputValue('');
  };

  return (
    <Box sx={{ marginBottom: 2, paddingX: 2 }}>

      {
        isAddingEntry
          ? (
            <>
              <TextField
                fullWidth
                sx={{ marginTop: 2, marginBottom: 1 }}
                placeholder="New Entry"
                autoFocus
                multiline
                label="New entry"
                helperText={inputValue.length <= 0 && isTouched && "Insert a value"}
                error={inputValue.length <= 0 && isTouched}
                value={inputValue}
                onChange={onTextChange}
                onBlur={() => setIsTouched(true)}
              />
              <Box display="flex" justifyContent="space-between">
                <Button
                  variant="outlined"
                  color="info"
                  onClick={() => setIsAddingEntry(false)}
                >
                  Cancelar
                </Button>

                <Button
                  variant="outlined"
                  color="info"
                  endIcon={<SaveOutlined />}
                  onClick={onSave}
                >
                  Save
                </Button>
              </Box>
            </>
          )
          : (
            <Button
              startIcon={<AddCircleOutlineOutlined />}
              fullWidth
              variant="outlined"
              onClick={() => setIsAddingEntry(true)}
            >
              Add task
            </Button>
          )
      }

    </Box>
  )
}
