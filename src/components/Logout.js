import React, { useState } from "react";
import { getAuth } from 'firebase/auth';
import { Navigate } from "react-router";
import initializeFirebase from './ConfigFirebase';

export default function Logout(){

    const [isSingOut, setSingOut] = useState(false);
    
    JSON.parse(sessionStorage.getItem('user'));
    
    const auth = getAuth(initializeFirebase);

    
        auth.signOut()
            .then(() => {
                sessionStorage.removeItem('user');
                setSingOut(true);
            })
    
    return(

        <>
        
        {isSingOut ? (

            <>
            <Navigate to="/Login"/>
            </>

        ): ''}
        </>
    )
}
