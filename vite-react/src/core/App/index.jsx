import React from 'react'
import {Route, Routes, useNavigate} from 'react-router-dom'
import {AppBar, Avatar, Box, IconButton, Menu, MenuItem, Stack, Toolbar, Tooltip, Typography} from '@mui/material'

import {protectedRouteList, unprotectedRouteList} from '../../route'
import {useAuth} from '../../hoc/AuthContext'
import {PrivateRoutes} from '../../hoc/PrivateRoutes'
import AvatarImage from '../../assets/avatar.jpg'
import LogoImage from '../../assets/logo.png'
import {setUserSessionToken} from "../../localstorage/index.jsx";
import {useSnackBar} from "../../hoc/SnackbarHandler/index.jsx";


function BaseApp() {
    let navigate = useNavigate()
    const {user, setUser} = useAuth()
    const {setSnackBar} = useSnackBar()

    const handleSignOut = () => {
        localStorage.clear()
        setUser(undefined)
        setSnackBar({
            open: true,
            message:'Logout Successfully',
            type: 'success'
        })
        navigate('/Login', {replace: true})
    }

    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
        handleSignOut()
    };
    return (
        <Stack  sx={{ flexGrow: 1 }}>
            {user &&
                <AppBar position="static" color={'default'}>
                    <Toolbar>
                        <img src={LogoImage} width={50}/>
                        <Typography
                            variant="h6"
                            noWrap
                            sx={{
                                color: '#6b6b6b',
                                mr: 2,
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                textDecoration: 'none',
                                flexGrow: 1
                            }}
                        >
                           THEMERRYBALLOON
                        </Typography>
                        <Box >
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt="Remy Sharp" src={AvatarImage} />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                <MenuItem key={'logout'} onClick={handleCloseUserMenu}>
                                    <Typography sx={{ textAlign: 'center' }}>Logout</Typography>
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Toolbar>
                </AppBar>
            }
            <Box
                sx={user ? { pl: 3, pr: 3, pt: 2 } : {}}>
                <Routes>
                    {unprotectedRouteList.map(({path, Component}, key) => (
                        <Route exact path={path} key={key} element={Component} />
                    ))}
                    <Route
                        element={<PrivateRoutes authenticated={!!user} />}
                    >
                        {protectedRouteList.map(({path, Component, params}, key) => (
                            <Route exact path={path} key={key} element={Component} />
                        ))}
                    </Route>
                </Routes>
            </Box>

        </Stack>
    )
}

export default BaseApp