import React from 'react';
import './OrderItem.css';
import { Link } from 'react-router-dom';
import cross_icon from '../../assets/cross_icon.png';

const OrderItem = (props) => {
  const { id, currentUser, totalCartAmount, userAddress, removeOrder } = props;

  return (
    <div className='orderitem'>
      <div className="orders-format-main orders-format">
        <Link to={`/orders/${id}`}>
          <p>{currentUser.name}</p>
          <p>${totalCartAmount}</p>
          <p>{currentUser.contact}</p>
          <p>{userAddress}</p>
        </Link>
        <img onClick={() => removeOrder(id)} className="orders-remove-icon" src={cross_icon} alt="" />
      </div>
    </div>
  );
};

export default OrderItem;
