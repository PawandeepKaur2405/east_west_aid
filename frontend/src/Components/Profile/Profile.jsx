import React, { useState, useEffect } from 'react';
import './Profile.css';

const Profile = () => {
  const [currentUser, setCurrentUser] = useState({});
  const [updatedUser, setUpdatedUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);

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
        } else {
          console.error('Error fetching current user:', responseData.errors);
        }
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const handleInputChange = (e) => {
    setUpdatedUser((prevUpdatedUser) => ({
      ...prevUpdatedUser,
      [e.target.name]: e.target.value,
    }));
  };
  

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('auth-token');

      console.log("Inside handle save : ");
      console.log(updatedUser);

      if (token) {
        const response = await fetch('http://localhost:4000/updateuser', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedUser),
        });

        const responseData = await response.json();

        if (responseData.success) {
          setIsEditing(false);
          fetchCurrentUser(); // Refresh user details after the update
        } else {
          console.error('Error updating user details:', responseData.errors);
        }
      }
    } catch (error) {
      console.error('Error updating user details:', error);
    }
  };

  return (
    <div className='profile'>
      <div className='profile-container'>
        <h1>My Profile</h1>
        <div className='profile-details'>
          <input
            type='text'
            name='name'
            placeholder='Enter your name'
            value={isEditing ? updatedUser.name || '' : currentUser?.name || ''}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
          <input
            type='email'
            name='email'
            placeholder='Email'
            value={currentUser?.email || ''}
            disabled
          />
          <input
            type='text'
            name='address'
            placeholder='Address'
            value={isEditing ? updatedUser.address || '' : currentUser?.address || ''}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
          <input
            type='tel'
            name='contact'
            placeholder='Phone No.'
            value={isEditing ? updatedUser.contact || '' : currentUser?.contact || ''}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>
        {isEditing ? (
          <button onClick={handleSave}>Save</button>
        ) : (
          <button onClick={() => {
            setUpdatedUser({ ...currentUser });
            setIsEditing(true);
          }}>Edit</button>
        )}
      </div>
    </div>
  );
};

export default Profile;
