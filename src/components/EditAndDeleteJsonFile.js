import axios from "axios";
import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { css } from "@emotion/react";
import ClipLoader from "react-spinners/ClipLoader";
import "../styles/EditJsonFile.css";
import Header from "./Header";
import Footer from "./Footer";

export default function EditAndDeleteJsonFile() {
  const [filesList, setfilesList] = useState([]);

  const [selectedFile, setSelectedFile] = useState("");

  const [isValidJson, setIsValidJson] = useState(true);

  const [fileContent, setfileContent] = useState("");

  const [showAlert, setshowAlert] = useState({show: false, response: "", statut: false,});

  const [showModal, setshowModal] = useState(false);

  const [deleteConfirm, setdeleteConfirm] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchFilesList();
  }, []);

  // Recuperer la liste des fichiers json sur le serveur
  const fetchFilesList = async () => {
    try {
      await axios
        .get("http://localhost:3004/api/get-jsonfilname-on-serve")
        .then((response) => {
          if (response.status === 200) {
            setfilesList(response.data.jsonFilename);
          }
        });
    } catch (error) { }
  };

  // Recupere le contenu du fichier choisir et l'affiche
  const handleFileSelect = async (event) => {

    setSelectedFile(event.target.value);

    try {
      const response = await axios.get(
        `http://localhost:3004/api/get-jsonFile-on-serve/${event.target.value}`
      );

      if (response.status === 200) {
        setfileContent(response.data.fileContent);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Pour modifier le fichier json
  const handleSubmit = async (event) => {

    event.preventDefault();

    const data = {
      fileName: selectedFile,
      jsonChannels: fileContent,
    };

    try {
      await axios
        .post("http://localhost:3004/api/send-modified-file-on-server", data)
        .then((response) => {
          if (response.status === 200) {
            setshowAlert({ show: true, response: response.data, statut: true });

            setTimeout(() => {
              setshowAlert({ show: null, response: "", statut: null });
            }, 3000);
          }
        })
        .catch((error) => {
          console.log(error);

          setshowAlert({
            show: false,
            response: error.response.data,
            statut: false,
          });

          setTimeout(() => {
            setshowAlert({ show: null, response: "", statut: null });
          }, 3000);
        });
    } catch (error) {
      console.log("Erreur de la requete");
    }
  };

// Verfiie en temps reel si le contenu du fichier est un json valide
  const validateJson = (json) => {
    try {
      //  JSON.parse(json);
      JSON.stringify(JSON.parse(json), null, 4);

      setIsValidJson(true);
      setfileContent(json);
    } catch (error) {
      setIsValidJson(false);
    }
  };

  // Pour effacer un fichier json
  const handleDeleteJson = async () => {
    setshowModal(true);
  };

  const handleConfirmDeleteJson = async () => {

    setdeleteConfirm(true);

    try {
      await axios.post(`http://localhost:3004/api/delete-file-on-serve/${selectedFile}`)
        .then(async (response) => {
          if (response.status === 200) {

            setdeleteConfirm(false);

            setshowModal(false);

            setfileContent('');

            setTimeout(() => {
              setshowAlert({
                show: true,
                response: response.data,
                statut: true,
              });
            }, 1000);

            setTimeout(() => {
              setshowAlert({ show: null, response: "", statut: null });
            }, 4000);
          }
        })
        .catch((error) => {
          console.log(error);
          setdeleteConfirm(false);

          setshowModal(false);

          setTimeout(() => {
            setshowAlert({
              show: true,
              response: error.response.data.message,
              statut: false,
            });
          }, 1000);

          setTimeout(() => {
            setshowAlert({ show: null, response: "", statut: null });
          }, 4000);
        });
    } catch (error) {
      console.log("Erreur de la requete !");
    }
  };

  return (
    <div>
      <Header />

      <div className="container-flui" style={{ marginTop: "105px" }}>
        <div className="row justify-content-center">
          <div className="col-md-10">
            <h2 className="">Editer ou effacer un fichier JSON</h2>
            <select
              className="form-select"
              id="floatingSelect"
              value={selectedFile}
              onChange={handleFileSelect}
            >
              <option value="" className="option">
                --- Choisir un fichier Json ---
              </option>
              {filesList.map((file) => (
                <option key={file.name} value={file.name}>
                  {file.name}
                </option>
              ))}
            </select>
            <div
              className={`alert ${showAlert.show
                  ? showAlert.statut
                    ? "alert-success"
                    : "alert-danger"
                  : "d-none"
                } col-md-4 offset-4 p-1 text-center fs-5  mt-4 animate__animated animate__lightSpeedInRight`}
            >
              {showAlert.response}
            </div>

            {fileContent && (
              <form onSubmit={handleSubmit} className="mt-3 " id="form">
                <div className="form-group">
                  {!isValidJson && (
                    <div className="invalid-feedback">
                      Le format de votre JSON est invalide{" "}
                      <i className="bi bi-info-circle" />
                    </div>
                  )}
                  <textarea
                    className="form-control textarea"
                    spellcheck="false"
                    value={fileContent}
                    onChange={(event) => {
                      setfileContent(event.target.value);
                      validateJson(event.target.value);
                    }}
                  ></textarea>
                </div>
                <div className="d-flex  btn-container mt-3">
                  <div className=" btn-edit-josn-file">
                    <button
                      type="submit"
                      className="btn "
                      disabled={!isValidJson}
                    >
                      Modifier <i className="bi bi-pencil" />
                    </button>
                  </div>
                  <div className=" btn-delete-json-file">
                    <div className="btn" onClick={handleDeleteJson}>
                      Supprimer <i className="bi bi-trash3" />
                    </div>
                  </div>
                </div>

                {/* Afficher la boîte de dialogue si isDialogOpen est true */}
                <Modal isOpen={showModal} className="Modal">
                  <h3 className="add-new-channel-txt mb-4">
                    Voulez-vous supprimer votre fichier json ?
                  </h3>

                  {deleteConfirm ? (
                    <div className="d-flex justify-content-center">
                      <ClipLoader
                        color={"#007bff"}
                        loading={deleteConfirm}
                        css={spinnerStyle}
                        size={50}
                      />
                    </div>
                  ) : (
                    <div className="container d-flex  btn-container">
                      <div className="row">
                        <div className="col-md-6 ">
                          <button
                            className="btn oui-modal-btn "
                            onClick={handleConfirmDeleteJson}
                          >
                            Oui
                          </button>
                        </div>

                        <div className=" col-md-6  ">
                          <button
                            className="btn valid-form-modal-btn"
                            onClick={() => {
                              setshowModal(false);
                            }}
                          >
                            Non
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </Modal>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

const spinnerStyle = css`
  display: block;
  margin: 0 auto;
  border-color: #007bff;
`;
