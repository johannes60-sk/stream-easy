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
  const [showAlert, setshowAlert] = useState({
    show: false,
    response: "",
    statut: false,
  });
  const [showModal, setshowModal] = useState(false);
  const [deleteConfirm, setdeleteConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("data", process.env.REACT_APP_API_URL);

    fetchFilesList();
  }, []);

  const fetchFilesList = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/get-jsonfilname-on-serve`
      );
      if (response.status === 200 && response.data.jsonFilename) {
        setfilesList(response.data.jsonFilename);
      }
    } catch (error) {
      console.error("Error fetching files list:", error);
      setfilesList([]); // Set empty array on error
    }
  };

  const handleFileSelect = async (event) => {
    setSelectedFile(event.target.value);
    setIsLoading(true);

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/get-jsonFile-on-serve/${event.target.value}`
      );

      if (response.status === 200) {
        setfileContent(response.data.fileContent);
      }
    } catch (error) {
      console.error("Error fetching file content:", error);
      setfileContent("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      fileName: selectedFile,
      jsonChannels: fileContent,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/send-modified-file-on-server`,
        data
      );

      if (response.status === 200) {
        setshowAlert({ show: true, response: response.data, statut: true });
        setTimeout(() => {
          setshowAlert({ show: null, response: "", statut: null });
        }, 3000);
      }
    } catch (error) {
      console.error("Error updating file:", error);
      setshowAlert({
        show: true,
        response: error.response?.data || "Error updating file",
        statut: false,
      });
      setTimeout(() => {
        setshowAlert({ show: null, response: "", statut: null });
      }, 3000);
    }
  };

  const validateJson = (json) => {
    try {
      JSON.stringify(JSON.parse(json), null, 4);
      setIsValidJson(true);
      setfileContent(json);
    } catch (error) {
      setIsValidJson(false);
    }
  };

  const handleDeleteJson = () => {
    setshowModal(true);
  };

  const handleConfirmDeleteJson = async () => {
    setdeleteConfirm(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/delete-file-on-serve/${selectedFile}`
      );

      if (response.status === 200) {
        await fetchFilesList();
        setdeleteConfirm(false);
        setshowModal(false);
        setfileContent("");
        setshowAlert({
          show: true,
          response: response.data,
          statut: true,
        });
        setTimeout(() => {
          setshowAlert({ show: null, response: "", statut: null });
        }, 4000);
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      setdeleteConfirm(false);
      setshowModal(false);
      setshowAlert({
        show: true,
        response: error.response?.data?.message || "Error deleting file",
        statut: false,
      });
      setTimeout(() => {
        setshowAlert({ show: null, response: "", statut: null });
      }, 4000);
    }
  };

  return (
    <div>
      <Header />
      <div className="container-flui" style={{ marginTop: "105px" }}>
        <div className="row justify-content-center">
          <div className="col-md-10">
            <h2>Editer ou effacer un fichier JSON</h2>
            <select
              className="form-select"
              id="floatingSelect"
              value={selectedFile}
              onChange={handleFileSelect}
            >
              <option value="">--- Choisir un fichier Json ---</option>
              {Array.isArray(filesList) &&
                filesList.map((file) => (
                  <option key={file.name} value={file.name}>
                    {file.name}
                  </option>
                ))}
            </select>

            <div
              className={`alert ${
                showAlert.show
                  ? showAlert.statut
                    ? "alert-success"
                    : "alert-danger"
                  : "d-none"
              } col-md-4 offset-4 p-1 text-center fs-5 mt-4 animate__animated animate__lightSpeedInRight`}
            >
              {showAlert.response}
            </div>

            {fileContent ? (
              <form onSubmit={handleSubmit} className="mt-3" id="form">
                <div className="form-group">
                  {!isValidJson && (
                    <div className="invalid-feedback">
                      Le format de votre JSON est invalide{" "}
                      <i className="bi bi-info-circle" />
                    </div>
                  )}
                  <textarea
                    className="form-control textarea"
                    spellCheck="false"
                    value={fileContent}
                    onChange={(event) => {
                      setfileContent(event.target.value);
                      validateJson(event.target.value);
                    }}
                  />
                </div>
                <div className="d-flex btn-container mt-3">
                  <div className="btn-edit-josn-file">
                    <button
                      type="submit"
                      className="btn"
                      disabled={!isValidJson}
                    >
                      Modifier <i className="bi bi-pencil" />
                    </button>
                  </div>
                  <div className="btn-delete-json-file">
                    <div className="btn" onClick={handleDeleteJson}>
                      Supprimer <i className="bi bi-trash3" />
                    </div>
                  </div>
                </div>

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
                    <div className="container d-flex btn-container">
                      <div className="row">
                        <div className="col-md-6">
                          <button
                            className="btn oui-modal-btn"
                            onClick={handleConfirmDeleteJson}
                          >
                            Oui
                          </button>
                        </div>
                        <div className="col-md-6">
                          <button
                            className="btn valid-form-modal-btn"
                            onClick={() => setshowModal(false)}
                          >
                            Non
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </Modal>
              </form>
            ) : (
              isLoading && (
                <div
                  className="d-flex justify-content-center"
                  style={{ marginTop: "170px" }}
                >
                  <ClipLoader
                    color={"#007bff"}
                    loading={isLoading}
                    css={spinnerStyle}
                    size={80}
                  />
                </div>
              )
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
