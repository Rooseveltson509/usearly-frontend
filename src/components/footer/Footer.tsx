import React from "react";
import "./Footer.scss";

const Footer: React.FC = () => {
  return (
    <footer className="landing-footer">
      <ul className="footer-cgpu">
        <li>
          <p>
            <a href="#">Conditions générales d'utilisation</a>
          </p>
        </li>
        <li>
          <p>
            <a href="#">Nous contacter</a>
          </p>
        </li>
        <li>
          <p>© Usearly 2024</p>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;
