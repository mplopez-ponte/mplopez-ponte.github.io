import React from 'react';
import '../css/Footer.css'; // Importación de estilos

const ApiInfo = () => {
    return (
        <image src="../images/documentacion_api.png" href="https://smarttask-ia-backend-production.up.railway.app/api/docs/" target="_blank" rel="noopener noreferrer">API Docs</image>
    );
};

const Footer = () => {
    return (
        <footer className='footer'>
            <div className='footer-content'>
                <div className="container">
                    <div className="row align-items-start">
                        <div className="col">
                            <p>&copy; {new Date().getFullYear()} SmartTask IA. Gestor de tareas inteligente</p>
                        </div>
                        <div className="col">
                            <img src="../images/legal-license-mit-svgrepo-com.png" alt="MIT License"/>
                        </div> 
                        <div className="col">
                            <ApiInfo />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;