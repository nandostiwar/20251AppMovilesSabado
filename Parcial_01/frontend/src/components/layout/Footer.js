import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <Container>
        <div className="d-flex flex-wrap justify-content-between align-items-center">
          <div className="col-md-4 mb-3 mb-md-0">
            <h5>Marketplace </h5>
            <p className="text-muted">
              Una aplicación fullstack para gestión de compras y usuarios.
            </p>
          </div>

          <div className="col-md-4 d-flex justify-content-end">
            <ul className="list-unstyled d-flex">
              <li className="ms-3">
                <a className="text-light" href="#">
                  <i className="bi bi-facebook"></i>
                </a>
              </li>
              <li className="ms-3">
                <a className="text-light" href="#">
                  <i className="bi bi-instagram"></i>
                </a>
              </li>
              <li className="ms-3">
                <a className="text-light" href="#">
                  <i className="bi bi-twitter"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="d-flex justify-content-center border-top pt-3 mt-3">
          <p>&copy; {new Date().getFullYear()} Marketplace . Todos los derechos reservados.</p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;