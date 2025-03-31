import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/" />; // Redirigir si no hay token

  try {
    const decoded = jwtDecode(token);
    const userRole = decoded.id_tipo_usuario; // Obtener el rol del usuario

    if (allowedRoles.includes(userRole)) {
      return <Outlet />;
    } else {
      localStorage.removeItem("token"); // Remueve el token si no está autorizado
      return <Navigate to="/" />;
    }
  } catch (error) {
    console.error("Error al decodificar el token", error);
    return <Navigate to="/" />;
  }
};

export default PrivateRoute;
