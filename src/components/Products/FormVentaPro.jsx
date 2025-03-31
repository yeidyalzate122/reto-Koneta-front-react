import React, { useEffect, useState } from 'react';
import Navbar from '../NavBar/NavBar';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from "@mui/material/Button";
import '../Users/FormUser.css'
import SaveAsIcon from '@mui/icons-material/SaveAs';
import { object, string } from "yup";
import AlertContent from '../../content/AlertContent';
import { useNavigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';


const FormVentaPro = () => {

    const [loanding, setLoading] = useState(false)
    const [selectProducto, setSelectProducto] = useState([]); // Inicializado como array vacío
    const [selectFranquicia, setSelectFranquicia] = useState([]); // Inicializado como array vacío
    const [selectUsuario, setSelectUsuario] = useState([]); // Inicializado como array vacío

    const [cupo, setCupo] = useState('');
    const [tasa, setTasa] = useState('');
    const [idTipoProducto, setTdTipoProducto] = useState('');
    const [idFranquicia, setIdFranquicia] = useState('');
    const [fechaVenta, setFechaVenta] = useState('');
    const [idUsuario, setidUsuario] = useState('');


    const [cupoError, setcupoError] = useState('');
    const [tasaError, setTasaError] = useState('');
    const [idTipoProductoError, setTdTipoProductoError] = useState('');
    const [idFranquiciaError, setIdFranquiciaError] = useState('');
    const [fechaVentaError, setFechaVentaError] = useState('');
    const [idUsuarioError, setidUsuarioError] = useState('');

    const [fetchError, setFetchError] = useState('');
    const [severity, setSeverity] = useState('');

    const [tasaVisible, setTasaVisible] = useState(false);

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
            setIdFranquiciaError('')
            setFechaVentaError('')
            setidUsuarioError('')
            setFetchError('')
            setSeverity('')
         //   setTasaVisible(false)
        }, 1000);
        return () => clearTimeout(timer);
    }, [severity, fetchError, cupoError, tasaError,
        idTipoProductoError, idFranquiciaError, fechaVentaError, idUsuarioError]);


    const buttonAlert = async (e) => {
        e.preventDefault();

        let todoCorrecto = true;
        const loginSchema = object({

            cupo: string().required("El campo es obligatorio").max(20, "El campo debe tener maximo 20 caracteres"),
            ...(tasaVisible ? { tasa: string().required("El campo es obligatorio") } : {}),
            idTipoProducto: string().required("El campo es obligatorio"),
            idFranquicia: string().required("El campo es obligatorio"),
            fechaVenta: string().required("El campo es obligatorio"),
            idUsuario: string().required("El campo es obligatorio")

        });

        try {
            await loginSchema.validate({
                cupo: cupo,
                tasa: tasa,
                idTipoProducto: idTipoProducto,
                idFranquicia: idFranquicia,
                fechaVenta: fechaVenta,
                idUsuario: idUsuario
            }, { abortEarly: false });

            setcupoError('');
            setTasaError('');
            setTdTipoProductoError('');
            setIdFranquiciaError('')
            setFechaVentaError('')
            setidUsuarioError('')

        } catch (error) {
            todoCorrecto = false;
            const newErrors = {};
            error.inner.forEach((e) => {
                newErrors[e.path] = e.message;
            });

            setcupoError(newErrors.cupo || '');
            setTasaError(newErrors.tasa || '');
            setTdTipoProductoError(newErrors.idTipoProducto || '');
            setIdFranquiciaError(newErrors.idFranquicia || '')
            setFechaVentaError(newErrors.fechaVenta || '')
            setidUsuarioError(newErrors.idUsuario || '')


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
            cupo: cupo,
            tasa: tasa,
            idTipoProducto: idTipoProducto,
            idFranquicia: idFranquicia,
            fechaVenta: fechaVenta,
            idUsuario: idUsuario
        }

       // console.log("DATA", data);


        fetch('http://localhost:5000/api/v1/venProc/venta', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(result => {
             //   console.log(result);
                if (result.severity == "error" || result.type == "error") {
                    setSeverity(result.severity)
                    setFetchError(result.message);
                } else {
                    setLoading(true)
                    setTimeout(() => {
                       
                        navigate("/ListVentaPro");
                    }, 3000);
                    //setLoading(false)
                    setSeverity('success')
                    setFetchError(result.message || "Venta registrado.");
                }

            })
            .catch(error => {
                console.log(error);
                setSeverity('error')
                setFetchError(error || "Error al guardar al usuario");
            });


    }
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
    }, []);

    return (
        <>
            <Navbar />
            <div id='wrapperr'>
                <form id='formulario'>
                    <h1>Formulario de registro de venta</h1>
                    <div className="form-container">

                        <div className="form-group">
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Producto</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={idTipoProducto}
                                    onChange={(event) => {
                                        setTdTipoProducto(event.target.value); // Actualiza el estado
                                        handleProductoChange(event); // Llama a la segunda función
                                    }}


                                    error={!!idTipoProductoError}
                                    helperText={idTipoProductoError}
                                >
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
                                    value={idFranquicia}
                                    onChange={(event) => setIdFranquicia(event.target.value)}
                                    error={!!idFranquiciaError}
                                    helperText={idFranquiciaError}
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
                                    value={idUsuario}
                                    onChange={(event) => setidUsuario(event.target.value)}
                                    error={!!idUsuarioError}
                                    helperText={idUsuarioError}
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
                                value={cupo}
                                onChange={(e) => setCupo(e.target.value)}
                                error={!!cupoError}
                                helperText={cupoError}
                            />
                        </div>
                        {tasaVisible && (
                            <div className="form-group">
                                <TextField
                                    id="outlined-basic"
                                    label="Tasa"
                                    variant="outlined"
                                    value={tasa}
                                    onChange={(e) => setTasa(e.target.value)}
                                    error={!!tasaError}
                                    helperText={tasaError}
                                />
                            </div>
                        )}
                        <div className="form-group">
                            <TextField
                                id="outlined-basic"
                                label="Fecha de venta"
                                type="datetime-local"  // Permite seleccionar fecha y hora
                                InputLabelProps={{ shrink: true }}
                                variant="outlined"
                                value={fechaVenta}
                                error={!!fechaVentaError}
                                helperText={fechaVentaError}
                                onChange={(e) => setFechaVenta(e.target.value)}
                            />
                        </div>

                    </div>
                    <div className='button'>
                        <Button
                            variant="contained"
                            onClick={buttonAlert}
                            disabled={loanding}
                        >
                            {loanding ? (
                                <CircularProgress color="warning" size={24} />
                            ) : (
                                <>
                                    <SaveAsIcon /> Guardar venta
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

export default FormVentaPro;
