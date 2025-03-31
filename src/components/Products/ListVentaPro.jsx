import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Button, Container } from "@mui/material";
import Navbar from "../NavBar/NavBar";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import TaskIcon from "@mui/icons-material/Task";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import VentaModal from "../Products/VentaModal";
import ConfirmDialog from "../../content/ConfirmDialog";  // ✅ Importar ConfirmDialog
import { useNavigate } from "react-router-dom";

export default function ListVentaPro() {
    const [venta, setVenta] = useState([]);
    const [open, setOpen] = useState(false);
    const [total, setTotal] = useState(0);
    const [selectedId, setSelectedId] = useState(null);
    const [openDialog, setOpenDialog] = useState(false); // ✅ Estado para abrir/cerrar el diálogo
    const [ventaIdToDelete, setVentaIdToDelete] = useState(null); // ✅ Estado para guardar el ID a eliminar
    const navigate = useNavigate();

    const handleOpenModal = (id) => {
        setSelectedId(id); // Guarda el ID en el estado
        setOpen(true);
    };


    useEffect(() => {
        loadVenta();
    }, []);

    const loadVenta = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/v1/venProc/venta", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                setVenta(data);
            } else {
                console.error("Error: Los datos no son un array", data);
            }
        } catch (error) {
            console.error("Error cargando ventas:", error);
        }
    };

    // 📌 Función para mostrar el ConfirmDialog
    const handleOpenConfirmDialog = (id) => {
        setVentaIdToDelete(id); // Guardar el ID de la venta a eliminar
        setOpenDialog(true); // Abrir el diálogo
    };

    // 📌 Función para eliminar la venta confirmada
    const handleConfirmDelete = async () => {
        if (!ventaIdToDelete) return;
    
        try {
            const response = await fetch(`http://localhost:5000/api/v1/venProc/venta/${ventaIdToDelete}`, {
                headers: { Authorization: "Bearer " + localStorage.getItem("token") },
                method: "DELETE",
            });
            const res = await response.json();
         

            alert(res.message)
    
            setVenta(venta.filter((v) => v.id_venta !== ventaIdToDelete));
            setOpenDialog(false); // Cerrar el diálogo después de eliminar
            setVentaIdToDelete(null);
        } catch (error) {
            console.error("Error al eliminar la venta:", error);
            alert("No se pudo eliminar la venta. Inténtalo de nuevo.");
        }
    };
    
    const columns = [
        { field: "id_venta", headerName: "Id", width: 10 },
        { field: "tipo_producto", headerName: "Nombre del producto", width: 250 },
        { field: "cupo", headerName: "Cupo", width: 150 },
        { field: "fecha_venta", headerName: "Fecha de venta", width: 200 },
        { field: "nombre", headerName: "Usuario que creó la venta", width: 200 },
        {
            field: "acciones",
            headerName: "Acciones",
            width: 260,
            renderCell: (params) => (
                <div>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => navigate(`/FormModVentaPro/${params.row.id_venta}`)}
                    >
                        <BorderColorIcon />
                    </Button>

                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        style={{ marginLeft: 8 }}
                        onClick={() => handleOpenConfirmDialog(params.row.id_venta)} // ✅ Mostrar diálogo antes de eliminar
                    >
                        <DeleteForeverIcon />
                    </Button>

                    <Button
                        variant="contained"
                        color="info"
                        size="small"
                        style={{ marginLeft: 8 }}
                        onClick={() => handleOpenModal(params.row.id_venta)} // Abre el modal con el ID
                    >
                        <FormatListBulletedIcon />
                    </Button>
                </div>
            ),
        },
    ];

    useEffect(() => {
        setTotal(calcularTotalCupo(venta));
    }, [venta]);

    const calcularTotalCupo = (venta) => {
        return venta.reduce((total, item) => {
            const valorNumerico = parseFloat(item.cupo.replace(/\./g, ""));
            return total + (isNaN(valorNumerico) ? 0 : valorNumerico);
        }, 0);
    };

    return (
        <Container>
            <Navbar />
            <h1>Ventas radicadas</h1>
            <Button variant="contained" onClick={() => navigate("/FormVentaPro")}>
                <TaskIcon />
                Crear venta
            </Button>

            <Card sx={{ width: 300, height: 50, margin: 1 }}>
                <CardContent>
                    <Typography variant="h6">
                        <LocalAtmIcon /> <b>Cupo total: {total.toLocaleString("es-CO")}</b>
                    </Typography>
                </CardContent>
            </Card>

            <Paper sx={{ height: 400, width: "100%" }}>
                <DataGrid
                    rows={venta}
                    columns={columns}
                    getRowId={(row) => row.id_venta}
                    pageSizeOptions={[5, 10]}
                    sx={{ border: 0 }}
                />
            </Paper>

            {/* Modal Global */}
            <VentaModal open={open} id_venta={selectedId} onClose={() => setOpen(false)} />

            {/* ✅ ConfirmDialog independiente */}
            <ConfirmDialog
                open={openDialog}
                handleClose={() => setOpenDialog(false)}
                handleConfirm={handleConfirmDelete}
                title="Eliminar Venta"
                message="¿Estás seguro de que deseas eliminar esta venta?"
            />
        </Container>
    );
}
