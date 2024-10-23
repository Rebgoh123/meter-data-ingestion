import React from 'react';
import {Typography, Button, CardContent, CardActions, Card, Grid} from '@mui/material';
import { Link } from 'react-router-dom';
import SampleComponent from "../../component/SampleComponent/index.jsx";

const CustomCard = ({ title, href }) => (
    <Card variant="outlined">
        <CardContent>
            <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                {title}
            </Typography>
            <Typography variant="subtitle" component="div">
                Sample desc
            </Typography>
        </CardContent>
        <CardActions>
            <Button size="small" component={Link} to={href}>
                Learn More
            </Button>
        </CardActions>
    </Card>
);

function Home() {
    return (
        <div>
            <Grid container={true} spacing={2} >
                <Grid item xs={12} md={3}>
                    <CustomCard title={'Module1'} href={'/about'} />
                </Grid>
                <Grid item xs={12} md={3}>
                    <CustomCard title={'Module2'} href={'/about'} />
                </Grid>
            </Grid>
        </div>
    );
}

export default Home;
