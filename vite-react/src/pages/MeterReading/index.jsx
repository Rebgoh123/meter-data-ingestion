import React from 'react';
import {
    Typography, Breadcrumbs, Link,
} from '@mui/material';

import {StyledBox} from "./style.jsx";
import {DataTable} from "../../component/MeterReading/DataTable/index.jsx";
import {AddMeterDrawer} from "../../component/MeterReading/AddMeterDrawer/index.jsx";

export const MeterReadingPage = () => {
    return (
        <StyledBox>
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
                <Link underline="hover" color="inherit" href="/">
                    Home
                </Link>
                <Typography color="text.primary">Meter Readings</Typography>
            </Breadcrumbs>
            <DataTable/>
            <AddMeterDrawer/>
        </StyledBox>
    );
}
