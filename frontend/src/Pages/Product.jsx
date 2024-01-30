import React, { useState, useEffect, useContext } from 'react';
import { ShopContext } from '../Context/ShopContext';
import { useParams } from 'react-router-dom';
import Breadcrum from '../Components/Breadcrums/Breadcrum';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import RelatedProducts from '../Components/RelatedProducts/RelatedProducts';

const Product = () => {
  const { all_products } = useContext(ShopContext);
  const { productId } = useParams();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);

  console.log("All product data: ");
  console.log(all_products);
  
  useEffect(() => {
    const fetchData = async () => {
      if (all_products && all_products.length > 0) {
        const fetchedProduct = all_products.find((e) => e.id === Number(productId));
        setProduct(fetchedProduct);
        setLoading(false);
      }
    };

    fetchData();
  }, [all_products, productId]);

  // Check if product is defined before rendering
  if (loading) {
    return <div>Loading...</div>; // Display a loading indicator while fetching data
  }

  return (
    <div>
      {product ? (
        <>
          <Breadcrum product={product} />
          <ProductDisplay product={product} />
        </>
      ) : (
        <div>Product is just uploaded by the vendor, please refresh the page.</div>
      )}
      <RelatedProducts />
    </div>
  );
};

export default Product;
