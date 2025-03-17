import { styled } from "@mui/material/styles";
import { Card, Typography } from "@mui/material";

export const HomeCard = styled(Card)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: theme.shadows[2],
    transition: "transform 0.2s ease-in-out",
    padding: theme.spacing(2),
    "&:hover": {
        boxShadow: theme.shadows[4],
    }
}));

export const CardLabel = styled(Typography)(() => ({
    fontWeight: "bold"
}));