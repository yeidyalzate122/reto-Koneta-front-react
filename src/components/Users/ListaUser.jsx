import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { Button, Container } from '@mui/material';
import Navbar from '../NavBar/NavBar';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import '../Users/ListaUser.css';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '../../content/ConfirmDialog';

const paginationModel = { page: 0, pageSize: 5 };

export default function ListaUser() {
    const [usuarios, setUsuarios] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const navigate = useNavigate();

    const handleOpenDialog = (id) => {
        setSelectedUserId(id);
        setOpenDialog(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedUserId !== null) {
            await handleDelete(selectedUserId);
            setOpenDialog(false);
        }
    };

    const columns = [
        { field: 'id_usuario', headerName: 'ID', width: 10 },
        { field: 'nombre', headerName: 'Nombre Completo', width: 150 },
        { field: 'correo_electronico', headerName: 'Correo Electrónico', width: 250 },
        { field: 'fecha_cracion', headerName: 'Fecha Creación', width: 200 },
        { field: 'fecha_actualizacion', headerName: 'Fecha Actualización', width: 200 },
        { field: 'tipo_usuario', headerName: 'Tipo de Usuario', width: 100 },
        {
            field: 'acciones',
            headerName: 'Acciones',
            width: 200,
            renderCell: (params) => (
                <div>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => navigate(`/FormUserUpdate/${params.row.id_usuario}`)}
                    >
                        <BorderColorIcon />
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        style={{ marginLeft: 8 }}
                        onClick={() => handleOpenDialog(params.row.id_usuario)}
                    >
                        <DeleteForeverIcon />
                    </Button>
                </div>
            )
        }
    ];

    const loadUsuarios = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/v1/users/usuarios', {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            });
            const data = await res.json();
          //  console.log("Datos recibidos:", data);
            if (Array.isArray(data)) {
                setUsuarios(data);
            } else {
                console.error("Error: Los datos no son un array", data);
            }
        } catch (error) {
            console.error("Error cargando usuarios:", error);
        }
    };

    useEffect(() => {
        loadUsuarios();
    }, []);

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/v1/users/usuarios/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const res = await response.json();
         //   console.log("Usuario eliminado:", res);

            alert(res.message)
            setUsuarios(usuarios.filter(user => user.id_usuario !== id));
        } catch (error) {
            alert('No se elimina usuario si tiene una venta asociada')
            console.error("Error eliminando usuario:", error);
        }
    };

    return (
        <Container>
            <Navbar />
            <h1>Lista de usuarios</h1>
            <Button
                id="button"
                variant="contained"
                onClick={() => navigate('/FormUser')}
            >
                <GroupAddIcon />
                Crear usuario
            </Button>

            <Paper sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={usuarios}
                    columns={columns}
                    getRowId={(row) => row.id_usuario}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10]}
                    sx={{ border: 0 }}
                />
            </Paper>

            <ConfirmDialog
                open={openDialog}
                handleClose={() => setOpenDialog(false)}
                handleConfirm={handleConfirmDelete}
                title="Eliminar usuario"
                message="¿Estás seguro de que deseas eliminar este usuario?"
            />
        </Container>
    );
}
