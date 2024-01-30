import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './OrderDetails.css';

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [products, setProducts] = useState([]);

  const fetchProductDetails = async (order) => {
    try {
      // Fetch all products from the server
      const response = await fetch(`http://localhost:4000/allproducts`);
      const allProductsData = await response.json();

      if (!response.ok) {
        console.error('Error fetching all products:', allProductsData.errors);
        return;
      }

      // Check if there are products in the order
      if (Object.keys(order.cartItems).length === 0) {
        console.log('No products in the order.');
        return;
      }

      // Iterate over each product in the order and fetch details
      const productDetailsPromises = Object.keys(order.cartItems).map(async (productId) => {
        const quantity = order.cartItems[productId];
      
        // Exclude products with a quantity of 0
        if (quantity > 0) {
          console.log('Searching for productId:', productId);
          console.log('All Products Data:', allProductsData);
      
          const productData = allProductsData.find((product) => String(product.id) === String(productId));
          console.log('Found Product Data:', productData);
      
          return {
            productId: productId,
            quantity: quantity,
            details: productData || null, // Set details to null if product not found
          };
        } else {
          return null; // Exclude products with a quantity of 0
        }
      });
      

      // Wait for all product details to be fetched
      const productDetails = (await Promise.all(productDetailsPromises)).filter(Boolean);

      // Set the product details in the state only if products are ordered
      if (productDetails.length > 0) {
        console.log('Product Details:', productDetails);
        setProducts(productDetails);
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  const fetchUserDetails = async (userId) => {
    try {
      const response = await fetch(`http://localhost:4000/user/${userId}`);
      const userResponse = await response.json();

      if (response.ok) {
        setUserDetails(userResponse.user);
      } else {
        console.error('User not found');
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`http://localhost:4000/allorders`);
        const ordersData = await response.json();

        if (response.ok) {
          const selectedOrder = ordersData.find((o) => o._id === orderId);

          if (selectedOrder) {
            setOrder(selectedOrder);

            // Fetch user details and product details after setting the order state
            fetchUserDetails(selectedOrder.currentUser);
            fetchProductDetails(selectedOrder);
          } else {
            console.error('Order not found');
          }
        } else {
          console.error('Error fetching orders:', ordersData.errors);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (!order) {
    return <div>Loading...</div>;
  }

  console.log("Order Details:", order);

  return (
    <div className='order-details'>
      <h1>Order Details</h1>
      <div className="order-details-user">
        <div>
          <label>Order ID:</label>
          <p>{order._id}</p>
        </div>
        <div>
          <label>User:</label>
          <p>{userDetails === "" ? userDetails.name : 'User'}</p>
        </div>
        <div>
          <label>Total Cart Amount:</label>
          <p>£{order.totalCartAmount}</p>
        </div>
        <div>
          <label>User Address:</label>
          <p>{order.userAddress}</p>
        </div>
        <div>
          <label>Contact:</label>
          <p>{userDetails ? userDetails.contact : 'Loading...'}</p>
        </div>
        <div>
          <label>Email:</label>
          <p>{userDetails ? userDetails.email : 'Loading...'}</p>
        </div>
      </div>

      <hr />
      <h2>Product Details</h2>

      <div className="order-details-products">
        <ul>
          {products.map((product) => (
            <li key={product.productId}>
              <div className="order-details-products-container">
                {product.details && (
                  <img src={product.details.image} alt="" />
                )}
                <div className="order-details-product-list">
                  <p><label>Product Name:</label> {product.details ? product.details.name : 'N/A'}</p>
                  <p><label>Quantity:</label> {product.quantity}</p>
                  <p><label>Product Price:</label> £{product.details ? product.details.new_price : 'N/A'}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrderDetails;
