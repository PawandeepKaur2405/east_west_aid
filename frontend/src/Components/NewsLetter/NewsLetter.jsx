import React from 'react'
import './NewsLetter.css'
import donation_banner from '../Assets/donation_banner.png'

const NewsLetter = () => {
  return (
    <div className='newsletter'>
      {/* <h1>Get exclusive offers on your email</h1>
      <p>Subscribe to our newsletter and stay updated</p>
      <div>
        <input type="email" placeholder='Your Email Id' />
        <button>Subscribe</button>
      </div> */}
      <img src={donation_banner} alt="" />
    </div>
  )
}

export default NewsLetter
