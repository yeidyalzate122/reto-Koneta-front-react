import { useEffect, useState } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

export default function VentaModal({ open, id_venta, onClose }) {
    const [venta, setVenta] = useState(null);

    useEffect(() => {
        if (id_venta) {
            fetch(`http://localhost:5000/api/v1/venProc/ventaId/${id_venta}`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                method: "GET",
            })
            .then((response) => response.json())
            .then((data) => {
            //   console.log("Datos recibidos en el modal:", data);
                setVenta(data);
            })
            .catch((error) => console.error("Error al cargar venta:", error));
        }
    }, [id_venta]);

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)', 
                width: 400, 
                bgcolor: 'background.paper', 
                boxShadow: 24, 
                p: 4, 
                borderRadius: 2 
            }}>
                <Typography variant="h6" gutterBottom>
                    Detalle de la Venta
                </Typography>

                {venta && venta && venta.length > 0 ? (
                    <>
                        <Typography><strong>Producto:</strong> {venta[0].tipo_producto}</Typography>
                        <Typography><strong>Cupo:</strong> {venta[0].cupo}</Typography>
                        <Typography><strong>Tasa:</strong> {venta[0].tasa}%</Typography>
                        <Typography><strong>Fecha de Venta:</strong> {(venta[0].fecha_venta)}</Typography>
                        <Typography><strong>Asesor de Venta:</strong> {venta[0].asesorventa}</Typography>
                        <Typography><strong>Franquicia:</strong> {venta[0].franquicia}</Typography>
                        <Typography><strong>Fecha Actualización:</strong> {venta[0].fecha_actalizada ? (venta[0].fecha_actalizada): 'No actualizada'}</Typography>
                        <Typography><strong>Asesor Actualizado:</strong> {venta[0].asesoractualizado || 'No actualizado'}</Typography>
                    </>
                ) : (
                    <Typography>Cargando información...</Typography>
                )}

                <Box textAlign="right" mt={2}>
                    <Button variant="contained" color="primary" onClick={onClose}>
                        Cerrar
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}
