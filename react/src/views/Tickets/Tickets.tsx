import { ChangeEvent, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';

import { ColorResult, GithubPicker } from 'react-color';
import { useSnackbar } from "notistack";

import { Button, Card, CardActions, CardContent, CardHeader, FormControl, Grid, Autocomplete, TextField, Typography } from "@mui/material"
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import { Box } from "@mui/system";
import { SaveOutlined } from '@mui/icons-material';
import UndoIcon from '@mui/icons-material/Undo';

import { BoardsContext } from '../../contexts/boards/BoardsContext';

import { Layout } from "../../components/layouts"
import { DeleteEntryDialog } from "../../components/ui";

import { Category, Entry } from "../../interfaces";
import { getTicketTime } from "../../utils";

const TicketView = () => {
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

    navigate('/');
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
    navigate('/');
  };

  const onColorChange = (e: ColorResult) => {
    setColor(e.hex);
  };

  return (
    <div>
      <Grid
        container
        justifyContent="center"
        sx={{ marginTop: '25px', '& label, & textarea, & input': { fontSize: '0.8rem' } }}
      >
        {ticket && (
          <Grid item sx={{ width: '59%' }}>
            <Card sx={{ backgroundColor: '#e8e8e8' }}>
              <CardHeader
                sx={{ padding: '10px 16px 0 16px' }}
                title={`Ticket: ${form.description.length > 35 ? form.description.substring(0, 35) + ' ...' : form.description}`}
                subheader={`Created ${getTicketTime(ticket.createdAt)}`}
                titleTypographyProps={{ style: { fontSize: '0.8rem', color: 'rgba(15, 70, 147, 0.787)', fontWeight: 'bold' } }}
                subheaderTypographyProps={{ style: { fontSize: '0.6rem' } }}
              />

              <CardContent>

                <TextField
                  sx={{
                    marginBottom: '14px', fontSize: 10,
                    '& .MuiInputBase-root': { padding: '8.5px 14px', backgroundColor: '#ffffff8a' },
                    '& .MuiFormLabel-root:not(.MuiFocused)': { top: '-4px', left: '2px' },
                    '& .MuiFormLabel-root.MuiInputLabel-shrink': { top: '2px' },
                  }}
                  fullWidth
                  multiline
                  maxRows={2}
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
                      <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
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

                <Typography variant="body1" sx={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                  Ticket Color:
                  <span style={{
                    boxShadow: '1px 1px 2px -1px rgba(0,0,0,0.6)',
                    backgroundColor: color,
                    height: '1.5rem',
                    width: '1.5rem',
                    display: 'inline-block',
                  }} />
                </Typography>
                <GithubPicker color={color} onChangeComplete={onColorChange} />
              </CardContent>

              <CardActions sx={{ display: 'flex', justifyContent: 'space-between', padding: 2 }}>
                <Button
                  size="small"
                  variant="contained"
                  color="info"
                  startIcon={<UndoIcon />}
                  onClick={() => navigate('/')}
                  sx={{ fontSize: '0.8rem' }}
                >

                  Back
                </Button>

                <div>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteOutline />}
                    onClick={() => setActiveDeleteTicket(true)}
                    sx={{ fontSize: '0.8rem', backgroundColor: '#ffffff8a' }}
                  >
                    Delete
                  </Button>

                  <Button
                    size="small"
                    sx={{ marginLeft: '1rem', fontSize: '0.8rem', backgroundColor: '#ffffff8a' }}
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

export default TicketView;
