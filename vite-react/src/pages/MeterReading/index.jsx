import React, {useState, useMemo} from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
    Typography,
    Button,
    Drawer, Breadcrumbs, Link,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import {useMeterReadings} from "./_hooks/useMeterReading.jsx";
import processNem12Worker from '../../workers/processNem12?worker';
import dayjs from "dayjs";
import {DataGridPaper, DrawerBox, StyledBox, StyledFab} from "./style.jsx";

export const MeterReadingPage = () => {

    const { meterReadings, isLoading, addMeterReading, isPosting } = useMeterReadings();
    const [isProcessing, setIsProcessing] = useState(false)
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });

    const [drawerOpen, setDrawerOpen] = useState(false);

    const paginatedRows = useMemo(() => {
        const startIndex = paginationModel.page * paginationModel.pageSize;
        return meterReadings?.meterReadings?.slice(startIndex, startIndex + paginationModel.pageSize);
    }, [paginationModel, meterReadings]);

    const columns = useMemo(() => [
        { field: 'id', headerName: 'ID', width: 350 },
        { field: 'nmi', headerName: 'NMI', width: 150 },
        {
            field: 'timestamp',
            headerName: 'Timestamp',
            width: 200,
            valueFormatter: (params) =>
                params ? dayjs(params).format("YYYY-MM-DD HH:mm") : "",
        },
        { field: 'consumption', headerName: 'Consumption', type: 'number', width: 180 },
    ], [])

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsText(file);

        reader.onload = (e) => {
            const content = e.target.result;
            if (!content) return;

            //to split by line
            const lines = content.split('\n').map(line => line.trim());

            //to validate for empty file
            if(lines.length === 0){
                alert("Empty file");
                return;
            }
            //to validate if row starts with 100 (header)
            if (lines[0] && lines[0].split(',')[0] !== "100") {
                alert("Invalid NEM12 file! The first row must start with '100'.");
                return;
            }
            //to validate if row ends with 900 (footer)
            if (lines[lines.length-1] && lines[lines.length-1].split(',')[0] !== "900") {
                alert("Invalid NEM12 file! The last row must end with '900'.");
                return;
            }

            setIsProcessing(true);
            const worker = new processNem12Worker();

            worker.postMessage({ lines });

            worker.onmessage = (e) => {
                addMeterReading(e.data); // ✅ Add processed meter readings
            };

            worker.onerror = (err) => {
                console.error("Worker error:", err);
                alert("Error processing file.");
                setIsProcessing(false);
                worker.terminate();
            };

            worker.onmessageend = () => {
                setIsProcessing(false);
                worker.terminate(); // ✅ Cleanup worker
            };

        };
    };

    return (
        <StyledBox>
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
                <Link underline="hover" color="inherit" href="/">
                    Home
                </Link>
                <Typography color="text.primary">Meter Readings</Typography>
            </Breadcrumbs>
            {isProcessing && <Typography sx={{ mt: 2 }}>Processing file...</Typography>}

            <DataGridPaper>
                <DataGrid
                    loading={isLoading || isPosting}
                    rows={paginatedRows}
                    columns={columns}
                    pageSizeOptions={[5, 10, 20, 50]}
                    pagination
                    paginationMode="server"
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    rowCount={meterReadings?.meterReadings?.length}
                    sx={{ border: 0 }}
                />
            </DataGridPaper>

            <StyledFab
                color="primary"
                aria-label="import"
                onClick={toggleDrawer(true)}
            >
                <AddIcon />
            </StyledFab>

            <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
                <DrawerBox>
                    <Typography variant="h6">Import Data</Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                        Upload a NEM12 file to import meter readings.
                    </Typography>

                    <Button variant="contained" component="label" fullWidth loading={isProcessing}>
                        Upload File
                        <input type="file" accept=".txt,.csv" hidden onChange={handleFileUpload}  />
                    </Button>

                    <Button
                        variant="outlined"
                        sx={{ mt: 2 }}
                        onClick={toggleDrawer(false)}
                        fullWidth
                    >
                        Cancel
                    </Button>
                </DrawerBox>
            </Drawer>
        </StyledBox>
    );
}
