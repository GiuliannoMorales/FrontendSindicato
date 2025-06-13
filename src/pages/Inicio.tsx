import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectCurrentRoles } from "../features/auth/authSlice";

const Inicio: React.FC = () => {
  const roles = useSelector(selectCurrentRoles);

  useEffect(() => {
    console.log("roles", roles);
  }, [roles]);
  
  return (
    <>
      <h2>Inicio</h2>
      <p>tus roles: </p>
      {roles.map((rol) => (
        <div>{rol}</div>
      ))}
    </>
  );
};

export default Inicio;
