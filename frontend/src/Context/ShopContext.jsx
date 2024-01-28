import React, { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);

const getDefaultCart = ()=>{
    let cart = {};
    for(let index = 0; index<300+1 ; index++) {
        cart[index] = 0;
    }
    return cart;
}

const ShopContextProvider = (props)=>{

    const [all_products, setAll_Product] = useState([]);
    const [cartItems,setCartItems] = useState(getDefaultCart());
    
    useEffect(() => {
        fetch('http://localhost:4000/allproducts')
            .then((response) => response.json())
            .then((data) => {
                setAll_Product(data);
            });
    
        if (localStorage.getItem('auth-token')) {
            fetch('http://localhost:4000/getcart', {
                method: 'POST',
                headers: {
                    Accept: 'application/form-data',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json'
                },
                body: "",
            })
            .then((response) => response.json())
            .then((data) => setCartItems(data))
            .catch((error) => console.error('Error fetching cart data:', error));
        }
    }, []);    

    const addToCart = (itemId) => {
        setCartItems((prev)=>({...prev, [itemId]:prev[itemId]+1}))
        if(localStorage.getItem('auth-token')) {
            fetch('http://localhost:4000/addtocart', {
                method: 'POST',
                headers: {
                    Accept: 'application/form-data',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({"itemId" : itemId})
            })
            .then((response)=>response.json())
            .then((data)=>console.log(data));
        }
    }    

    const removeFromCart = (itemId) => {
        setCartItems((prev)=>({...prev, [itemId]:prev[itemId]-1}));
        if(localStorage.getItem('auth-token')) {
            fetch('http://localhost:4000/removefromcart', {
                method: 'POST',
                headers: {
                    Accept: 'application/form-data',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({"itemId" : itemId})
            })
            .then((response)=>response.json())
            .then((data)=>console.log(data));
        }
    }

    const emptyCart = async () => {
        setCartItems(getDefaultCart());
        try {
            const response = await fetch('http://localhost:4000/emptycart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                },
            });
    
            const data = await response.json();
    
            if (response.ok) {
                console.log('Cart emptied successfully');
            } else {
                console.error('Error emptying cart:', data.errors);
            }
        } catch (error) {
            console.error('Error emptying cart:', error);
        }
    };    

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
          if (cartItems[item] > 0) {
            const itemId = Number(item);
            let itemInfo = all_products.find((product) => product.id === itemId);
            console.log('item:', itemId, 'itemInfo:', itemInfo);
            if (itemInfo && itemInfo.new_price) {
              totalAmount += itemInfo.new_price * cartItems[item];
            }
          }
        }
        console.log('totalAmount:', totalAmount);
        return totalAmount;
      }
      
    

    const getTotalCartItems = () => {
        let totalItem = 0;

        for(const item in cartItems) {
            if(cartItems[item]>0) {
                totalItem += cartItems[item];
            }
        }

        return totalItem;
    }

    const contextValue = {getTotalCartItems, emptyCart, getTotalCartAmount, all_products, cartItems, addToCart, removeFromCart};

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;

//all products data can be accessed from here to be used in different components