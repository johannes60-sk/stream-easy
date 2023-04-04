import React, {useState, useEffect} from 'react';
import { BrowserRouter, Route, Routes, Navigate  } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import AddFluxForm from './AddFluxForm';
import Logout from './Logout';
import EditAndDeleteJsonFile from './EditAndDeleteJsonFile';
import { getAuth } from "firebase/auth";
import initializeFirebase from './ConfigFirebase';

export default function App() {

  const authUser = getAuth(initializeFirebase);

  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const unsubscribe = authUser.onAuthStateChanged(user => {
      setUser(user);
    });

    return unsubscribe;
  }, []);

  return (
    <BrowserRouter>
      <Routes>

        {user && (
          <>
            {console.log(user.email)}
            <Route path="/Logout" element={<Logout />} />
            <Route path="/Addflux" element={<AddFluxForm />} />
            <Route path="/EditAndDeleteJsonFile" element={<EditAndDeleteJsonFile />} />
          </>
        )}

        {!user && (
          <>
            <Route path="/Register" element={<Register />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Logout" element={<Login />} />
            <Route path="/" element={<Login />} />
          </>
        )}

      </Routes>
    </BrowserRouter>
  );
}
