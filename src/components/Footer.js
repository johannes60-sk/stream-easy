import logo_bouygue from '../assets/logo_bouygue.png'
import "../styles/Footer.css";

export default function () {

    return (

        <div class="container-fluid fixed-bottom" id='footer'>
            <footer class="d-flex flex-wrap justify-content-between align-items-center border-top">
                <p class="col-md-4 mb-0 text-muted">&copy; 2022 Bouygues Telecom, Inc</p>
                <div class="col-md-4 d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
                        <img src={logo_bouygue} className="footer-logo" alt="logo bouygueTelecom"/>
                </div>

                <ul class="nav col-md-4 justify-content-end list-unstyled d-flex">
                    <li class="ms-3"><a class="text-muted" href="#"><i class="bi bi-facebook"></i></a></li>
                    <li class="ms-3"><a class="text-muted" href="#"><i class="bi bi-instagram"></i></a></li>
                </ul>
            </footer>
        </div>
    )
}
