import React from 'react';
import './OrderItem.css';
import { Link } from 'react-router-dom';
import cross_icon from '../../assets/cross_icon.png';

const OrderItem = (props) => {
  const { id, currentUser, totalCartAmount, userAddress, removeOrder } = props;

  const handleRemoveOrder = () => {
    if (confirm('Are you sure you want to delete this order?')) { // Add confirmation dialog
      console.log('Removing order:', id);
      removeOrder(id);
    }
  };

  return (
    <div className='orderitem'>
      <div className="orders-format-main orders-format">
        <Link to={`/orders/${id}`}>
          <p>{currentUser.name}</p>
          <p>£{totalCartAmount}</p>
          <p>{currentUser.contact}</p>
          <p>{userAddress}</p>
        </Link>
        <img onClick={handleRemoveOrder} className="orders-remove-icon" src={cross_icon} alt="" />
      </div>
    </div>
  );
};

export default OrderItem;
