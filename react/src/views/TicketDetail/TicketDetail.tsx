import { ChangeEvent, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';

import { useSnackbar } from "notistack";
import { ColorResult, GithubPicker } from 'react-color';

import { SaveOutlined } from '@mui/icons-material';
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import UndoIcon from '@mui/icons-material/Undo';
import { Autocomplete, Button, Card, CardActions, CardContent, CardHeader, FormControl, Grid, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";

import { BoardsContext } from '../../contexts/boards/BoardsContext';

import { DeleteEntryDialog } from "../../components/ui";

import { Category, Entry } from "../../interfaces";
import { agreeButtonStyles, backButtonStyles, boardsTextField, cancelButtonStyles } from "../../styles/muiOverrides";
import { getTicketTime } from "../../utils";

export const TicketDetail = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const [ticket, setTicket] = useState<Entry | null>(null);

  const { boards, updateBoards, deleteEntry, updateEntry } = useContext(BoardsContext);

  const [isTouched, setIsTouched] = useState(false);
  const [form, setForm] = useState({
    description: '',
    content: '',
  });

  const [selectedBoard, setSelectedBoard] = useState<Category | null>(null);
  const [color, setColor] = useState<string>('rgba(0,0,0,.5)');

  const [activeDeleteTicket, setActiveDeleteTicket] = useState<boolean>(false);

  const isNotValid = useMemo(() => form.description.length <= 0 && isTouched, [isTouched, form]);

  useEffect(() => {
    if (!boards.length) return;
    loadTicketWithId();

  }, [params]);

  const loadTicketWithId = () => {
    const ticketId = params.ticketid;
    const boardId = params.boardid;

    const board = boards.find(board => board._id === boardId)!;
    const ticket = board.tickets.find(tk => tk._id === ticketId)!;
    setSelectedBoard(board);

    setColor(ticket.color || 'rgba(0,0,0,.5)');
    setTicket(ticket);
    setForm({ description: ticket.description, content: ticket.content || '' });
  };

  const onFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  };

  const onBoardChange = (event: any, value: Category | null) => {
    if (!value) {
      setSelectedBoard(null);
      return;
    }

    setSelectedBoard(value);
  };

  const onSaveForm = async () => {
    if (!selectedBoard || !ticket) return;

    if (form.description.trim().length < 1) {
      enqueueSnackbar(`The ticket name should contain at least 1 character`, {
        variant: 'error',
        autoHideDuration: 2000,
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'bottom'
        }
      })
      return;
    }

    const newTicket = {
      ...ticket,
      content: form.content.trim(),
      description: form.description.trim(),
      categoryId: selectedBoard._id,
      color
    };

    const boardsToUpdate = [];

    if (selectedBoard._id !== ticket.categoryId) {
      const sourceBoard = boards.find(board => board._id === ticket.categoryId)!;
      const updatedSourceBoardTicket = sourceBoard.tickets.filter(boardTicket => boardTicket._id !== newTicket._id);

      const updatedSourceBoard = {
        ...sourceBoard,
        tickets: updatedSourceBoardTicket,
      };

      boardsToUpdate.push(updatedSourceBoard);

      const entryBoard = boards.find(board => board._id === selectedBoard._id)!;

      const ticketBoard: Category = {
        ...entryBoard,
        tickets: [...entryBoard.tickets, newTicket]
      };

      boardsToUpdate.push(ticketBoard);
    } else {
      const entryBoard = boards.find(board => board._id === selectedBoard._id)!;
      const updatedTickets = entryBoard.tickets.map(boardTicket => boardTicket._id === newTicket._id ? newTicket : boardTicket);

      const ticketBoard: Category = {
        ...entryBoard,
        tickets: updatedTickets
      };

      boardsToUpdate.push(ticketBoard);
    }

    await updateEntry(newTicket, true);
    await updateBoards(boardsToUpdate);

    await new Promise((resolve) => setTimeout(resolve, 500));

    navigate('/boards');
  };

  const onCloseDeleteTicket = () => {
    setActiveDeleteTicket(false);
  };

  const handleConfirmDeleteTicket = async () => {
    if (!ticket) return;

    const entryBoard = boards.find(board => board._id === ticket.categoryId)!;
    const updatedTickets = entryBoard.tickets.filter(tk => tk._id !== ticket._id);

    const updatedBoard: Category = {
      ...entryBoard,
      tickets: updatedTickets
    };

    deleteEntry(ticket);
    updateBoards([updatedBoard]);

    onCloseDeleteTicket();
    navigate('/boards');
  };

  const onColorChange = (e: ColorResult) => {
    setColor(e.hex);
  };

  return (
    <div>
      <Grid
        container
        justifyContent="center"
        sx={{ marginTop: '33px', '& label, & textarea, & input': { fontSize: '0.8rem' } }}
      >
        {ticket && (
          <Grid item sx={{ width: '59%' }}>
            <Card sx={{ backgroundColor: 'var(--gray-dark)', boxShadow: 'var(--shadow-xy)' }}>
              <CardHeader
                sx={{ padding: '10px 16px 9px 16px', backgroundColor: 'var(--gray-heading)' }}
                title={`Ticket: ${form.description.length > 35 ? form.description.substring(0, 35) + ' ...' : form.description}`}
                subheader={`Created ${getTicketTime(ticket.createdAt)}`}
                titleTypographyProps={{ style: { fontSize: '0.8rem', color: 'orange', fontWeight: 'bold' } }}
                subheaderTypographyProps={{ style: { fontSize: '0.6rem', color: 'white' } }}
              />

              <CardContent>
                <TextField
                  sx={{
                    ...boardsTextField,
                    '& div.MuiInputBase-root': {
                      color: 'white',
                      height: 'auto',
                      backgroundColor: 'transparent'
                    },
                    '& legend': {
                      width: '2.2rem'
                    },
                    marginBottom: '14px', fontSize: 10,
                    '& .MuiInputBase-root': {
                      padding: '8.5px 14px',
                      color: 'white',
                    },
                    '& .MuiFormLabel-root:not(.MuiFocused)': { top: '-4px', left: '2px' },
                    '& .MuiFormLabel-root.MuiInputLabel-shrink': { top: '2px' },
                  }}
                  fullWidth
                  multiline
                  rows={2}
                  label="Name"
                  name="description"
                  onChange={onFieldChange}
                  value={form.description}
                  onBlur={() => setIsTouched(true)}
                  helperText={isNotValid && 'The name is mandatory'}
                  error={isNotValid}
                />

                <FormControl fullWidth>
                  <Autocomplete
                    sx={{
                      ...boardsTextField,
                      height: '3.5rem',
                      '& div.MuiInputBase-root': {
                        color: 'white',
                        height: 'auto',
                        backgroundColor: 'transparent',
                        '& .MuiAutocomplete-endAdornment button': {
                          color: '#fff'
                        }
                      },
                      '& legend': {
                        width: '2.3rem'
                      },
                      '& .MuiInputBase-root': { padding: '4px 10px', backgroundColor: '#ffffff8a' },
                      '& .MuiFormLabel-root:not(.MuiFocused)': { top: '-3px', left: '2px' },
                      '& .MuiInputLabel-root.MuiInputLabel-shrink': { top: '2px' },
                    }}
                    ListboxProps={{ style: { fontSize: '0.8rem' } }}
                    clearOnEscape
                    selectOnFocus

                    fullWidth
                    id="combo-box-demo"
                    options={boards}
                    getOptionLabel={(option) => option.name}
                    isOptionEqualToValue={(option: any, value: any) => option.name === value.name}
                    renderOption={(props, option) => (
                      <Box component="li" sx={{
                        backgroundColor: 'var(--gray-heading)',
                        color: '#fff',
                        '&:hover': {
                          backgroundColor: 'var(--gray-body)!important',
                        },
                        '&[aria-selected="true"]': {
                          backgroundColor: 'var(--gray-light)!important',
                        },
                      }}
                        {...props}
                      >
                        {option.name}
                      </Box>
                    )}
                    value={selectedBoard}
                    renderInput={(params) => <TextField {...params} label="Board" />}
                    onChange={onBoardChange}
                    defaultValue={boards.find(board => board._id === ticket.categoryId)}
                  />
                </FormControl>

                <TextField
                  sx={{
                    ...boardsTextField,
                    height: '8.5rem',
                    '& div.MuiInputBase-root': {
                      color: 'white',
                      height: 'auto',
                      backgroundColor: 'transparent'
                    },
                    '& legend': {
                      width: '3.5rem'
                    },
                    marginBottom: '14px',
                    marginTop: '14px',
                    '& .MuiInputBase-root': { backgroundColor: '#ffffff8a' },
                    '& .MuiFormLabel-root:not(.MuiFocused)': { top: '-3px', left: '2px' },
                    '& .MuiInputLabel-root.MuiInputLabel-shrink': {
                      top: '2px'
                    },
                  }}
                  fullWidth
                  placeholder="Description"
                  multiline
                  rows={4}
                  label="Description"
                  name="content"
                  onChange={onFieldChange}
                  value={form.content}
                />

                <Typography variant="body1" sx={{ color: '#fff', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                  Ticket Color:
                  <span style={{
                    boxShadow: '1px 1px 2px -1px rgba(0,0,0,0.6)',
                    backgroundColor: color,
                    height: '1.5rem',
                    width: '1.5rem',
                    display: 'inline-block',
                  }} />
                </Typography>
                <GithubPicker color={color} onChangeComplete={onColorChange} colors={
                  ['#f44336', '#e81e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722']
                } />
              </CardContent>

              <CardActions sx={{ display: 'flex', justifyContent: 'space-between', padding: 2 }}>
                <Button
                  size="small"
                  variant="contained"
                  color="warning"
                  startIcon={<UndoIcon />}
                  onClick={() => navigate('/boards')}
                  sx={backButtonStyles}
                >
                  Back
                </Button>

                <div>
                  <Button
                    sx={cancelButtonStyles}
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteOutline />}
                    onClick={() => setActiveDeleteTicket(true)}
                  >
                    Delete
                  </Button>

                  <Button
                    size="small"
                    sx={{ ...agreeButtonStyles, marginLeft: '1rem', marginRight: '0rem', }}
                    variant="outlined"
                    color="info"
                    startIcon={<SaveOutlined />}
                    onClick={onSaveForm}
                    disabled={form.description.length <= 0 || !selectedBoard}
                  >
                    Save
                  </Button>
                </div>
              </CardActions>
            </Card>
          </Grid>
        )}
      </Grid>

      {
        activeDeleteTicket && (
          <DeleteEntryDialog
            isOpen={!!activeDeleteTicket}
            handleClose={onCloseDeleteTicket}
            handleDelete={handleConfirmDeleteTicket}
          />
        )
      }
    </div>
  )
};
