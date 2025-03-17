import { styled } from "@mui/material/styles";
import { Fab, Box } from "@mui/material";

export const StyledFab = styled(Fab)(() => ({
    position: 'fixed',
    bottom: 16,
    right: 16
}));

export const DrawerBox = styled(Box)(() => ({
    width: 400,
    padding: '30px'
}));