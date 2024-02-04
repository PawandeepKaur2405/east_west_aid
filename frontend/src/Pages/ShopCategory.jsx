import React, { useContext, useState } from 'react'
import './CSS/ShopCategory.css'
import { ShopContext } from '../Context/ShopContext'
import Item from '../Components/Items/Item'

const ShopCategory = (props) => {
  const { all_products } = useContext(ShopContext)
  const [visibleItems, setVisibleItems] = useState(50)

  const loadMoreItems = () => {
    setVisibleItems((prevVisibleItems) => prevVisibleItems + 50)
  }

  return (
    <div className='shop-category'>
      <img className='shopcategory-banner' src={props.banner} alt="" />
      <div className="shopcategory-products">
        {all_products.slice(0, visibleItems).map((item, i) => {
          if (props.category === item.category) {
            return <Item key={i} id={item.id} name={item.name}
              image={item.image} new_price={item.new_price}
              old_price={item.old_price} />
          } else {
            return null
          }
        })}
      </div>
      {visibleItems < all_products.length && (
        <div className="shopcategory-loadmore" onClick={loadMoreItems}>
          Explore more
        </div>
      )}
    </div>
  )
}

export default ShopCategory
