
import { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode"
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import {  Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText,  Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import GroupIcon from '@mui/icons-material/Group';
import ReceiptIcon from '@mui/icons-material/Receipt';


export default function NavListDrawer() {

    const [gestionUsuarios, setGestionUsuarios] = useState(false);
    const navigate = useNavigate(); // Hook para la navegación
    //cerrar session
    const handleLogout = () => {
        localStorage.removeItem("token"); // Elimina el token
        window.location.href = "/"; // Redirige al login
    };

    useEffect(() => {
        // Obtener token de localStorage
        const token = localStorage.getItem("token");

        if (token) {
            try {
                // Decodificar token
                const decodedToken = jwtDecode(token);
                
                // Validar id_tipo_usuario
                if (decodedToken.id_tipo_usuario === 1) {
                    setGestionUsuarios(true);
                }
            } catch (error) {
                console.error("Error al decodificar el token:", error);
                localStorage.removeItem("token"); // Eliminar token inválido
            }
        }
    }, []);


    return (
        <Box sx={{
            width: 250,
            backgroundImage: 'url(../../image/fond.jpeg)', // Reemplaza con la ruta de tu imagen
            backgroundSize: 'cover', // Ajusta el tamaño de la imagen
            backgroundRepeat: 'no-repeat', // Evita que la imagen se repita
        }}>


            <nav>
             
                <Divider></Divider>
                <List>
                     {/* Renderizar solo si showGestionUsuarios es true */}
                     {gestionUsuarios && (
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => navigate("/ListaUser")}>
                            <ListItemIcon>
                                <GroupIcon />
                            </ListItemIcon>
                            <ListItemText primary="Gestionar usuarios" />
                        </ListItemButton>
                    </ListItem>
                )}

                    <ListItem disablePadding>
                        <ListItemButton onClick={() => navigate("/ListVentaPro")}>
                            <ListItemIcon>
                                <ReceiptIcon />
                            </ListItemIcon>
                            <ListItemText primary="Radicar venta" />
                        </ListItemButton>
                    </ListItem>


                </List>
            </nav>
            <Divider></Divider>
            <nav>

                <List>
                    <ListItem disablePadding component="a" href="#">
                        <ListItemButton onClick={handleLogout}><CloseIcon></CloseIcon>Cerrar Sesión</ListItemButton>
                    </ListItem>
                </List>
            </nav>

        </Box >
    );
}
