import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/auth";
import { BoardsContext } from "../contexts/boards";
import { UIContext } from "../contexts/ui";
import { AuthService } from "../services/AuthService";
import { sleep } from "../utils";

interface UnprotectedRouteProps {
  children: JSX.Element;
}

export const UnprotectedRoute = ({ children }: UnprotectedRouteProps) => {
  const navigate = useNavigate();
  const { signin, loadEmail } = useContext(AuthContext);
  const { onStopAppLoading } = useContext(UIContext);
  const { loadBoards } = useContext(BoardsContext);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    const token = await AuthService.getToken();
    const email = await AuthService.getEmail();


    if (!token) {
      if (email) {
        loadEmail({ email });
      }
      await sleep(250);
      onStopAppLoading();
      return;
    }

    try {
      const { data } = await AuthService.refresh();

      signin({
        email: data.email,
        token: data.token,
        userId: data.id
      });
      loadBoards(data.boards);
      navigate('/boards');
    } catch (error) {
      console.warn(error);
    } finally {
      await sleep(300);
      onStopAppLoading();
    }
  };

  return children;
};