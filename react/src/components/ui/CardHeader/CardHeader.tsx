import React from 'react'

import { AddCircleOutlineOutlined } from '@mui/icons-material';
import { IconButton } from '@mui/material';

import { Category } from '../../../interfaces';

interface Props {
  className: string;
  board: Category;

  onClick: (board: Category) => void;
}

export const CardHeader = ({ className = '', board, onClick }: Props) => {
  return (
    <div className={className}>
      <h4>{board.name}</h4>

      <IconButton sx={{ width: '1.1rem', height: '1.1rem', '& svg': { fontSize: '1rem' } }} onClick={() => onClick(board)}>
        <AddCircleOutlineOutlined />
      </IconButton>
    </div>
  )
}
