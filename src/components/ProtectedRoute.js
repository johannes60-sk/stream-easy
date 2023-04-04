import React, { useEffect, useState } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { getAuth } from "firebase/auth";
import initializeFirebase from './ConfigFirebase';

export default function ProtectedRoute({ component: Component, ...rest }) {

    const [user, setUser] = useState(null);

    const auth = getAuth(initializeFirebase);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });
        return unsubscribe;
    }, []);
    
    
    return (
        <Route
            {...rest}
            render={(props) =>
                user ? <Component {...props} /> : <Navigate to="/login" />
            }
        />
    );
}
