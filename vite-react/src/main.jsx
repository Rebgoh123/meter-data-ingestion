import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import {QueryClientProvider} from "react-query";
import {createTheme, ThemeProvider} from "@mui/material";
import {queryClient} from "./hoc/ReactQuery";

import {AuthProvider} from "./hoc/AuthContext/index.jsx";
import {SnackbarHandler} from "./hoc/SnackbarHandler/index.jsx";
import App from './core/App';
import './index.scss'

const theme = createTheme({
    palette: {
        text: {
            primary: "#6b6b6b"
        }
    },
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <SnackbarHandler>
                        <AuthProvider>
                            <App />
                        </AuthProvider>
                    </SnackbarHandler>
                </BrowserRouter>
            </QueryClientProvider>
        </ThemeProvider>
    </React.StrictMode>
);