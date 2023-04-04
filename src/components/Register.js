import React from "react";
import '../styles/Register.css'
import logo_bouygue from '../assets/logo_bouygue.png'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import initializeFirebase from './ConfigFirebase';
import { useState } from "react";
import { Navigate } from "react-router";



export default function Register() {
    
    const [isInRegistered, setRegistered] = useState(false);

    const [formValues, setFormValues] = useState({
        pseudo: '',
        email: '',
        password: ''
    });

    const handlePseudoChange = (event) => {
        setFormValues({
            ...formValues,
            pseudo: event.target.value
        });
    };

    const handleEmailChange = (event) => {
        setFormValues({
            ...formValues,
            email: event.target.value
        });
    };

    const handlePasswordChange = (event) => {
        setFormValues({
            ...formValues,
            password: event.target.value
        });
    };

    const handleRegisterSubmit = (event) => {

        event.preventDefault();

        const auth = getAuth(initializeFirebase);
   
        createUserWithEmailAndPassword(auth, formValues.email, formValues.password, {displayName: formValues.pseudo})
            .then((userCredential) => {

                const user = userCredential.user;
                
                if(user){

                    setRegistered(true);

                    sessionStorage.setItem('user', JSON.stringify(user));
                      

                }
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error('Erreur lors de la création de l\'utilisateur:', errorCode, errorMessage);

                const errorLabel = document.querySelector('.errorLabel');
                errorLabel.style.display = 'block';
                errorLabel.textContent = errorMessage.split(": ")[1];
                const inputs = document.querySelectorAll('.form-control');
                inputs.forEach(input => input.classList.add('is-invalid'));
            });
    }

    return (
        <div className="container-fluid" id="register-body">
            <div className="row justify-content-center align-items-center" style={{ height: "100vh" }}>
                <div className="col-md-4">
                    <div className="card shadow">
                        <div className="card-body">
                            <div class="card-logo-container">
                                <img src={logo_bouygue} alt="Logo bouygue Telecom" class="card-logo" />
                            </div>
                            <div className="text-center fs-3 fw-bold register-txt">S'inscrire</div>
                            <label className="errorLabel text-danger mt-3" id="error"></label>
                            <form className="mt-3" onSubmit={handleRegisterSubmit}>
                                <div className="form-group mt-2">
                                    <label htmlFor="pseudo" className="mb-2">Pseudo</label>
                                    <input type="text" className="form-control " placeholder="Entrez votre pseudo" onChange={handlePseudoChange} />
                                </div>
                                <div className="form-group mt-2">
                                    <label htmlFor="email" className="mb-2">Email</label>
                                    <input type="email" className="form-control" placeholder="Entrez votre email" onChange={handleEmailChange} />
                                </div>
                                <div className="form-group mt-2">
                                    <label htmlFor="motdepasse" className="mb-2">Mot de passe</label>
                                    <input type="password" className="form-control" placeholder="Entrez votre mot de passe" onChange={handlePasswordChange} />
                                </div>
                                <div className="register-btn-container mt-3">
                                    {isInRegistered ? (

                                        <Navigate to="/Addflux"/>
                                    ): 
                                        <button type="submit" className="btn register-btn mt-2">S'inscrire</button>
                                    }

                                </div>
                                <div className="btn-login-container fw-bold">
                                    <a href="/" className="btn login-btn mt-2">Se connecter</a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}