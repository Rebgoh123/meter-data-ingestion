import React, {useEffect, useState} from 'react';
import {
    Button,
    TextField,
    Typography,
    CssBaseline,
    Box,
    Grid,
    Link,
    Paper,
    Tabs,
    Tab, Stack,
} from '@mui/material';
import {useLogin} from "./_hooks/useLogin";
import {useAuth} from "../../hoc/AuthContext/index.jsx";
import {useNavigate} from "react-router-dom";
import {useRegister} from "./_hooks/useRegister.jsx";
import {useSnackBar} from "../../hoc/SnackbarHandler/index.jsx";

export const Login = () => {
    const {user, setUser} = useAuth()
    const navigate = useNavigate()
    const [tab, setTab] = useState(0);
    const [formDetails, setFormDetails] = useState({username: '', password: '', confirmPassword: ''});
    const {setSnackBar} = useSnackBar();
    const login = useLogin()
    const register = useRegister()

    useEffect(() => {
        if(user){
            navigate('/home')
        }
    }, []);

    const handleTabChange = (event, newValue) => {
        console.log(newValue)
        setTab(newValue);
        setFormDetails({
            username: '',
            password: '',
            confirmPassword: '',
        })
    };

    const handleLogin = (event) => {
        event.preventDefault();
        login.mutate(formDetails)
    };

    const handleSignup = (event) => {
        event.preventDefault();

        //sanity check
        if(formDetails.confirmPassword !== formDetails.password){
            setSnackBar({
                open: true,
                type: 'error',
                message: 'Password Mismatch',
            })
            setFormDetails((prevState)=> {
                return {...prevState, error_password: 'Mismatch'}
            })
        }
        register.setIsSuccess(false)
        register.mutate(formDetails)
    };

    useEffect(() => {
        if(login.isSuccess){
            setUser(login.result)
            navigate('/home')
        }
    }, [login.isSuccess]);

    useEffect(() => {
        if(register.isSuccess){
            console.log('??')
            setTab(0);
            setFormDetails({
                username: '',
                password: '',
                confirmPassword: '',
            })
        }
    }, [register.isSuccess]);

    return (
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: 'url(https://picsum.photos/1920/1080)',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Typography component="h1" variant="h5">
                          W E L C O M E
                        </Typography>
                        <Tabs value={tab} onChange={handleTabChange} sx={{ mt: 2, mb: 3 }}>
                            <Tab label="Login" />
                            <Tab label="Sign up" />
                        </Tabs>
                        <Box component="form" noValidate onSubmit={tab === 0 ? handleLogin : handleSignup} sx={{  m:1, pl:3,pr:3, width: '100%' }}>
                            <Stack direction={'column'} spacing={3} >
                                {register.isSuccess && <Typography variant={'caption'}>Registered successfully, please login below</Typography>}

                            <TextField
                                fullWidth={true}
                                id="outlined-controlled"
                                label="Username"
                                value={formDetails.username}
                                onChange={(event) => {
                                    setFormDetails((prevState) => {
                                        return {
                                            ...prevState,
                                            username: event.target.value,
                                        }
                                    })
                                }}
                                required={true}
                            />
                            <TextField
                                fullWidth={true}
                                id="outlined-controlled"
                                label="Password"
                                type="password"
                                value={formDetails.password}
                                onChange={(event) => {
                                    setFormDetails((prevState) => {
                                        return {
                                            ...prevState,
                                            password: event.target.value,
                                        }
                                    })
                                }}
                                required={true }
                                error={formDetails.error_password}
                            />
                            {tab === 1 && (
                                <TextField
                                    fullWidth={true}
                                    id="outlined-controlled"
                                    label="Confirm Password"
                                    type="password"
                                    value={formDetails.confirmPassword}
                                    onChange={(event) => {
                                        setFormDetails((prevState) => {
                                            return {
                                                ...prevState,
                                                confirmPassword: event.target.value,
                                            }
                                        })
                                    }}
                                    required={true}
                                />
                            )}
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                {tab === 0 ? 'Sign In' : 'Sign In'}
                            </Button>
                            </Stack>
                        </Box>
                    </Box>
                </Grid>
            </Grid>

    );
}