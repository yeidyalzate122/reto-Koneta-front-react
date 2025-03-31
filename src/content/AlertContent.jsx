import React from 'react';
import { useSnackbar } from 'notistack';

function AlertContent({ message, severity }) {
    const { enqueueSnackbar } = useSnackbar();

    React.useEffect(() => {
        if (message) {
            enqueueSnackbar(message, { variant: severity });
        }
    }, [message, severity, enqueueSnackbar]);

    return null; // Este componente no renderiza nada visualmente
}

export default AlertContent;