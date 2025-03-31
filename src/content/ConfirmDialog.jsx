import React from "react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";

const ConfirmDialog = ({ open, handleClose, handleConfirm, title, message }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title || "Confirmación"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {message || "¿Estás seguro de que deseas eliminar este elemento?"}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleConfirm} color="error">
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
