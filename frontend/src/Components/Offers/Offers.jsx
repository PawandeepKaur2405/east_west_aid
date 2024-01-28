import React from 'react'
import './Offers.css'
import exclusive_image from '../Assets/exclusive_image.png'

const Offers = () => {
  return (
    <div className='offers'>
      <div className="offers-left">
        <h1>Refurbished Products</h1>
        <h1></h1>
        <p>Renew, Reuse, Reimagine </p>
        <p>Elevate Your Lifestyle with quality refurbished finds</p>
      </div>
      <div className="offers-right">
        <img src={exclusive_image} alt="" />
      </div>
    </div>
  )
}

export default Offers
