import React, { useEffect, useState } from "react";
import AlertContent from '../../content/AlertContent';
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Navbar from "../NavBar/NavBar";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import "../Users/FormUser.css";
import PersonIcon from "@mui/icons-material/Person";
import { object, string } from "yup";
import IconButton from '@mui/material/IconButton'; // Importa IconButton
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CircularProgress from '@mui/material/CircularProgress';

const FormUserUpdate = () => {
    const { id } = useParams();
    const [contrasena, setContrasena] = useState("");


    const [formData, setFormData] = useState({
        nombre: "",
        correoElectronico: "",
        fechaCreacion: "",
        fechaActualizacion: "",
        tipoUsuario: "",
    });


    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };
    const [loanding, setLoading] = useState(false)
    const [tipoUsuarioError, setTipoUsuarioError] = useState('');
    const [nombreError, setNombreError] = useState('');
    const [contrasenaError, setContrasenaError] = useState('');
    const [fechaCreacionError, setFechaCreacionError] = useState('');
    const [fechaActualizaError, setfechaActualizaError] = useState('');
    const [correoElectronicoError, setCorreoElectronicoError] = useState('');
    const [fetchError, setFetchError] = useState('');
    const [severity, setSeverity] = useState('');



    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            setfechaActualizaError('')
            setTipoUsuarioError('');
            setNombreError('');
            setContrasenaError('');
            setFechaCreacionError('')
            setCorreoElectronicoError('')
            setFetchError('')
            setSeverity('')
        }, 1000);
        return () => clearTimeout(timer);
    }, [severity, fechaActualizaError, fetchError, tipoUsuarioError, nombreError, contrasenaError, fechaCreacionError, correoElectronicoError]);

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
            contrasena: string().max(20, "El campo debe tener maximo 20 caracteres"),
            fechaCreacion: string().required("El campo es obligatorio"),
            fechaActualizacion: string().required("El campo es obligatorio"),
            idTipoTsuarios: string().required("El campo es obligatorio")


        });

        try {
            await loginSchema.validate({
                nombre: formData.nombre,
                correoElectronico: formData.correoElectronico,
                contrasena: contrasena,
                fechaCreacion: formData.fechaCreacion,
                fechaActualizacion: formData.fechaActualizacion,
                idTipoTsuarios: formData.tipoUsuario
            }, { abortEarly: false });

            setNombreError('');
            setCorreoElectronicoError('');
            setContrasenaError('');
            setFechaCreacionError('');
            setTipoUsuarioError('');
            setfechaActualizaError('')

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
            setfechaActualizaError(newErrors.fechaActualizacion || '')
        }
        if (todoCorrecto) {
            try {
                handleSubmit();
            } catch (error) {
                console.log(error);
            }

        }

    }



    const [selectTipoUsuario, setSelectTipoUsuario] = useState([]);

    // Cargar los datos del usuario para edición
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/v1/users/usuario/${id}`, {
                    method: "GET",
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                });

                const data = await response.json();
                setFormData({
                    nombre: data.nombre || "",
                    correoElectronico: data.correo_electronico || "",
                    fechaCreacion: data.fecha_cracion ? data.fecha_cracion.slice(0, 16) : "",
                    fechaActualizacion: data.fecha_actualizacion ? data.fecha_actualizacion.slice(0, 16) : "",
                    tipoUsuario: data.id_tipo_usuario || "",
                });

             //   console.log(data);

            } catch (error) {
                console.error("Error al cargar los datos del usuario:", error);
            }
        };
        fetchUserData();
    }, [id]);

    // Cargar opciones del select
    useEffect(() => {
        fetch("http://localhost:5000/api/v1/users/roles", {
            method: "GET",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        })
            .then((response) => response.json())
            .then((data) => setSelectTipoUsuario(data))
            .catch((error) => console.error("Error al cargar los tipos de usuario:", error));
    }, []);

    // Manejar cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        //e.preventDefault();

        // Crear una copia de formData y solo agregar la contraseña si tiene datos
        const updatedData = { ...formData };
        if (contrasena.trim() !== "") {
            updatedData.contrasena = contrasena;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/v1/users/atualizarUsuarios/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
                body: JSON.stringify(updatedData),
            });

        //    console.log("Datos enviados:", updatedData);

            const result = await response.json();
         //   console.log("Respuesta del servidor:", result);



            if (result.severity == "error") {
                setSeverity(result.severity)
                setFetchError(result.message);
            } else {
                setLoading(true)
                setTimeout(() => {
                    
                    navigate("/ListaUser");
                }, 3000);
              //  setLoading(false)
                setSeverity('success')
                setFetchError(result.message || "Usuario registrado.");
            }

        } catch (error) {
            console.error("Error al actualizar el usuario:", error);
        }
    };

    return (
        <>
            <Navbar />
            <div id="wrapperr">
                <form id="formulario" onSubmit={buttonAlert}>
                    <h1>Formulario de actualización de usuarios</h1>
                    <div className="form-container">
                        <div className="form-group">
                            <TextField
                                label="Nombre"
                                variant="outlined"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                error={!!nombreError}
                                helperText={nombreError}
                                fullWidth
                            />
                        </div>
                        <div className="form-group">
                            <TextField
                                label="Correo electrónico"
                                variant="outlined"
                                name="correoElectronico"
                                value={formData.correoElectronico}
                                onChange={handleChange}
                                error={!!correoElectronicoError}
                                helperText={correoElectronicoError}
                                fullWidth
                            />
                        </div>
                        <div className="form-group">
                            <TextField
                                label="Contraseña"
                                type={showPassword ? 'text' : 'password'} // Cambia el tipo dinámicamente
                                variant="outlined"
                                name="contrasena"
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
                                fullWidth
                            />
                        </div>
                        <div className="form-group">
                            <TextField

                                label="Fecha de creación"
                                type="datetime-local"
                                InputLabelProps={{ shrink: true }}
                                variant="outlined"
                                name="fechaCreacion"
                                value={formData.fechaCreacion}
                                onChange={handleChange}
                                error={!!fechaCreacionError}
                                helperText={fechaCreacionError}
                                fullWidth
                            />
                        </div>
                        <div className="form-group">
                            <TextField
                                label="Fecha de actualización"
                                type="datetime-local"
                                InputLabelProps={{ shrink: true }}
                                variant="outlined"
                                name="fechaActualizacion"
                                value={formData.fechaActualizacion}
                                onChange={handleChange}
                                error={!!fechaActualizaError}
                                helperText={fechaActualizaError}
                                fullWidth
                            />
                        </div>
                        <div className="form-group">
                            <FormControl fullWidth>
                                <InputLabel>Tipo de usuario</InputLabel>
                                <Select name="tipoUsuario"
                                    value={formData.tipoUsuario}
                                    onChange={handleChange}>
                                    {selectTipoUsuario.map((option) => (
                                        <MenuItem key={option.id_tipo_usuario} value={option.id_tipo_usuario}>
                                            {option.tipo_usuario}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {tipoUsuarioError && <div style={{ color: 'red', fontSize: 12 }}>{tipoUsuarioError}</div>}
                            </FormControl>
                        </div>
                    </div>
                    <div className="button">
                        <Button variant="contained" type="submit" disabled={loanding}
                        >
                            {loanding ? (
                                <CircularProgress color="warning" size={24} />
                            ) : (
                                <>
                                   <PersonIcon /> Actualizar usuario
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
};

export default FormUserUpdate;
