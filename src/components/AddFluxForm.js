import React, { useState } from "react";
import "../styles/AddFluxForm.css";
import Header from "./Header";
import Footer from "./Footer";
import axios from "axios";
import Modal from "react-modal";
import { css } from "@emotion/react";
import ClipLoader from "react-spinners/ClipLoader";

export default function AddFluxForm() {
  const [fileName, setFileName] = useState(""); // état pour stocker le nom de fichier

  const [channels, setChannels] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formSubmitted, setFormSubmitted] = useState(false);

  const [showAlert, setShowAlert] = useState({
    show: false,
    response: "",
    success: false,
  });

  const [formIsEmpty, setFormIsEmpty] = useState(false);

  const handleNewFluxVideo = async (e) => {
    const filname = document.getElementById("filname").value;
    const Name = document.getElementById("name").value;
    const Url = document.getElementById("url").value;
    const DrmChannelId = document.getElementById("drmChannelId").value;

    const inputs = document.querySelectorAll("input");

    if (filname || Name || Url || DrmChannelId) {
      setIsLoading(true);

      inputs.forEach((input) => input.classList.add("disabled"));

      // Attendre pendant 2 secondes
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsLoading(false);

      const newChannel = {
        name: Name,
        url: Url,
        drmChannelId: DrmChannelId,
      };

      setIsDialogOpen(true);

      setChannels([...channels, newChannel]);

      inputs.forEach((input) => input.classList.remove("disabled"));

      if (
        !document
          .getElementById("name-json-file-bloc")
          .classList.contains("d-none")
      ) {
        setFileName(filname);
      }
    } else {
      setFormIsEmpty(true);
    }
  };

  const handleAddAnotherChannel = () => {
    setIsDialogOpen(false);
    const form = document.getElementById("fluxForm");
    form.reset();
    document.getElementById("name-json-file-bloc").classList.add("d-none");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setFormSubmitted(true);

    setChannels((prevChannels) => {
      // send the JSON data to api

      const sendData = async (data) => {
        try {
          await axios
            .post("http://localhost:3004/api/send-data-on-server", data)
            .then(async (response) => {
              if (response.status === 200) {
                const form = document.getElementById("fluxForm");
                form.reset();
                document
                  .getElementById("name-json-file-bloc")
                  .classList.remove("d-none");

                setFormSubmitted(false);

                setIsDialogOpen(false);

                setShowAlert({
                  show: true,
                  response: response.data,
                  success: true,
                });

                setTimeout(() => {
                  setShowAlert({ show: null, response: "", success: null });
                }, 3000);
              }
            })
            .catch((error) => {
              const form = document.getElementById("fluxForm");
              form.reset();
              setFormSubmitted(false);
              setIsDialogOpen(false);

              setShowAlert({
                show: true,
                response: error.response.data,
                success: false,
              });

              setTimeout(() => {
                setShowAlert({ show: null, response: "", success: null });
              }, 4000);
            });
        } catch (error) {
          setShowAlert({
            show: true,
            response: error.response.data,
            success: false,
          });

          setTimeout(() => {
            setShowAlert({
              show: null,
              response: "Echec de la creation du fichier json",
              success: null,
            });
          }, 4000);
        }
      };
      const dataForm = {
        fileName: fileName,
        jsonChannels: prevChannels,
      };

      sendData(dataForm);
    });
  };

  return (
    <>
      <Header />

      <div
        className="container-fluid "
        id="main-add-flux-form"
        style={{ marginTop: "105px" }}
      >
        <div className="row justify-content-center">
          <div className="col-md-5">
            <h2 className="mb-5">
              Ajouter des flux vidéo dans un nouveau fichier JSON
            </h2>

            <div
              className={`alert ${showAlert.show
                ? showAlert.success
                  ? "alert-success"
                  : "alert-danger"
                : "d-none"
                } animate__animated animate__lightSpeedInRight`}
            >
              {showAlert.response}
            </div>

            <form onSubmit={handleSubmit} id="fluxForm">
              <div className="form-group" id="name-json-file-bloc">
                <label htmlFor="filname" className="mb-2">
                  Nom du fichier Json:
                </label>
                <input
                  type="text"
                  className={`form-control ${formIsEmpty &&
                    document.getElementById("filname").value === ""
                    ? "is-invalid"
                    : ""
                    }`}
                  id="filname"
                  name="filname"
                  required
                  placeholder="Entrez le nom du fichier Json"
                />
              </div>

              <div className="form-group ">
                <label htmlFor="name" className="mb-2 mt-2">
                  Nom du flux:
                </label>
                <input
                  type="text"
                  className={`form-control ${formIsEmpty && document.getElementById("name").value === ""
                    ? "is-invalid"
                    : ""
                    }`}
                  id="name"
                  name="name"
                  required
                  placeholder="Entrez le nom du flux vidéo"
                />
              </div>

              <div className="form-group mt-2">
                <label htmlFor="url" className="mb-2">
                  URL:
                </label>
                <input
                  type="text"
                  id="url"
                  name="url"
                  className={`form-control ${formIsEmpty && document.getElementById("url").value === ""
                    ? "is-invalid"
                    : ""
                    }`}
                  required
                  placeholder="Entrez l'URL du flux vidéo"
                />
              </div>

              <div className="form-group mt-2">
                <label htmlFor="drmChannelId" className="mb-2">
                  DRM Channel ID:
                </label>
                <input
                  type="text"
                  id="drmChannelId"
                  name="drmChannelId"
                  className={`form-control ${formIsEmpty &&
                    document.getElementById("drmChannelId").value === ""
                    ? "is-invalid"
                    : ""
                    }`}
                  placeholder="Entrez l'id du flux vidéo"
                />
              </div>

              <div className="mt-2">
                {isLoading ? (
                  <div className="d-flex justify-content-center">
                    <ClipLoader
                      color={"#007bff"}
                      loading={isLoading}
                      css={spinnerStyle}
                      size={50}
                    />
                  </div>
                ) : (
                  <div className=" btn-add-flux-container fw-bold mt-2">
                    <div
                      className="btn add-flux-btn mt-2"
                      onClick={handleNewFluxVideo}
                    >
                      Ajouter
                    </div>
                  </div>
                )}
              </div>

              {/* Affiche la boîte de dialogue si isDialogOpen est true */}
              <Modal isOpen={isDialogOpen} className="Modal">
                <h3 className="add-new-channel-txt mb-4">
                  Voulez-vous ajouter un nouveau flux a votre fichier json ?
                </h3>

                {formSubmitted ? (
                  <div className="d-flex justify-content-center mt-2">
                    <ClipLoader
                      color={"#007bff"}
                      loading={formSubmitted}
                      css={spinnerStyle}
                      size={50}
                    />
                  </div>
                ) : (
                  <div className="container d-flex  btn-container">
                    <div className="row">
                      <div className="col-md-4">
                        <button
                          className="btn oui-modal-btn "
                          onClick={handleAddAnotherChannel}
                        >
                          Oui
                        </button>
                      </div>

                      <div className=" col-md-8">
                        <button
                          className="btn valid-form-modal-btn"
                          onClick={handleSubmit}
                        >
                          Non, valider
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </Modal>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
const spinnerStyle = css`
  display: block;
  margin: 0 auto;
  border-color: #007bff;
`;
