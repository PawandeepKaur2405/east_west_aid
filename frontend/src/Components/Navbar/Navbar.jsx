import React, { useContext, useRef, useState, useEffect } from 'react';
import './Navbar.css';
import footer_logo_1_icon from '../Assets/logo_1.png';
import footer_logo_2_icon from '../Assets/logo_2.png';
import cart_icon from '../Assets/cart_icon.png';
import { Link } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';
import nav_drop_down from '../Assets/navbar-drop-down.png';
import nav_menu from '../Assets/menu.png';

const Navbar = () => {
  const [menu, setMenu] = useState("shop");
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const { getTotalCartItems } = useContext(ShopContext);
  const menuRef = useRef();
  const optionsRef = useRef(null);

  const dropdown_toggle = (e) => {
    menuRef.current.classList.toggle('nav-menu-visible');
    optionsRef.current.classList.remove('nav-options-visible');
    setIsOptionsVisible(false);
  };

  const dropdown_options = (e) => {
    optionsRef.current.classList.toggle('nav-options-visible');
    menuRef.current.classList.remove('nav-menu-visible');
    setIsOptionsVisible(!isOptionsVisible);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    window.location.replace("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        optionsRef.current.classList.remove('nav-options-visible');
        setIsOptionsVisible(false);
      }
    };

    const handleDocumentClick = (event) => {
      handleClickOutside(event);
    };

    document.addEventListener('mousedown', handleDocumentClick);

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, [optionsRef]);

  return (
    <div className='navbar'>
      <Link style={{ textDecoration: 'none' }} to='/'>
        <div className="nav-logo" onClick={() => { setMenu("shop") }}>
          <p> <span className='east-logo-text'>EAST</span></p>
          <img className='footer-logo-first' src={footer_logo_1_icon} alt="" />
          <p> <span className='west-logo-text'>WEST</span> AID</p>
          <img className='footer-logo-second' src={footer_logo_2_icon} alt="" />
        </div>
      </Link>
      <img className='nav-dropdown' onClick={dropdown_toggle} src={nav_drop_down} alt="" />
      <ul ref={menuRef} className="nav-menu">
        <li onClick={() => { setMenu("shop") }}><Link style={{ textDecoration: 'none' }} to='/'>Shop</Link>{menu == "shop" ? <hr /> : <></>}</li>
        <li onClick={() => { setMenu("furniture") }}><Link style={{ textDecoration: 'none' }} to='/furniture'>Furniture & Related</Link> {menu == "furniture" ? <hr /> : <></>}</li>
        <li onClick={() => { setMenu("appliances") }}><Link style={{ textDecoration: 'none' }} to='/appliances'>Appliances</Link> {menu == "appliances" ? <hr /> : <></>}</li>
        <li onClick={() => { setMenu("refurbished") }}><Link style={{ textDecoration: 'none' }} to='/refurbished'>Refurbished</Link> {menu == "refurbished" ? <hr /> : <></>}</li>
      </ul>
      <div className="nav-login-cart">
        <Link style={{ textDecoration: 'none' }} to='/cart'> <img src={cart_icon} alt="" /> </Link>
        <div className="nav-cart-count">{getTotalCartItems()}</div>
      </div>
      <div>
        <img className={`nav-menu-img ${isOptionsVisible ? 'open' : ''}`} src={nav_menu} alt="" onClick={dropdown_options} />
        <ul ref={optionsRef} className={`nav-options ${isOptionsVisible ? 'nav-options-visible' : 'nav-options-hidden'}`}>
          {localStorage.getItem('auth-token') ?
            <>
              <li><Link style={{ textDecoration: 'none' }} to='/profile'>Profile</Link></li>
              <li onClick={handleLogout}>Logout</li>
            </>
            :
            <li><Link style={{ textDecoration: 'none' }} to='/login'>Login</Link></li>
          }
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
