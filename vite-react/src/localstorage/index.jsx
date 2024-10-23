export function setUsername(user){
    localStorage.setItem('user', user);
}
export function getUsername(){
    return localStorage.getItem('user');
}

export function setUserSessionToken(token){
    localStorage.setItem('token', token);
}

export function getUserSessionToken(){
    return localStorage.getItem('token');
}