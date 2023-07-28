import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/auth";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { userId } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      return navigate('/login', { replace: true });
    }
  }, []);

  return children;
};