import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Typography, CircularProgress } from '@mui/material';

const fetchPosts = async () => {
    const { data } = await axios.get('https://jsonplaceholder.typicode.com/posts');
    return data;
};

function SampleComponent() {
    const { data, error, isLoading } = useQuery({
        queryKey: ['posts'], // Using queryKey as an array
        queryFn: fetchPosts, // Using queryFn for the fetch function
    });

    if (isLoading) return <CircularProgress />;
    if (error) return <Typography color="error">Error fetching data</Typography>;

    return (
        <div>
            {data.map((post) => (
                <Typography key={post.id} variant="body1">
                    {post.title}
                </Typography>
            ))}
        </div>
    );
}

export default SampleComponent;
