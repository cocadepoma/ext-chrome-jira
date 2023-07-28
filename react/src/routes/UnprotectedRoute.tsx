import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/auth";

interface UnprotectedRouteProps {
  children: JSX.Element;
}

export const UnprotectedRoute = ({ children }: UnprotectedRouteProps) => {
  const { userId } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      navigate('/boards', { replace: true });
      return;
    }
  }, []);

  return children;
};