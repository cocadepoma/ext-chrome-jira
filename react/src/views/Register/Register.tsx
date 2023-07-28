import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { LockOutlined, PersonOutline, Visibility, VisibilityOff } from "@mui/icons-material";
import { Button, Checkbox, CircularProgress, FormControlLabel, IconButton, TextField } from "@mui/material";

import { AuthContext } from "../../contexts/auth";
import { BoardsContext } from "../../contexts/boards";

import { inputFormStyles } from "../../styles/muiOverrides";
import './styles.css';

export const Register = () => {
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

    // try {
    //   const { data } = await AuthService.register({ email: form.email, password: form.password });
    //   signin({
    //     email: data.email,
    //     userId: data.id,
    //     token: data.token
    //   });
    //   loadBoards(data.boards);
    //   await sleep(500);
    //   navigate('/boards');
    // } catch (error) {
    //   console.warn(error);
    // }
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
    <div className="register__container">

      <form className="register__form" onSubmit={(e) => e.preventDefault()}>

        <div className="register__group">
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

        <div className="register__group">
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

        <div className="register__group">
          <label htmlFor="repeatPassword">Repeat password</label>
          <TextField
            id="repeatPassword"
            name="repeatPassword"
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

        <div>
          <FormControlLabel sx={{ '& span': { fontSize: '0.7rem', color: 'rgb(213, 213, 213)' } }} control={<Checkbox defaultChecked />} label="I agree the terms and conditions" />
        </div>

        <Button
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
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={20} sx={{ color: 'rgb(213, 213, 213)' }} /> : 'Register'}
        </Button>
      </form >

      <div className="register__actions">
        <h5 onClick={() => navigate('/login')}>Already an account?</h5>
      </div>

    </div >
  )
}
