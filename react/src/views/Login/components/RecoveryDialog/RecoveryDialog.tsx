import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { AuthService } from '../../../../services/AuthService';
import { inputFormStyles } from '../../../../styles/muiOverrides';
import { isValidEmail, sleep } from '../../../../utils';

interface Props {
  isDialogOpen: boolean;
  handleCloseDialog: () => void;
}

export const RecoveryDialog = ({
  isDialogOpen,
  handleCloseDialog,

}: Props) => {
  const { enqueueSnackbar } = useSnackbar();

  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [isRecoveryFormSubmitted, setIsRecoveryFormSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecoverySuccessful, setIsRecoverySuccessful] = useState(false);

  const handleRecoveryEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRecoveryEmail(event.target.value);
  };

  const handleClose = async () => {
    handleCloseDialog();

    await sleep(300);
    setRecoveryEmail('');
    setIsRecoveryFormSubmitted(false);
    setIsRecoverySuccessful(false);
    setIsLoading(false);
  };

  const handleSubmitDialog = async () => {
    setIsRecoveryFormSubmitted(true);
    if (!isValidEmail(recoveryEmail)) return;

    setIsLoading(true);
    await sleep(500);

    try {
      await AuthService.recoveryEmail({ email: recoveryEmail });
      setIsRecoverySuccessful(true);
    } catch (error: any) {
      console.warn(error);
      setIsRecoverySuccessful(false);
      enqueueSnackbar('Error while trying to reset your password', {
        variant: 'error',
        autoHideDuration: 2000,
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'bottom'
        }
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Dialog
        open={isDialogOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            width: '28rem',
            minHeight: '15rem',
            color: 'rgb(255 255 255 / 90%)',
            backgroundColor: 'rgb(59 58 65 / 96%)',
            boxShadow: '2px 2px 6px 0px #ffffff33',
            '& h2': {
              backgroundColor: 'rgb(0 0 0 / 20%)',
              boxShadow: '0px 2px 3px -3px #ffffffa3',
              fontSize: '1rem',
            },
          },
        }}
      >
        <DialogTitle>
          Password recovery
        </DialogTitle>

        {
          !isLoading && !isRecoverySuccessful && (
            <DialogContent sx={{ paddingTop: '24px', backgroundColor: 'rgb(59 58 65 / 96%)', display: 'flex', flexDirection: 'column' }}>
              <DialogContentText sx={{
                paddingTop: '18px',
                color: 'rgb(255 255 255 / 80%)',
                fontSize: '0.7rem',
              }}>
                Please enter your username or email address. You will receive a link to create a new password via email.
              </DialogContentText>

              <TextField
                fullWidth
                autoFocus
                autoComplete="off"
                id="email"
                name="email"
                type="email"
                onChange={handleRecoveryEmailChange}
                value={recoveryEmail}
                placeholder="Username or email"
                sx={{ height: '1rem' }}
                InputProps={{
                  sx: {
                    ...inputFormStyles,
                    borderRadius: '3px',
                    marginTop: '1rem',
                    '& input': {
                      height: '2rem',
                      padding: '0 0.5rem',
                    }
                  },
                }}
                FormHelperTextProps={{
                  sx: { fontSize: '.5rem' }
                }}
                error={isRecoveryFormSubmitted && !isValidEmail(recoveryEmail)}
                helperText={isRecoveryFormSubmitted && !isValidEmail(recoveryEmail) && 'The email is not a valid email'}
              />
            </DialogContent>
          )
        }

        {
          !isLoading && isRecoverySuccessful && (
            <DialogContent sx={{ paddingTop: '24px', backgroundColor: 'rgb(59 58 65 / 96%)', display: 'flex', flexDirection: 'column' }}>
              <DialogContentText sx={{
                paddingTop: '18px',
                color: 'rgb(255 255 255 / 80%)',
                fontSize: '0.7rem',
              }}>
                An email has been sent to your registered email address.
              </DialogContentText>
              <DialogContentText sx={{
                color: 'rgb(255 255 255 / 80%)',
                fontSize: '0.7rem',
              }}>
                Please follow the instructions in the email to reset your password.
              </DialogContentText>
            </DialogContent>
          )
        }

        {
          isLoading && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, }}>
              <CircularProgress size={24} sx={{ color: 'rgb(213, 213, 213)' }} />
            </div>
          )
        }
        <DialogActions sx={{ gap: '0.75rem', marginBottom: '0.5rem', backgroundColor: 'rgb(59 58 65 / 96%)', }}>
          {!isLoading && !isRecoverySuccessful && (
            <>
              <Button
                variant="outlined"
                onClick={handleClose}
                sx={{
                  border: '1px solid #c63131',
                  color: '#c63131',
                  '&:hover': {
                    color: 'red',
                    border: '1px solid red',
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                variant="outlined"
                onClick={handleSubmitDialog}
                sx={{
                  marginRight: '1rem',
                  border: '1px solid #b77f17',
                  color: '#b77f17',
                  '&:hover': {
                    color: 'orange',
                    border: '1px solid orange',
                  },
                }}
              >
                Agree
              </Button>
            </>
          )}

          {!isLoading && isRecoverySuccessful && (
            <Button
              variant="outlined"
              onClick={handleClose}
              sx={{
                marginRight: '1rem',
                border: '1px solid #b77f17',
                color: '#b77f17',
                '&:hover': {
                  color: 'orange',
                  border: '1px solid orange',
                },
              }}
            >
              Close
            </Button>
          )}

        </DialogActions>
      </Dialog>
    </>
  )
}
