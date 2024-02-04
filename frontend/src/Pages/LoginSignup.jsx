import React, { useState } from 'react'
import './CSS/LoginSignup.css'

const LoginSignup = () => {

  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    address: "",
    contact: "",
  });

  const login = async () => {
    console.log("Login", formData);

    try {
        const response = await fetch('http://localhost:4000/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const responseData = await response.json();

        if (responseData && responseData.success) {
            localStorage.setItem('auth-token', responseData.token);
            window.location.replace("/");
        } else {
            alert(responseData && responseData.errors ? responseData.errors : "Unknown error");
        }
    } catch (error) {
        console.error('Error during login:', error);
    }
}

const signup = async () => {
    console.log("Signup", formData);

    try {
        const response = await fetch('http://localhost:4000/signup', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const responseData = await response.json();

        if (responseData && responseData.success) {
            localStorage.setItem('auth-token', responseData.token);
            window.location.replace("/");
        } else {
            alert(responseData && responseData.errors ? responseData.errors : "Unknown error");
        }
    } catch (error) {
        console.error('Error during signup:', error);
    }
}


  const changeHandler = (e) => {
    setFormData({
      ...formData,[e.target.name]:e.target.value
    })
  }

  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state === "Sign Up"?<input name='username' value={formData.username} onChange={changeHandler} type="text" placeholder='Your Name' />:<></>}
          <input name='email' value={formData.email} onChange={changeHandler} type="email" placeholder='Email Address' />
          <input name='password' value={formData.password} onChange={changeHandler} type="password" placeholder='Password' />
          {state === "Sign Up" ? <input name='contact' value={formData.contact} onChange={changeHandler} type="text" placeholder='Contact' /> : <></>}
        {state === "Sign Up" ? <input name='address' value={formData.address} onChange={changeHandler} type="text" placeholder='Address' /> : <></>}
        </div>
        <button onClick={()=>{state==="Login"?login():signup()}}>Continue</button>
        {state === "Sign Up" ? 
        <p className='loginsignup-login'>Already have an account? <span onClick={()=>{setState("Login")}}>Login Here</span></p> :
        <p className='loginsignup-login'>Create an account? <span onClick={()=>{setState("Sign Up")}}>Click Here</span></p>}
      </div>
    </div>
  )
}

export default LoginSignup
