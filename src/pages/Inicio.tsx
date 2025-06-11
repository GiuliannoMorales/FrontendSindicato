import React from "react";
import { useSelector } from "react-redux";
import { selectCurrentRoles } from "../features/auth/authSlice";
import { useAppDispatch } from "../app/hooks";
import { logOut } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const Inicio: React.FC = () => {
  const roles = useSelector(selectCurrentRoles);
  const dispatch = useAppDispatch();
const navigate = useNavigate();

  const handleLogout = () => {
  dispatch(logOut());
  navigate("/login");
};

  return (
    <>
      <h2>Inicio</h2>
      <p>tus roles: </p>
      {roles.map((rol) => (
        <div>{rol}</div>
      ))}
      <button onClick={handleLogout}>Log out</button>
    </>
  );
};

export default Inicio;
