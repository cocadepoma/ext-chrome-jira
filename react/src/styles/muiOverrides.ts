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
export const cancelButtonStyles = {
  border: '1px solid #c63131',
  color: '#c63131',
  '&:hover': {
    color: 'red',
    border: '1px solid red',
  },
};

export const agreeButtonStyles = {
  marginRight: '1rem',
  border: '1px solid #b77f17',
  color: '#b77f17',
  '&:hover': {
    color: 'orange',
    border: '1px solid orange',
  },
  '&.Mui-disabled': {
    color: '#b77f1769',
    border: '1px solid #b77f173b',
  }
};

export const backButtonStyles = {
  marginRight: '1rem',
  color: '#fff',
  border: '1px solid #b77f17',
  backgroundColor: '#b77f17',
  '&:hover': {
    backgroundColor: '#d29c37',
    border: '1px solid #d29c37',
  },
};

export const menuItemStyles = {
  fontSize: '0.7rem',
  color: 'white',
  '&:hover': {
    backgroundColor: 'var(--gray-dark)'
  }
};
export const boardsTextField = {
  marginBottom: '0rem',
  height: '4.7rem',
  color: 'white',
  '& label': {
    color: 'white',
    fontSize: '0.7rem',
  },
  '& input': {
    fontSize: '0.85rem',
  },
  '& textarea': {
    fontSize: '0.85rem',
  },
  '& label.Mui-focused': {
    color: 'orange',
  },
  '& fieldset': {
    borderColor: 'var(--gray-super-light)',
  },
  '& div.MuiInputBase-root': {
    color: 'white',
    height: '2.6rem',
  },
  '& div.MuiInputBase-root.Mui-focused fieldset:not(div.MuiInputBase-root.Mui-error)': {
    borderColor: 'orange',
  },
  '& .MuiInputBase-root:hover fieldset': {
    borderColor: 'var(--white-dark)',
  },
  '& .MuiInputBase-root.Mui-error:hover fieldset': {
    borderColor: 'red',
  },
  '& .MuiFormHelperText-root': {
    fontSize: '0.55rem',
  },
  '& legend': {
    width: '3.5rem'
  },
};