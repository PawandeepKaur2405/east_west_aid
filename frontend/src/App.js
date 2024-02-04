import './App.css';
import Navbar from './Components/Navbar/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Shop from './Pages/Shop';
import ShopCategory from './Pages/ShopCategory';
import LoginSignup from './Pages/LoginSignup';
import Cart from './Pages/Cart';
import Product from './Pages/Product';
import Footer from './Components/Footer/Footer';
import furniture_banner from './Components/Assets/banner_furniture.png'
import appliances_banner from './Components/Assets/banner_appliances.png'
import refurbished_banner from './Components/Assets/banner_refurbished.png'
import Profile from './Components/Profile/Profile';
import NewCollections from './Components/NewCollections/NewCollections';

function App() {
  return (
    <div>
      <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Shop/>}/>
        <Route path='/furniture' element={<ShopCategory banner={furniture_banner} category="furniture"/>}/>
        <Route path='/appliances' element={<ShopCategory banner={appliances_banner} category="appliances"/>}/>
        <Route path='/refurbished' element={<ShopCategory banner={refurbished_banner} category="refurbished"/>}/>
        <Route path="/product" element={<Product/>}>
          <Route path=":productId" element={<Product/>}/>
        </Route>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/login' element={<LoginSignup/>}/>
        <Route path='/profile' element={<Profile/>} />
        <Route path='/shop/newcollections' element={<NewCollections/>} />
      </Routes>
      <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
