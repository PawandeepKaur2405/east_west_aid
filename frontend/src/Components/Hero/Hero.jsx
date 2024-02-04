import React from 'react'
import './Hero.css'
import arrow_icon from '../Assets/arrow.png'
import hero_image from '../Assets/hero_image.png'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <div className='hero'>
      <div className="hero-left">
        <div>
            <p>Quality Living Starts Here – New and Refurbished Treasures Await!</p>
        </div>
        <Link style={{ textDecoration: 'none' }} to='/shop/newcollections'>
          <div className="hero-latest-button">
              <div>Latest Collection</div>
              <img src={arrow_icon} alt="" />
          </div>
        </Link>
      </div>
      <div className="hero-right">
        <img src={hero_image} alt="" />
      </div>
    </div>
  )
}

export default Hero
