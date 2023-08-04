import { AddCircleOutlineOutlined } from '@mui/icons-material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, Tooltip } from '@mui/material';

import { Category } from '../../../interfaces';

interface Props {
  className: string;
  board: Category;

  onClick: (board: Category) => void;
  onRemoveBoard: (board: Category) => void;
  onEditBoard: (board: Category) => void;
}

export const CardHeader = ({ className = '', board, onClick, onRemoveBoard, onEditBoard }: Props) => {
  return (
    <div className={className}>
      <h4 style={{ color: board.color || '#ffffff' }}>{board.name}</h4>

      <Tooltip title="Edit board name">
        <IconButton sx={{ color: 'var(--orange-dark)', width: '1.1rem', height: '1.1rem', '& svg': { fontSize: '1rem' } }} onClick={() => onEditBoard(board)}>
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Delete board">
        <IconButton sx={{ color: 'var(--red-dark)', width: '1.1rem', height: '1.1rem', '& svg': { fontSize: '1rem' } }} onClick={() => onRemoveBoard(board)}>
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Add new ticket">
        <IconButton sx={{ color: 'var(--green-dark)', width: '1.1rem', height: '1.1rem', '& svg': { fontSize: '1rem' } }} onClick={() => onClick(board)}>
          <AddCircleOutlineOutlined />
        </IconButton>
      </Tooltip>
    </div>
  )
}
