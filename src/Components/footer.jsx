import React from "react";
import { Link } from "react-router-dom";
import "./assets/css/footer.css";

const github = require("./assets/icons/github.png")
const linkedin = require("./assets/icons/linkedin.png")

const Footer = () => {
  const today = new Date();
    return (

    <div>
        <div className="phantom" />
        <div className="footer">
            <div className="footerLinks">
                <a href="https://github.com/anclark686" target="_blank" rel="noreferrer">
                    <img
                        alt=""
                        src={github}
                        width="35"
                        height="35"
                        className="d-inline-block align-left"
                    />
                </a>
                <a href="https://www.linkedin.com/in/anclark686/" target="_blank" rel="noreferrer">
                    <img
                        alt=""
                        src={linkedin}
                        width="35"
                        height="35"
                        className="d-inline-block align-left"
                    />
                </a>
               
            </div>
             <div className="footer_links">
                <a 
                    href="https://reyaly-portfolio.herokuapp.com/" 
                    className="d-inline-block align-left" 
                    style={{ paddingLeft:"10px", paddingRight:"10px"}}>    
                    <div id="portfolioFooter">Portfolio </div>
                </a>
             </div>

            <p>Copyright &copy; Reyaly Tech {today.getFullYear()}</p>
        </div>
    </div>

  );
};

export default Footer;