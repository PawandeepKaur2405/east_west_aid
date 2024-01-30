import React, { useState, useEffect } from 'react';
import './Orders.css';
import OrderItem from '../OrderItem/OrderItem';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:4000/allorders');
      const ordersData = await response.json();
  
      if (response.ok) {
        setOrders(
          await Promise.all(
            ordersData.map(async (order) => {
              const userId = order.currentUser;
              const userResponse = await fetch(`http://localhost:4000/user/${userId}`);
              const userData = await userResponse.json();
  
              return {
                ...order,
                currentUser: userData.user,
              };
            })
          )
        );
      } else {
        console.error('Error fetching orders:', ordersData.errors);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };  

  const remove_order = async(id) => {
    console.log('Removing order:', id);
    await fetch('http://localhost:4000/removeorder', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type' : 'application/json',
        },
        body: JSON.stringify({id: id})
    })
    await fetchOrders();
}

  return (
    <div className='orders'>
      <h1>All Orders List</h1>
      <div className="orders-format-main">
        <p>User</p>
        <p>Cart Total</p>
        <p>Contact</p>
        <p>Address</p>
        <p>Remove/Done</p>
      </div>
      <div className="orders-allorder">
        <hr />
        {orders.map((order, index) => (
        <OrderItem
          key={order._id}  // Make sure each key is unique
          id={order._id}
          currentUser={order.currentUser}
          totalCartAmount={order.totalCartAmount}
          userAddress={order.userAddress}
          removeOrder={remove_order} 
        />
      ))}
      </div>
    </div>
  );
};

export default Orders;
