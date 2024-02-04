import React, { useEffect, useState } from 'react'
import './NewCollections.css'
import Item from '../Items/Item'

const NewCollections = () => {

  const [new_collection, setNew_collection] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/newcollections')
        .then((response) => response.json())
        .then((data) => {
            setNew_collection(data);
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
}, []);

  return (
    <div className='new-collections' id='newcollections'>
      <h1>FRESH ARRIVALS - Explore the new Collection here</h1>
      <hr />
      <div className="collections">
        {new_collection.map((item, i)=>{
            return <Item 
              key={i} 
              id={item.id} 
              name={item.name}
              image={item.image} 
              new_price={item.new_price}
              old_price={item.old_price}
            />
        })}
      </div>
    </div>
  )
}

export default NewCollections
