import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './RelatedProducts.css';
import Item from '../Items/Item';

const RelatedProducts = () => {
  const [related_products, setRelatedProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/newcollections')
      .then((response) => response.json())
      .then((data) => {
        setRelatedProducts(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const NextArrow = (props) => {
    const { onClick } = props;
    return <div className="slick-arrow slick-next" onClick={onClick}></div>;
  };

  const PrevArrow = (props) => {
    const { onClick } = props;
    return <div className="slick-arrow slick-prev" onClick={onClick}></div>;
  };

  const settings = {
    infinite: true,
    slidesToScroll: 1,
    slidesToShow: 4,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className='relatedproducts'>
      <h1>MORE PRODUCTS</h1>
      <hr />
      <div className="relatedproducts-slider">
        <div className="relatedproducts-arrows">
          <Slider {...settings}>
            {related_products.map((item, i) => (
              <Item
                key={item.id}
                id={item.id}
                name={item.name}
                image={item.image}
                new_price={item.new_price}
                old_price={item.old_price}
              />
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default RelatedProducts;
