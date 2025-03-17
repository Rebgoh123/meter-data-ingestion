import React, {useState, useMemo} from 'react';
import { DataGrid } from '@mui/x-data-grid';
import dayjs from "dayjs";

import {useMeterReadings} from "../../../pages/MeterReading/_hooks/useMeterReading.jsx";
import {DataGridPaper} from "./style.jsx";

export const DataTable = () => {
    const { meterReadings, isLoading } = useMeterReadings();
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });

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

    return (
            <DataGridPaper>
                <DataGrid
                    loading={isLoading}
                    rows={paginatedRows}
                    columns={columns}
                    pageSizeOptions={[5, 10, 20, 50]}
                    pagination
                    paginationMode="server"
                    rowCount={meterReadings?.meterReadings?.length ?? 0}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    sx={{ border: 0 }}
                />
            </DataGridPaper>
    );
}
