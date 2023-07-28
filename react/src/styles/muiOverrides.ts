export const inputFormStyles = {
  borderRadius: '20px',
  backgroundColor: 'rgb(255 255 255 / 20%)',
  display: 'flex',
  alignItems: 'center',
  height: '2.6rem',
  fontSize: '0.7rem',
  color: 'white',
  '& fieldset': {
    border: 0,
  },
  '&&.Mui-focused': {
    '& fieldset': {
      border: '1px solid #bc981f',
    },
  }
}