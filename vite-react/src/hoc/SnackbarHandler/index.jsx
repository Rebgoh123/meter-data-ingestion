import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { IconButton, Snackbar } from '@mui/material';
import { Close } from '@mui/icons-material';

const SnackbarAlertContext = createContext();

export const SnackbarHandler = ({ children }) => {
    const [snackbar, setSnackBar] = useState({
        open: false,
        type: 'error',
        message: 'Oops! Something went wrong. Please try again later.',
    });

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackBar((prevState) => ({ ...prevState, open: false }));
    };

    const contextPayload = useMemo(() => ({ setSnackBar }), []);

    useEffect(() => {
        if (snackbar.open) {
            const timer = setTimeout(() => {
                setSnackBar((prevState) => ({ ...prevState, open: false }));
            }, 3000); // auto-hide duration
            return () => clearTimeout(timer);
        }
    }, [snackbar.open]);

    return (
        <SnackbarAlertContext.Provider value={contextPayload}>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                action={
                    <IconButton
                        size="small"
                        aria-label="close"
                        color="inherit"
                        onClick={handleClose}
                    >
                        <Close fontSize="small" />
                    </IconButton>
                }
                message={snackbar.message}
                severity={snackbar.type}
            />
            {children}
        </SnackbarAlertContext.Provider>
    );
};

export const useSnackBar = () => useContext(SnackbarAlertContext);
