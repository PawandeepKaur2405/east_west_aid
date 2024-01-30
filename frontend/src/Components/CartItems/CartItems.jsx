import React, { useContext, useState, useEffect } from 'react';
import './CartItems.css';
import { ShopContext } from '../../Context/ShopContext';
import remove_icon from '../Assets/cart_cross_icon.png';

const CartItems = () => {
  const { getTotalCartAmount, emptyCart, all_products, cartItems, removeFromCart } = useContext(ShopContext);
  const [userAddress, setUserAddress] = useState('');
  const [currentUser, setCurrentUser] = useState({});
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      const totalCartAmount = getTotalCartAmount();
  
      if (token && userAddress && totalCartAmount > 0) {
        // Send a request to your server to store the order details
        const response = await fetch('http://localhost:4000/placeorder', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cartItems,
            totalCartAmount,
            userAddress,
            currentUser,
          }),
        });
  
        const responseData = await response.json();
  
        if (responseData.success) {
          // Assuming emptyCart also triggers a state update
          await emptyCart();
          setOrderPlaced(true);
        } else {
          console.error('Error placing order:', responseData.errors);
        }
      }
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };
  

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('auth-token');

      if (token) {
        const response = await fetch('http://localhost:4000/currentuser', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const responseData = await response.json();

        if (responseData.success) {
          setCurrentUser(responseData.user);
          setUserAddress(responseData.user.address);
        } else {
          console.error('Error fetching current user:', responseData.errors);
        }
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  console.log('all_products:', all_products);
  console.log('cartItems:', cartItems);
  console.log('getTotalCartAmount:', getTotalCartAmount());

  const handleAddressChange = (address) => {
    console.log("Address stored : ", address);
    setUserAddress(address);
  }

  return (
    <div className='cartitems'>
      <div className="cartitems-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />
      {all_products.map((product) => {
        const cartQuantity = cartItems[product.id];
        if (cartQuantity > 0) {
          return (
            <div key={product.id}>
              <div className="cartitems-format cartitems-format-main">
                <img src={product.image} alt="" className='carticon-product-icon'/>
                <p>{product.name}</p>
                {product.new_price !== undefined ? <p>£{product.new_price}</p> : <p>No Price Available</p>}
                <button className='cartitems-quantity'>{cartQuantity}</button>
                {product.new_price !== undefined ? <p>£{product.new_price * cartQuantity}</p> : <p>No Total Available</p>}
                <img className='cartitems-remove-icon' src={remove_icon} onClick={() => { removeFromCart(product.id) }} alt="" />
              </div>
              <hr />
            </div>
          );
        }
        return null;
      })}
      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Cart Total</h1>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              {getTotalCartAmount !== undefined ? <p>£{getTotalCartAmount()}</p> : <p>No Subtotal Available</p>}
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <h3>Total</h3>
              {getTotalCartAmount !== undefined ? <h3>£{getTotalCartAmount()}</h3> : <h3>No Total Available</h3>}
            </div>
            <div className='cartitems-address'>
            <label htmlFor="address" className="cartitems-label">Delivery Address:</label>
            <input 
              value={userAddress}
              type="text" 
              id="address" 
              name="address" 
              placeholder='Enter your address here' 
              onChange={(e) => handleAddressChange(e.target.value)}
              className="cartitems-input"
            />
          </div>
          <div className="cartitems-note">
            <p className="cartitems-note-text">Note: Our salesperson will call you for order confirmation.</p>
          </div>
          </div>
          <button onClick={handleCheckout}>PLACE ORDER</button>
          {orderPlaced && (
            <div className="order-confirmation-popup">
              <p>Your order has been placed successfully!</p>
            </div>
          )}
          {!orderPlaced && (
            <div className="order-error-popup">
              <p>Select items and address to place an order!</p>
            </div>
          )}
        </div>
      </div>
    </div>
    
  );
}

export default CartItems;
