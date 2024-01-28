import React from 'react'
import './Footer.css'
import instagram_icon from '../Assets/instagram_icon.png'
import pinterest_icon from '../Assets/pintester_icon.png'
import whatsapp_icon from '../Assets/whatsapp_icon.png'
import footer_logo_1_icon from '../Assets/logo_1.png'
import foot_logo_2_icon from '../Assets/logo_2.png'

const Footer = () => {
  return (
    <div className='footer'>
      <div className="footer-logo">
        <p> <span className='east-logo-text'>EAST</span></p>
        <img className='footer-logo-first' src={footer_logo_1_icon} alt="" />
        <p> <span className='west-logo-text'>WEST</span> AID</p>
        <img className='footer-logo-second' src={foot_logo_2_icon} alt="" />
      </div>
      <ul className="footer-links">
        <li>Company</li>
        <li>Products</li>
        <li>Offices</li>
        <li>About</li>
        <li>Contact</li>
      </ul>
      <div className="footer-social-icons">
        <div className="footer-icons-container">
            <img src={instagram_icon} alt="" />
        </div>
        <div className="footer-icons-container">
            <img src={pinterest_icon} alt="" />
        </div>
        <div className="footer-icons-container">
            <img src={whatsapp_icon} alt="" />
        </div>
      </div>
      <div className="footer-copyright">
        <hr />
        <p>Copyright @ 2023 - All Rights reserved</p>
      </div>
    </div>
  )
}

export default Footer
