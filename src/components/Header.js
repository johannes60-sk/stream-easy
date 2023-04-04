import React, {useState, useEffect} from "react";
import logo_bouygue from '../assets/logo_bouygue.png'
import '../styles/Header.css';
import { getAuth } from "firebase/auth";
import initializeFirebase from './ConfigFirebase';

export default function Header() {

    // const user = JSON.parse(sessionStorage.getItem('user'));

    const [user, setUser] = useState(null);
    const authUser = getAuth(initializeFirebase);
  
  useEffect(() => {
    // écouter les changements d'état d'authentification de l'utilisateur
    const unsubscribe = authUser.onAuthStateChanged(user => {
        
      setUser(user);
    });

    return unsubscribe;
  }, []);

    return (

        <div className="container-fluid fixed-top" id="header">
            <div className="container-fluid p-0 m-1">
                <header className="d-flex flex-wrap justify-content-between">
                        <img src={logo_bouygue} className="header-logo" alt="logo bouygueTelecom" />

                    <ul class="nav nav-pills m-2">
                        {user ? (
                            <>
                            <li className="nav-item"><a href="/Addflux" className="nav-link ">Nouveau fichier JSON</a></li>
                            <li className="nav-item"><a href="/EditAndDeleteJsonFile" className="nav-link ">Gestion de fichiers JSON</a></li>
                            {/* <li className="nav-item"><a href="/" className="nav-link">Contact</a></li> */}
                            <li className="nav-item header-logout-btn "><a href="/logout" className="nav-link ">Deconnexion</a></li>
                            </>
                        ) : (
                            <>
                            <li className="nav-item"><a href="/Login" className="nav-link">Connexion</a></li>
                            <li className="nav-item"><a href="/Register" className="nav-link">Inscription</a></li>
                            </>
                        )}
                        </ul>

                </header>
            </div>
        </div>

    )
}