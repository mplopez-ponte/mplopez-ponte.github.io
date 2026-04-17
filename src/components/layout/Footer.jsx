import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-auto border-top border-secondary">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <span className="text-muted">
              <i className="bi bi-cpu-fill me-2 text-primary"></i>
              <strong>SmartTask IA</strong> &copy; {new Date().getFullYear()}
            </span>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <a href="#" className="text-muted text-decoration-none me-3">Privacidad</a>
            <a href="#" className="text-muted text-decoration-none">Soporte</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;