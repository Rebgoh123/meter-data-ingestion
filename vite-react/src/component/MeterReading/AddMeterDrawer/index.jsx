import React, {useState} from 'react';
import {
    Typography,
    Button,
    Drawer
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

import {useMeterReadings} from "./_hooks/useMeterReading.jsx";
import processNem12Worker from '../../workers/processNem12?worker';
import {DrawerBox, StyledFab} from "./style.jsx";

export const AddMeterDrawer = () => {
    const {  addMeterReading, isPosting} = useMeterReadings();
    const [isProcessing, setIsProcessing] = useState(false)
    const [drawerOpen, setDrawerOpen] = useState(false);


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
                if (e.data === "YAY") {
                    setIsProcessing(false);
                    worker.terminate(); // ✅ Cleanup worker after completion
                } else {
                    addMeterReading(e.data); // ✅ Process batch data
                }
            };

            worker.onerror = (err) => {
                console.error("Worker error:", err);
                alert("Error processing file.");
                setIsProcessing(false);
                worker.terminate();
            };
        };
    };

    return (
        <>
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

                    <Button variant="contained" component="label" fullWidth loading={isProcessing || isPosting}>
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
        </>
    );
}
