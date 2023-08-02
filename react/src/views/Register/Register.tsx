import { useContext, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { LockOutlined, PersonOutline } from "@mui/icons-material";
import {
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  TextField
} from "@mui/material";
import { useSnackbar } from "notistack";

import { AuthContext } from "../../contexts/auth";
import { BoardsContext } from "../../contexts/boards";

import { AuthService } from "../../services/AuthService";
import { inputFormStyles } from "../../styles/muiOverrides";
import { isValidEmail, isValidPassword, sleep } from "../../utils";

import './styles.css';

export const Register = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { signin } = useContext(AuthContext);
  const { loadBoards } = useContext(BoardsContext);

  const [form, setForm] = useState({
    email: '',
    password: '',
    repeatPassword: '',
    terms: false,
  });

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [autoFocus, setIsAutoFocus] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    focusToInput();
  }, [inputRef.current]);

  const focusToInput = async () => {
    if (!inputRef.current) return;
    await sleep(500);
    (inputRef.current?.children[1] as HTMLInputElement).focus()
    setIsAutoFocus(true);
  };

  const onSubmit = async () => {
    setIsFormSubmitted(true);
    if (!isValidEmail(form.email)) return;
    if (!form.password.length) return;
    if (isLoading) return;
    if (form.password !== form.repeatPassword) return;
    if (!form.terms) return;

    setIsLoading(true);

    try {
      const { data } = await AuthService.register({ email: form.email, password: form.password });
      signin({
        email: data.email,
        userId: data.id,
        token: data.token
      });
      loadBoards(data.boards);

      setIsDialogOpen(true);
    } catch (error: any) {
      console.warn(error);
      let message = 'Error while trying to register your account';
      if (error?.response?.status === 409) {
        message = 'An user already exists with that email';
        setEmailError(true);
      }
      enqueueSnackbar(message, {
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

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailError(false);
    setForm({
      ...form,
      [event.target.name]: event.target.name === 'terms'
        ? !form.terms
        : event.target.value
    });
  };

  const getLabelPasswordInput = () => {
    if (isFormSubmitted && isValidPassword(form.password)) return 'Password must contain an uppercase, a lowercase and a special char';
    if (isFormSubmitted && form.password.length === 0) return 'You must introduce a password';
    if (isFormSubmitted && form.password.length < 6) return 'Password should have at least 6 characters';
    if (isFormSubmitted && form.password.length > 20) return 'Password should have a max. of 20 characters';
    if (isFormSubmitted && form.password.length > 0 && form.password !== form.repeatPassword) return 'Passwords does not match';

    return false;
  };

  const getPasswordError = () => {
    if (isFormSubmitted && isValidPassword(form.password)) return true;
    if (isFormSubmitted && form.password.length === 0) return true;
    if (isFormSubmitted && form.password.length > 0 && form.password !== form.repeatPassword) return true;
    return false;
  };

  const navigateToLogin = async () => {
    ref.current?.classList.add('leave');
    await sleep(400);
    navigate('/login')
  };

  const handleCloseDialog = () => {
    navigate('/login');
  };

  return (
    <div ref={ref} className="register__container">

      <form className="register__form" onSubmit={(e) => e.preventDefault()} autoComplete="off">

        <div className="register__group">
          <label htmlFor="email">Email</label>
          <TextField
            focused={autoFocus}
            autoComplete="off"
            id="email"
            name="email"
            type="email"
            onChange={handleFormChange}
            value={form.email}
            placeholder="example@email.com"
            sx={{ height: '2.3rem' }}
            InputProps={{
              ref: inputRef,
              sx: inputFormStyles,
              startAdornment: <PersonOutline sx={{ color: 'rgb(213, 213, 213)', marginRight: '0.5rem', fontSize: '1rem' }} />,
            }}
            FormHelperTextProps={{
              sx: { fontSize: '.5rem' }
            }}
            error={isFormSubmitted && !isValidEmail(form.email) || emailError}
            helperText={isFormSubmitted && !isValidEmail(form.email) && 'The email is not a valid email' || emailError && 'Email already exists'}
          />
        </div>

        <div className="register__group">
          <label htmlFor="password">Password</label>
          <TextField
            id="password"

            name="password"
            type="password"
            onChange={handleFormChange}
            value={form.password}
            placeholder="**********"
            sx={{ height: '2.3rem' }}
            InputProps={{
              sx: inputFormStyles,
              startAdornment: <LockOutlined sx={{ color: 'rgb(213, 213, 213)', marginRight: '0.5rem', fontSize: '1rem' }} />,
            }}
            FormHelperTextProps={{
              sx: { fontSize: '.5rem' }
            }}
            error={getPasswordError()}
            helperText={getLabelPasswordInput()}
          />
        </div>

        <div className="register__group">
          <label htmlFor="repeatPassword">Repeat password</label>
          <TextField
            id="repeatPassword"
            name="repeatPassword"
            type="password"
            onChange={handleFormChange}
            value={form.repeatPassword}
            placeholder="**********"
            sx={{ height: '2.3rem' }}
            InputProps={{
              sx: inputFormStyles,
              startAdornment: <LockOutlined sx={{ color: 'rgb(213, 213, 213)', marginRight: '0.5rem', fontSize: '1rem' }} />,
            }}
            FormHelperTextProps={{
              sx: { fontSize: '.5rem' }
            }}
            error={isFormSubmitted && form.password !== form.repeatPassword}
            helperText={isFormSubmitted && form.password !== form.repeatPassword && 'Passwords does not match'}
          />
        </div>

        <div style={{ height: '55px' }}>
          <FormControlLabel
            sx={{
              cursor: 'default',
              '& .Mui-checkbox-root': {
                color: isFormSubmitted && !form.terms ? 'red' : 'white',
              },
              '& span.Mui-checked svg': {
                color: '#bc981f'
              },
              '& span': {
                fontSize: '0.62rem',
                color: 'rgb(213, 213, 213)',
              }
            }}
            control={
              <Checkbox
                name="terms"
                checked={form.terms}
                onChange={handleFormChange}
                sx={{ cursor: 'pointer', color: 'red' }}
              />}
            label={(
              <span>
                By creating an account, you agree to the
                {` `}
                <a style={{ cursor: 'pointer', color: '#bc981f' }} href="https://deveser.net/terms/kanbanify" target="_blank">Terms of Service</a>
                {` `}
                and
                {` `}
                <a style={{ cursor: 'pointer', color: '#bc981f' }} href="https://deveser.net/policies/kanbanify" target="_blank">Privacy Policy</a>.
              </span>
            )}
          />
          {<span style={{ color: '#ff1744', fontSize: '0.5rem', paddingLeft: '0.8rem' }}>{isFormSubmitted && !form.terms ? 'You must agree the terms before registering' : ''}</span>}
        </div>

        <Button
          disabled={isLoading}
          type="submit"
          variant="contained"
          color="info"
          onClick={onSubmit}
          sx={{
            borderRadius: '20px',
            backgroundColor: '#bc981f',
            '&:hover': {
              backgroundColor: '#dab438'
            }
          }}
        >
          {isLoading ? <CircularProgress size={20} sx={{ color: 'rgb(213, 213, 213)' }} /> : 'Register'}
        </Button>
      </form >

      <div className="register__actions">
        <h5 onClick={navigateToLogin}>Already have an account?</h5>
      </div>

      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            maxWidth: '28rem',
            color: 'rgb(255 255 255 / 90%)',
            backgroundColor: 'rgb(59 58 65 / 96%)',
            boxShadow: '2px 2px 6px 0px #ffffff33',
            '& h2': {
              backgroundColor: 'rgb(0 0 0 / 20%)',
              boxShadow: '0px 2px 3px -3px #ffffffa3',
              fontSize: '1rem',
            },
            '& div.MuiDialogContent-root': {
              paddingTop: '18px'
            },
            '& .MuiDialogContent-root p': {
              color: 'rgb(255 255 255 / 80%)',
              fontSize: '0.7rem',
            },
            '& button': {
              color: 'rgb(222 177 66 / 92%)',
            },
            '& button:hover': {
              color: 'rgb(254 182 4 / 100%)',
            },
          },
        }}

      >
        <DialogTitle>
          Confirm registration
        </DialogTitle>
        <DialogContent sx={{ paddingTop: '24px' }}>
          <DialogContentText>
            Thanks for signing up, we've emailed you a confirmation link, once you confirm your email, you can continue setting up your profile.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>

    </div >
  )
}