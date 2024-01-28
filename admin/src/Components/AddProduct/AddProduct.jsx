import React, { useState } from 'react';
import './AddProduct.css';
import upload_area from '../../assets/upload_area.svg';

const AddProduct = () => {
  const [image, setImage] = useState(false);
  const [relatedImages, setRelatedImages] = useState([]);
  const [productDetails, setProductDetails] = useState({
    name: '',
    image: '',
    category: 'appliances',
    new_price: '',
    old_price: '',
    description: '',
    relatedImages: [],
  });

  const imageHandler = (e) => {
    if (e.target.name === 'mainImage') setImage(e.target.files[0]);
    else if (e.target.name === 'relatedImages')
      setRelatedImages([...relatedImages, ...e.target.files]);
  };

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const resetImagePreviews = () => {
    setImage(null);
    setRelatedImages([]);
  };

  const Add_Product = async () => {
    console.log(productDetails);
    let responseData;
    let product = { ...productDetails };

    let formData = new FormData();
    formData.append('product', image);

    await fetch('http://localhost:4000/upload', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: formData,
    })
      .then((resp) => resp.json())
      .then((data) => {
        responseData = data;
      });

    if (responseData.success) {
      product.image = responseData.image_url;
      console.log(product);

      // Process related images
      const relatedImagesFormData = new FormData();
      relatedImages.forEach((relatedImage) => {
        relatedImagesFormData.append('relatedImages', relatedImage);
      });

      await fetch('http://localhost:4000/uploadMultiple', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: relatedImagesFormData,
      })
        .then((resp) => resp.json())
        .then((data) => {
          product.relatedImages = data.imageUrls;
        });

      console.log(product);

      await fetch('http://localhost:4000/addproduct', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      })
        .then((resp) => resp.json())
        .then((data) => {
          data.success ? ProductUploadSuccess() : alert('Failed');
        });
    }
  };

  const ProductUploadSuccess = () => {
    alert('Product Added');
    setProductDetails({
      name: '',
      image: '',
      category: 'appliances',
      new_price: '',
      old_price: '',
      description: '',
      relatedImages: [],
    });
  
    resetImagePreviews(); // Reset image previews
  
    // Clear file input for related images
    const relatedImagesInput = document.getElementById('relatedImages');
    if (relatedImagesInput) {
      relatedImagesInput.value = null;
    }
  };

  return (
    <div className='add-product'>
      <div className='addproduct-itemfield'>
        <p>Product Title</p>
        <input value={productDetails.name} onChange={changeHandler} type='text' name='name' placeholder='Type here' />
      </div>
      <div className='addproduct-price'>
        <div className='addproduct-itemfield'>
          <p>Price</p>
          <input value={productDetails.old_price} onChange={changeHandler} type='text' name='old_price' placeholder='Type here' />
        </div>
        <div className='addproduct-itemfield'>
          <p>Offer Price</p>
          <input value={productDetails.new_price} onChange={changeHandler} type='text' name='new_price' placeholder='Type here' />
        </div>
      </div>
      <div className='addproduct-itemfield'>
        <p>Product Category</p>
        <select value={productDetails.category} onChange={changeHandler} name='category' className='addproduct-selector'>
          <option value='furniture'>Furniture & Related</option>
          <option value='appliances'>Appliances</option>
          <option value='refurbished'>Refurbished</option>
        </select>
      </div>
      <div className='addproduct-itemfield'>
        <p>Product Description</p>
        <input value={productDetails.description} onChange={changeHandler} type='text' name='description' placeholder='Tell about product'></input>
      </div>
      {/* Main Image Preview */}
      <div className='addproduct-itemfield'>
        <label htmlFor='mainImage'>
          {image ? (
            <img src={URL.createObjectURL(image)} alt='' className='addproduct-thumnail-img' />
          ) : (
            <img src={upload_area} alt='' className='addproduct-thumnail-img' />
          )}
        </label>
        <input onChange={imageHandler} type='file' name='mainImage' id='mainImage' hidden />
      </div>

      {/* Related Images Preview */}
    <div className='addproduct-itemfield'>
        <label htmlFor='relatedImages'>Related Images</label>
        <input type='file' name='relatedImages' id='relatedImages' onChange={imageHandler} multiple />
        <div className='related-images-preview'>
            {relatedImages.map((relatedImage, index) => (
            <div key={index} className='related-image-preview'>
                <img
                src={URL.createObjectURL(relatedImage)}
                alt={`Related Image ${index + 1}`}
                className='addproduct-thumnail-img'
                />
                {/* Add a placeholder or any relevant content */}
                <span>Image {index + 1}</span>
            </div>
            ))}
        </div>
    </div>


      <button onClick={() => Add_Product()} className='addproduct-btn'>
        ADD
      </button>
    </div>
  );
};

export default AddProduct;
