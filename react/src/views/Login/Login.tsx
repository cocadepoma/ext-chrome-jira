import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { LockOutlined, PersonOutline, Visibility, VisibilityOff } from "@mui/icons-material";
import { Button, CircularProgress, IconButton, TextField } from "@mui/material";

import { AuthContext } from "../../contexts/auth";
import { BoardsContext } from "../../contexts/boards";
import { AuthService } from "../../services/AuthService";

import { inputFormStyles } from "../../styles/muiOverrides";
import { isValidEmail, sleep } from "../../utils";

import { UIContext } from "../../contexts/ui";


import { useSnackbar } from "notistack";
import { RecoveryDialog } from "./components/RecoveryDialog/RecoveryDialog";
import './styles.css';

export const Login = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { signin, email } = useContext(AuthContext);
  const { loadBoards } = useContext(BoardsContext);
  const { isAppLoading } = useContext(UIContext);

  const [form, setForm] = useState({
    email: email ?? '',
    password: '',
  });

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [autoFocus, setIsAutoFocus] = useState<'email' | 'password' | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const inputPasswordRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    focusToInput();
  }, [inputRef.current, isAppLoading]);

  useEffect(() => {
    if (!email || email.length > 0 && form.email.length > 0) return;
    setForm({
      ...form,
      email
    });
  }, [email]);

  const focusToInput = async () => {
    if (!inputRef.current || isAppLoading) return;
    await sleep(200);

    if (!email) {
      (inputRef.current?.children[1] as HTMLInputElement).focus();
      setIsAutoFocus('email');
    } else {
      (inputPasswordRef.current?.children[1] as HTMLInputElement).focus();
      setIsAutoFocus('password');
    }
  };

  const onSubmit = async () => {
    setIsFormSubmitted(true);

    if (!isValidEmail(form.email)) return;
    if (!form.password.length) return;
    if (isLoading) return;

    setIsLoading(true);

    try {
      const { data } = await AuthService.login({ email: form.email, password: form.password });
      signin({
        email: data.email,
        userId: data.id,
        token: data.token
      });
      loadBoards(data.boards);
      await AuthService.setEmail(data.email);
      await AuthService.setToken(data.token);
      await sleep(500);
      navigate('/boards');
    } catch (error: any) {
      console.warn(error);
      let message = 'User or email not valid';

      if (error?.response?.data?.message === 'User not verified') {
        message = 'Account not activated yet, please check your email';
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
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const navigationToRegister = async () => {
    containerRef.current?.classList.add('leave');
    actionsRef.current?.classList.add('leave');

    await sleep(300);
    navigate('/register');
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <div ref={containerRef} className="login__container">

      <form className="login__form" onSubmit={(e) => e.preventDefault()}>

        <div className="login__group">
          <label htmlFor="email">Email</label>
          <TextField
            focused={autoFocus === 'email'}
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
            error={isFormSubmitted && !isValidEmail(form.email)}
            helperText={isFormSubmitted && !isValidEmail(form.email) && 'The email is not a valid email'}
          />
        </div>

        <div className="login__group">
          <label htmlFor="password">Password</label>
          <TextField
            focused={autoFocus === 'password'}
            id="password"
            name="password"
            type={isPasswordShown ? 'text' : 'password'}
            onChange={handleFormChange}
            value={form.password}
            placeholder="**********"
            sx={{ height: '2.3rem' }}
            InputProps={{
              ref: inputPasswordRef,
              sx: inputFormStyles,
              startAdornment: <LockOutlined sx={{ color: 'rgb(213, 213, 213)', marginRight: '0.5rem', fontSize: '1rem' }} />,
              endAdornment: (
                <IconButton onClick={() => setIsPasswordShown(!isPasswordShown)}>
                  {isPasswordShown
                    ? <Visibility sx={{ color: 'rgb(213, 213, 213)', fontSize: '0.9rem' }} />
                    : <VisibilityOff sx={{ color: 'rgb(213, 213, 213)', fontSize: '0.9rem' }} />
                  }
                </IconButton>
              )
            }}
            FormHelperTextProps={{
              sx: { fontSize: '.5rem' }
            }}
            error={isFormSubmitted && form.password.length === 0}
            helperText={isFormSubmitted && form.password.length === 0 && 'You must introduce a password'}
          />
        </div>

        <Button
          type="submit"
          variant="contained"
          color="info"
          onClick={onSubmit}
          sx={{
            marginTop: '1.5rem',
            borderRadius: '20px',
            backgroundColor: '#bc981f',
            '&:hover': {
              backgroundColor: '#dab438'
            }
          }}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={20} sx={{ color: 'rgb(213, 213, 213)' }} /> : 'Login'}
        </Button>
      </form >

      <div ref={actionsRef} className="login__actions">
        <h5 onClick={navigationToRegister}>Create Account</h5>
        <h5 onClick={() => setIsDialogOpen(true)}>Forgot password?</h5>
      </div>

      <RecoveryDialog
        isDialogOpen={isDialogOpen}
        handleCloseDialog={handleCloseDialog}
      />
    </div >
  )
}
