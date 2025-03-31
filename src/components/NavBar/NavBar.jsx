import { Button, Drawer } from "@mui/material";
import NavListDrawer from "./NavListDrawer";
import { useState } from "react";
import WidgetsIcon from '@mui/icons-material/Widgets';

export default function Navbar() {

    const [open, setOpen] = useState(false)

    const toggleDrawer = (isOpen) => () => {
        setOpen(isOpen);
    };
    return (

        <>
            <Button
                variant="contained"
                size="large"
                onClick={() => setOpen(true)}
                sx={{  margin:"10px", color: "white", "&:hover": { backgroundColor: "darkgray" } }}
            >
                <WidgetsIcon />
            </Button>

            <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
                <NavListDrawer />
            </Drawer>
        </>

    )
}