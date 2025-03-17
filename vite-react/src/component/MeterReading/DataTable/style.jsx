import { styled } from "@mui/material/styles";
import { Fab, Paper, Box } from "@mui/material";

export const StyledFab = styled(Fab)(() => ({
    position: 'fixed',
    bottom: 16,
    right: 16
}));

export const StyledBox = styled(Box)(() => ({
    p: 3,
    pt: 0,
    position: 'relative'
}));

export const DataGridPaper = styled(Paper)(() => ({
    width: '100%',
    height: 'calc(100vh - 220px)',
    padding: '10px'
}));

export const DrawerBox = styled(Box)(() => ({
    width: 400,
    padding: '30px'
}));