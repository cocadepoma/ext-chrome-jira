import { Typography } from "@mui/material"
import { useNavigate } from "react-router-dom";

export const EmptyBoard = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <Typography variant="h1" sx={{ fontSize: '1.4rem' }}>You don&apos; t have any board yet,
        <span
          onClick={() => navigate('/boards')}
          style={{ color: '#2883FF', cursor: 'pointer' }}> add one</span>.
      </Typography>
    </div>
  )
}
