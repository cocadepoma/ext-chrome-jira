import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { LockOutlined, PersonOutline, Visibility, VisibilityOff } from "@mui/icons-material";
import { Button, CircularProgress, IconButton, TextField } from "@mui/material";

import { AuthContext } from "../../contexts/auth";
import { BoardsContext } from "../../contexts/boards";
import { AuthService } from "../../services/AuthService";

import { inputFormStyles } from "../../styles/muiOverrides";
import { sleep } from "../../utils";

import './styles.css';

export const Login = () => {
  const navigate = useNavigate();

  const { signin } = useContext(AuthContext);
  const { loadBoards } = useContext(BoardsContext);

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      await sleep(500);
      navigate('/boards');
    } catch (error) {
      console.warn(error);
    }
  };

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const isValidEmail = (email: string) => {
    const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return mailformat.test(email);
  };

  return (
    <div className="login__container">

      <form className="login__form" onSubmit={(e) => e.preventDefault()}>

        <div className="login__group">
          <label htmlFor="email">Email</label>
          <TextField
            autoComplete="true"
            id="email"
            name="email"
            type="email"
            onChange={handleFormChange}
            value={form.email}
            placeholder="example@email.com"
            sx={{ height: '2.3rem' }}
            InputProps={{
              sx: inputFormStyles,
              startAdornment: <PersonOutline sx={{ color: 'rgb(213, 213, 213)', marginRight: '0.5rem', fontSize: '1rem' }} />,
            }}
            FormHelperTextProps={{
              sx: { fontSize: '.6rem' }
            }}
            error={isFormSubmitted && !isValidEmail(form.email)}
            helperText={isFormSubmitted && !isValidEmail(form.email) && 'The email is not a valid email'}
          />
        </div>

        <div className="login__group">
          <label htmlFor="password">Password</label>
          <TextField
            id="password"
            name="password"
            type={isPasswordShown ? 'text' : 'password'}
            onChange={handleFormChange}
            value={form.password}
            placeholder="**********"
            sx={{ height: '2.3rem' }}
            InputProps={{
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
              sx: { fontSize: '.6rem' }
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

      <div className="login__actions">
        <h5 onClick={() => navigate('/register')}>Create Account</h5>
        <h5>Forgot password?</h5>
      </div>

    </div >
  )
}
