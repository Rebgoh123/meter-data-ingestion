import { Typography, Button, CardContent, CardActions, Grid, Box } from "@mui/material";
import { Link } from "react-router-dom";
import {CardLabel, HomeCard} from "./style.jsx";

const AppModules = [
    {
        title: "Meter Reading",
        desc: "View and process meter readings efficiently.",
        href: "/meter-reading"
    }
];

const CustomCard = ({ title, href, desc }) => (
    <HomeCard variant="outlined">
        <CardContent>
            <CardLabel variant="h6" gutterBottom color="primary.main" >
                {title}
            </CardLabel>
            <Typography variant="body2" color="text.secondary">
                {desc}
            </Typography>
        </CardContent>
        <CardActions>
            <Button size="small" variant="contained" color="primary" component={Link} to={href} sx={{ ml: 1 }}>
                Learn More
            </Button>
        </CardActions>
    </HomeCard>
);

export const HomePage = () => {
    return (
        <Box sx={{ flexGrow: 1, p: 4 }}>
            <Grid container spacing={3} justifyContent="flex start">
                {AppModules.map(({ title, href, desc }, index) => (
                    <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                        <CustomCard title={title} href={href} desc={desc} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
