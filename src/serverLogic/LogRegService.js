import {sha256} from "js-sha256";
import React from "react";
import {API_URL} from "./APIConfig";


//retruns error message if failed,
//and true if successfull
export  function login(username,password){
    let hashedPassword=sha256(password);
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, hashedPassword })
    };

    fetch(API_URL+'/login', {
        mode:'cors',
        // Declare what type of data we're sending
        headers: {
            'Content-Type': 'application/json'
        },

        // Specify the method
        method: 'POST',

        // A JSON payload
        body: JSON.stringify(
            { username, hashedPassword }
        )
    }).then(function (response) { // At this point, Flask has printed our JSON
        return response.text();
    }).then(function (text) {
        console.log('POST response: ');
        // Should be 'OK' if everything was successful
        console.log(text);
    });

    return true;
    // return fetch(API_URL+'/login', requestOptions)
    //     .then(handleResponse)
    //     .then(user => {
    //         console.log(user);
    //         localStorage.setItem('user', JSON.stringify(user));
    //         return true;
    //     });
}


export function register(username,password){
    let hashedPassword=sha256(password);

    const requestOptions = {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({username,hashedPassword})
    };

    return fetch(`${API_URL}/users/register`, requestOptions).then(handleResponse);
}

export function logout(){
    localStorage.removeItem('user');
    window.location.reload(true); //reload to rerout to loginpage
}

//returns an HTTP Authorization header containing the Json Web Token (JWT) of the currently logged in user
export function authHeader() {
    // return authorization header with jwt token
    let user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        return { 'Authorization': 'Bearer ' + user.token };
    } else {
        return {};
    }
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                logout(); // auto logout if 401 response returned from api
            }
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}

