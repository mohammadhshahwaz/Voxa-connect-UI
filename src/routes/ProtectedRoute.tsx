import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getPersistedAuth } from "../services/auth";

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const location = useLocation();
  const auth = getPersistedAuth();
  const isAuthed = !!auth && (auth.user_id || auth.api_key);

  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
