import React, { useEffect, useState } from 'react';
import Navbar from '../NavBar/NavBar';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from "@mui/material/Button";
import '../Users/FormUser.css'
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { useParams } from "react-router-dom"
import AlertContent from '../../content/AlertContent';
import { useNavigate } from "react-router-dom";
import { object, string } from "yup";
import CircularProgress from '@mui/material/CircularProgress';

const FormModVentaPro = () => {

    const { id } = useParams();

    const [selectProducto, setSelectProducto] = useState([]); // Inicializado como array vacío
    const [selectFranquicia, setSelectFranquicia] = useState([]); // Inicializado como array vacío
    const [selectUsuario, setSelectUsuario] = useState([]); // Inicializado como array vacío
    const [selectUsuarioActua, setSelectUsuarioActua] = useState([]); // Inicializado como array vacío

    const [loanding, setLoading] = useState(false)
    const [cupoError, setcupoError] = useState('');
    const [tasaError, setTasaError] = useState('');
    const [idTipoProductoError, setTdTipoProductoError] = useState('');
    const [idFranquiciaError, setIdFranquiciaError] = useState('');
    const [fechaVentaError, setFechaVentaError] = useState('');
    const [idUsuarioError, setidUsuarioError] = useState('');
    const [idUsuarioActuaError, setidUsuarioActuaError] = useState('');
    const [fechaVentaActuaError, setFechaVentaActuaError] = useState(''); // Corregido el nombre del estado
    const [fetchError, setFetchError] = useState('');
    const [severity, setSeverity] = useState('');

    const [idTipoProducto, setTdTipoProducto] = useState('');

    const [tasaVisible, setTasaVisible] = useState(true);

    const navigate = useNavigate();

    const handleProductoChange = (event) => {
        const selectedValue = event.target.value;
        setTdTipoProducto(selectedValue);
        const selectedProduct = selectProducto.find(product => product.id_tipo_producto === selectedValue);
        if (selectedProduct) {
            setTasaVisible(selectedProduct.tipo_producto === "Credito de Consumo" || selectedProduct.tipo_producto === "Libranza Libre Inversión");
        } else {
            setTasaVisible(false);
        }
    };


    useEffect(() => {
        const timer = setTimeout(() => {
            setcupoError('');
            setTasaError('');
            setTdTipoProductoError('');
            setIdFranquiciaError('');
            setFechaVentaError('');
            setidUsuarioError('');
            setidUsuarioActuaError('');
            setFechaVentaActuaError(''); // Corregido el nombre de la función
            setFetchError('');
            setSeverity('');
            setTasaVisible(false)
        }, 1000);
        return () => clearTimeout(timer);
    }, [
        cupoError,
        tasaError,
        idTipoProductoError,
        idFranquiciaError,
        fechaVentaError,
        idUsuarioError,
        idUsuarioActuaError,
        fechaVentaActuaError, // Corregido el nombre de la dependencia
        fetchError,
        severity,
    ]);


    const buttonAlert = async (e) => {
        e.preventDefault();

        let todoCorrecto = true;
        const loginSchema = object({
            cupo: string().required("El campo es obligatorio").max(20, "El campo debe tener maximo 20 caracteres"),
            ...(tasaVisible ? { tasa: string().required("El campo es obligatorio") } : {}),
            idTipoProducto: string().required("El campo es obligatorio"),
            idFranquicia: string().required("El campo es obligatorio"),
            idUsuarioVenta: string().required("El campo es obligatorio"),
            idUsuarioActualizacion: string().required("El campo es obligatorio"),
            fechaActualizacion: string().required("El campo es obligatorio"),

        });

        try {
            await loginSchema.validate({
                cupo: formData.cupo,
                tasa: formData.tasa,
                idTipoProducto: formData.idTipoProducto,
                idFranquicia: formData.idFranquicia,
                fechaVenta: formData.fechaVenta,
                idUsuarioVenta: formData.idUsuario,
                idUsuarioActualizacion: formData.idUsuarioActualizar,
                fechaActualizacion: formData.fechaActalizada
            }, { abortEarly: false });

            setcupoError('');
            setTasaError('');
            setTdTipoProductoError('');
            setIdFranquiciaError('');
            setFechaVentaError('');
            setidUsuarioError('');
            setidUsuarioActuaError('');
            setFechaVentaActuaError(''); // Corregido el nombre de la función
            setFetchError('');
            setSeverity('');

        } catch (error) {
            todoCorrecto = false;
            const newErrors = {};
            error.inner.forEach((e) => {
                newErrors[e.path] = e.message;
            });

            setcupoError(newErrors.cupo);
            setTasaError(newErrors.tasa);
            setTdTipoProductoError(newErrors.idTipoProducto);
            setIdFranquiciaError(newErrors.idFranquicia);
            setFechaVentaError(newErrors.fechaVenta);
            setidUsuarioError(newErrors.idUsuarioVenta);
            setidUsuarioActuaError(newErrors.idUsuarioActualizacion);
            setFechaVentaActuaError(newErrors.fechaActualizacion);


        }
        if (todoCorrecto) {
            try {
                handleActualizar();
            } catch (error) {
                console.log(error);
            }

        }

    }



    const [formData, setFormData] = useState({
        idVenta: "",
        tipoProducto: "",
        cupo: "",
        tasa: "",
        fechaVenta: "",
        asesorVenta: "",
        fechaActalizada: "",
        asesorActualizado: "",
        franquicia: "",
        idUsuario: "",
        idProducto: "",
        idActualizacionVenta: "",
        idUsuarioActualizar: "",
        idTipoProducto: "",
        idFranquicia: ""
    });

    //llenar los formularios
    // Cargar los datos del usuario para edición
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/v1/venProc/ventaId/${id}`, {
                    method: "GET",
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                });

                const data = await response.json();
                setFormData(
                    {
                        idVenta: data[0].id_venta,
                        tipoProducto: data[0].tipo_producto,
                        cupo: data[0].cupo,
                        tasa: data[0].tasa,
                        fechaVenta: data[0].fecha_venta ? data[0].fecha_venta.slice(0, 16) : "",
                        asesorVenta: data[0].asesorventa,
                        fechaActalizada: data[0].fecha_actalizada ? data[0].fecha_actalizada.slice(0, 16) : "",
                        asesorActualizado: data[0].asesoractualizado,
                        franquicia: data[0].franquicia,
                        idUsuario: data[0].id_usuario,
                        idProducto: data[0].id_producto,
                        idActualizacionVenta: data[0].id_actualizacion_venta,
                        idUsuarioActualizar: data[0].idusuarioactualizar,
                        idTipoProducto: data[0].id_tipo_producto,
                        idFranquicia: data[0].id_franquicia
                    }
                );
                //  handleProductoChange({ target: { value: data[0].id_tipo_producto } });
              //  console.log(data);

            } catch (error) {
                console.error("Error al cargar los datos del usuario:", error);
            }
        };
        fetchUserData();
    }, [id]);

    // Manejar cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    //actualizar los datos
    const handleActualizar = (e) => {
        //     e.preventDefault()

        const data = {
            idVenta: parseInt(id),
            cupo: formData.cupo,
            tasa: formData.tasa,
            idTipoProducto: formData.idTipoProducto,
            idFranquicia: formData.idFranquicia,
            fechaVenta: formData.fechaVenta,
            idUsuarioVenta: formData.idUsuario,
            idUsuarioActualizacion: formData.idUsuarioActualizar,
            fechaActualizacion: formData.fechaActalizada
        }

      //  console.log(data);


        fetch(`http://localhost:5000/api/v1/venProc/venta/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(result => {
             //   console.log(result);

                if (result.severity == "error") {
                    setSeverity(result.severity)
                    setFetchError(result.message);
                } else {
                    setLoading(true)
                    setTimeout(() => {
                       
                        navigate("/ListVentaPro");
                    }, 3000);
                   // setLoading(false)
                    setSeverity('success')
                    setFetchError(result.message || "Usuario registrado.");
                }


            })
            .catch(error => {
                console.log(error);
                console.log(error);
                setSeverity('error')
                setFetchError(error || "Error al guardar al usuario");
            });


    }

    //llenar campos en las listas desplegables
    useEffect(() => {
        // Llamada a la API al montar el componente
        //Api de franquicia
        fetch("http://localhost:5000/api/v1/venProc/franquicia", {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then((response) => response.json())
            .then((data) => setSelectFranquicia(data))
            .catch((error) => console.error("Error al cargar datos:", error));


        //Api de producto
        fetch("http://localhost:5000/api/v1/venProc/tipoProducto", {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then((response) => response.json())
            .then((data) => setSelectProducto(data))
            .catch((error) => console.error("Error al cargar datos:", error));

        //Api de usuarios
        fetch("http://localhost:5000/api/v1/users/usuarios", {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then((response) => response.json())
            .then((data) => setSelectUsuario(data))
            .catch((error) => console.error("Error al cargar datos:", error));

        //Api usuario actualizacion 
        fetch("http://localhost:5000/api/v1/users/usuarios", {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then((response) => response.json())
            .then((data) => setSelectUsuarioActua(data))
            .catch((error) => console.error("Error al cargar datos:", error));
    }, []);



    return (
        <>
            <Navbar />
            <div id='wrapperr'>
                <form id='formulario' onSubmit={buttonAlert}>
                    <h1>Formulario de actualización de venta</h1>
                    <div className="form-container">

                        <div className="form-group">
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Producto</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={formData.idTipoProducto}
                                    onChange={(e) => {
                                        handleChange({ target: { name: 'idTipoProducto', value: e.target.value } }); // Actualiza el estado
                                        // handleProductoChange({ target: { name: 'idTipoProducto', value: e.target.value } }); // Llama a la segunda función
                                    }}

                                    name="idTipoProducto">
                                    {selectProducto.map((option) => (
                                        <MenuItem key={option.id_tipo_producto} value={option.id_tipo_producto}>
                                            {option.tipo_producto}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {idTipoProductoError && <div style={{ color: 'red', fontSize: 12 }}>{idTipoProductoError}</div>}
                            </FormControl>
                        </div>

                        <div className="form-group">
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Franquicia</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={formData.idFranquicia}
                                    onChange={(e) => handleChange({ target: { name: 'idFranquicia', value: e.target.value } })}
                                    name="idFranquicia"

                                >
                                    {selectFranquicia.map((option) => (
                                        <MenuItem key={option.id_franquicia} value={option.id_franquicia}>
                                            {option.franquicia}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {idFranquiciaError && <div style={{ color: 'red', fontSize: 12 }}>{idFranquiciaError}</div>}
                            </FormControl>
                        </div>
                        <div className="form-group">
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Usuario que registra la venta</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={formData.idUsuario}
                                    onChange={(e) => handleChange({ target: { name: 'idUsuario', value: e.target.value } })}
                                    name="idUsuario"
                                >
                                    {selectUsuario.map((option) => (
                                        <MenuItem key={option.id_usuario} value={option.id_usuario}>
                                            {option.nombre}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {idUsuarioError && <div style={{ color: 'red', fontSize: 12 }}>{idUsuarioError}</div>}
                            </FormControl>
                        </div>

                        <div className="form-group">
                            <TextField
                                id="outlined-basic"
                                label="Cupo"
                                variant="outlined"
                                value={formData.cupo}
                                onChange={(e) => handleChange({ target: { name: 'cupo', value: e.target.value } })}
                                name="cupo"
                                error={!!cupoError}
                                helperText={cupoError}
                            />
                        </div>


                        <div className="form-group">
                            <TextField
                                id="outlined-basic"
                                label="Tasa"
                                variant="outlined"
                                value={formData.tasa}
                                onChange={(e) => handleChange({ target: { name: 'tasa', value: e.target.value } })}
                                name="tasa"
                                error={!!tasaError}
                                helperText={tasaError}
                            />
                        </div>

                        <div className="form-group">
                            <TextField
                                id="outlined-basic"
                                label="Fecha de venta"
                                type="datetime-local"  // Permite seleccionar fecha y hora
                                InputLabelProps={{ shrink: true }}
                                variant="outlined"
                                value={formData.fechaVenta}
                                onChange={(e) => handleChange({ target: { name: 'fechaVenta', value: e.target.value } })}
                                name="fechaVenta"
                                error={!!fechaVentaError}
                                helperText={fechaVentaError}

                            />
                        </div>
                        <div className="form-group">
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Usuario que actualiza</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={formData.idUsuarioActualizar}
                                    onChange={(e) => handleChange({ target: { name: 'idUsuarioActualizar', value: e.target.value } })}
                                    name="idUsuarioActualizar"

                                >
                                    {selectUsuarioActua.map((option) => (
                                        <MenuItem key={option.id_usuario} value={option.id_usuario}>
                                            {option.nombre}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {idUsuarioActuaError && <div style={{ color: 'red', fontSize: 12 }}>{idUsuarioActuaError}</div>}
                            </FormControl>
                        </div>
                        <div className="form-group">
                            <TextField
                                id="outlined-basic"
                                label="Fecha de actualización"
                                type="datetime-local"  // Permite seleccionar fecha y hora
                                InputLabelProps={{ shrink: true }}
                                variant="outlined"
                                value={formData.fechaActalizada}
                                onChange={(e) => handleChange({ target: { name: 'fechaActalizada', value: e.target.value } })}
                                name="fechaActalizada"
                                error={!!fechaVentaActuaError}
                                helperText={fechaVentaActuaError}
                            />
                        </div>
                    </div>
                    <div className='button'>
                        <Button variant="contained" type="submit" disabled={loanding} >

                            {loanding ? (
                                <CircularProgress color="warning" size={24} />
                            ) : (
                                <>
                                    <BorderColorIcon></BorderColorIcon> Actualizar venta
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

export default FormModVentaPro;
