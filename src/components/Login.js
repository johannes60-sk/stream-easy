import React from "react";
import '../styles/Register.css'
import logo_bouygue from '../assets/logo_bouygue.png'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import initializeFirebase from './ConfigFirebase';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';


export default function Login() {

    const [formValues, setFormValues] = useState({
        email: '',
        password: ''
    });


    const navigate = useNavigate();

    const handleLoginSubmit = (event) => {

        event.preventDefault();

        const auth = getAuth(initializeFirebase);


        signInWithEmailAndPassword(auth, formValues.email, formValues.password)
            .then((userCredential) => {
                // Signed in 
                sessionStorage.setItem('user', JSON.stringify(userCredential.user));

                navigate('/Addflux');

            })
            .catch((error) => {
                const errorMessage = error.message;
                const errorLabel = document.querySelector('.errorLabel');
                errorLabel.style.display = 'block';
                errorLabel.textContent = errorMessage.split(": ")[1];
                const inputs = document.querySelectorAll('.form-control');
                inputs.forEach(input => input.classList.add('is-invalid'));
            });
    }

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

    return (
        <div className="container-fluid" id="login-body">
            <div className="row justify-content-center align-items-center" style={{ height: "100vh" }}>
                <div className="col-md-4">
                    <div className="card shadow">
                        <div className="card-body">
                            <div className="card-logo-container">
                                <img src={logo_bouygue} alt="Logo bouygue Telecom" className="card-logo" />
                            </div>
                            <div className="text-center fs-3 fw-bold register-txt">Se connecter</div>
                            <label className="errorLabel text-danger mt-3" id="error"></label>
                            <form className="mt-3" onSubmit={handleLoginSubmit}>
                                <div className="form-group mt-2">
                                    <label htmlFor="email" className="mb-2">Email</label>
                                    <input type="email" className="form-control" placeholder=" Email" onChange={handleEmailChange} />
                                </div>
                                <div className="form-group mt-2">
                                    <label htmlFor="motdepasse" className="mb-2">Mot de passe</label>
                                    <input type="password" className="form-control" placeholder="Mot de passe" onChange={handlePasswordChange} />
                                </div>
                                <div className="register-btn-container mt-3">
                                    <button type="submit" className="btn btn-outline-primary register-btn mt-2">Se connecter</button>
                                </div>
                                <div className="btn-login-container fw-bold">
                                    <a href="/Register" className="btn login-btn mt-2">S'inscrire</a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}