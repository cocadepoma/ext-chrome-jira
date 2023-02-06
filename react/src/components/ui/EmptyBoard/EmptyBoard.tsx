import { Typography } from "@mui/material"
// import { useRouter } from "next/router"

export const EmptyBoard = () => {
  // const router = useRouter();

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <Typography variant="h1" sx={{ fontSize: '1.4rem', color: 'rgba(0,0,0,0.8)' }}>You don&apos; t have any board yet,
        <span
          onClick={() => { }}
          style={{ color: '#2883FF', cursor: 'pointer' }}> add one</span>.
      </Typography>
    </div>
  )
}
