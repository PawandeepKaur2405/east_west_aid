import React from 'react'
import './Footer.css'
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
      <div className="footer-links">
        <p>ADDRESS : UNIT 2,EAST AND WEST AID, POSTCODE-WV2 3JN, moor street south, Wolverhampton</p>
        <p>CONTACT US : 01902420030</p>
      </div>
      <div className="footer-copyright">
        <hr />
        <p>Copyright @ 2024 - All Rights reserved</p>
      </div>
    </div>
  )
}

export default Footer
