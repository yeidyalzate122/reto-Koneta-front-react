import React, { useEffect, useState } from 'react';
import AlertContent from '../../content/AlertContent';
import { useNavigate } from "react-router-dom";
import Navbar from '../NavBar/NavBar';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from "@mui/material/Button";
import '../Users/FormUser.css'
import PersonIcon from '@mui/icons-material/Person';
import { object, string } from "yup";
import IconButton from '@mui/material/IconButton'; // Importa IconButton
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CircularProgress from '@mui/material/CircularProgress';

const FormUser = () => {
    const [tipoUsuario, setTipoUsuario] = useState('');
    const [selecttipoUsuario, setSelectTipoUsuario] = useState([]); // Inicializado como array vacío
    const [nombre, setNombre] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [fechaCreacion, setFechaCreacion] = useState('');
    const [correoElectronico, setCorreoElectronico] = useState('');
    const [loanding, setLoading] = useState(false)

    const [tipoUsuarioError, setTipoUsuarioError] = useState('');
    const [nombreError, setNombreError] = useState('');
    const [contrasenaError, setContrasenaError] = useState('');
    const [fechaCreacionError, setFechaCreacionError] = useState('');
    const [correoElectronicoError, setCorreoElectronicoError] = useState('');
    const [fetchError, setFetchError] = useState('');
    const [severity, setSeverity] = useState('');


    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setTipoUsuarioError('');
            setNombreError('');
            setContrasenaError('');
            setFechaCreacionError('')
            setCorreoElectronicoError('')
            setFetchError('')
            setSeverity('')
        }, 1000);
        return () => clearTimeout(timer);
    }, [severity, fetchError, tipoUsuarioError, nombreError, contrasenaError, fechaCreacionError, correoElectronicoError]);

    // console.log('tipoUsuarioError:', tipoUsuarioError);
    const buttonAlert = async (e) => {
        e.preventDefault();

        let todoCorrecto = true;
        const loginSchema = object({
            nombre: string().required("El campo es obligatorio").max(50, "El campo debe tener maximo 50 caracteres"),
            correoElectronico: string("El campo debe ser un texto")
                .email("El campo debe contener un correo valido")
                .required("El campo es obligatorio")
                .max(50, "El campo debe tener maximo 50 caracteres"),
            contrasena: string().required("El campo es obligatorio").max(20, "El campo debe tener maximo 20 caracteres"),
            fechaCreacion: string().required("El campo es obligatorio"),
            idTipoTsuarios: string().required("El campo es obligatorio")
        });

        try {
            await loginSchema.validate({
                nombre: nombre,
                correoElectronico: correoElectronico,
                contrasena: contrasena,
                fechaCreacion: fechaCreacion,
                idTipoTsuarios: tipoUsuario
            }, { abortEarly: false });

            setNombreError('');
            setCorreoElectronicoError('');
            setContrasenaError('');
            setFechaCreacionError('');
            setTipoUsuarioError('');

        } catch (error) {
            todoCorrecto = false;
            const newErrors = {};
            error.inner.forEach((e) => {
                newErrors[e.path] = e.message;
            });

            setNombreError(newErrors.nombre || '');
            setCorreoElectronicoError(newErrors.correoElectronico || '');
            setContrasenaError(newErrors.contrasena || '');
            setFechaCreacionError(newErrors.fechaCreacion || '');
            setTipoUsuarioError(newErrors.idTipoTsuarios || '');
        }
        if (todoCorrecto) {
            try {
                handdleRegistro();
            } catch (error) {
                console.log(error);
            }

        }

    }


    const handdleRegistro = (e) => {
        const data = {
            nombre: nombre,
            correoElectronico: correoElectronico,
            contrasena: contrasena,
            fechaCracion: fechaCreacion,
            idTipoTsuarios: tipoUsuario

        }

        fetch('http://localhost:5000/api/v1/users/registrarUsuario', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(result => {
              //  console.log(result);

                if (result.severity == "error") {
                    setSeverity(result.severity)
                    setFetchError(result.message);
                } else {
                    setLoading(true)
                    setTimeout(() => {

                        navigate("/ListaUser");
                    }, 3000);
                    // setLoading(false)
                    setSeverity('success')
                    setFetchError(result.message || "Usuario registrado.");
                }

            })
            .catch(error => {
                console.log(error);
                setSeverity('error')
                setFetchError(error || "Error al guardar al usuario");
            });

    }
    useEffect(() => {
        fetch("http://localhost:5000/api/v1/users/roles", {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }) // Reemplaza con tu endpoint real
            .then((response) => response.json())
            .then((data) => setSelectTipoUsuario(data)) // Guarda los datos en el estado
            .catch((error) => console.error("Error al cargar datos:", error));
    }, []);
    return (
        <>
            <Navbar />
            <div id='wrapperr'>
                <form id='formulario'>
                    <h1>Formulario de registro de usuarios</h1>
                    <div className="form-container">
                        <div className="form-group">
                            <TextField
                                id="outlined-basic"
                                label="Nombre"
                                variant="outlined"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                error={!!nombreError}
                                helperText={nombreError}
                            />
                        </div>
                        <div className="form-group">
                            <TextField
                                id="outlined-basic"
                                label="Correo electrónico"
                                type='text'
                                variant="outlined"
                                value={correoElectronico}
                                onChange={(e) => setCorreoElectronico(e.target.value)}
                                error={!!correoElectronicoError}
                                helperText={correoElectronicoError}
                            />
                        </div>
                        <div className="form-group">
                            <TextField
                                id="outlined-basic"
                                label="Contraseña"
                                type={showPassword ? 'text' : 'password'} // Cambia el tipo dinámicamente
                                variant="outlined"
                                value={contrasena}
                                onChange={(e) => setContrasena(e.target.value)}
                                error={!!contrasenaError}
                                helperText={contrasenaError}
                                InputProps={{
                                    endAdornment: (
                                        <IconButton onClick={handleTogglePassword} edge="end">
                                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                    ),
                                }}
                            />
                        </div>
                        <div className="form-group">
                            <TextField
                                id="outlined-basic"
                                label="Fecha de creación"
                                type="datetime-local"  // Permite seleccionar fecha y hora
                                InputLabelProps={{ shrink: true }}
                                variant="outlined"
                                value={fechaCreacion}
                                onChange={(e) => setFechaCreacion(e.target.value)}
                                error={!!fechaCreacionError}
                                helperText={fechaCreacionError}
                            />
                        </div>
                        <div className="form-group">
                            <FormControl fullWidth error={!!tipoUsuarioError}>
                                <InputLabel id="demo-simple-select-label">Tipo de usuario</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={tipoUsuario}
                                    onChange={(event) => setTipoUsuario(event.target.value)}
                                >
                                    {selecttipoUsuario.map((option) => (
                                        <MenuItem key={option.id_tipo_usuario} value={option.id_tipo_usuario}>
                                            {option.tipo_usuario}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {tipoUsuarioError && <div style={{ color: 'red', fontSize: 12 }}>{tipoUsuarioError}</div>}
                            </FormControl>
                        </div>
                    </div>
                    <div className='button'>
                        <Button variant="contained" onClick={buttonAlert} disabled={loanding}
                        >
                            {loanding ? (
                                <CircularProgress color="warning" size={24} />
                            ) : (
                                <>
                                     <PersonIcon /> Guardar usuario
                                </>
                            )}
                           
                        </Button>
                    </div>
                    {fetchError && (
                        <AlertContent
                            message={fetchError}
                            severity={severity}
                        />
                    )}
                </form>
            </div>
        </>
    );
}

export default FormUser;
