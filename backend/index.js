const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(cors());

// Database connection with MongoDB
mongoose.connect("mongodb+srv://sgurminder982:sgurminder982@cluster0.bms91lv.mongodb.net/");

// API creation

app.get("/",(req, res)=>{
    res.send("Express App is running")
})

// Image Storage Engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb)=>{
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage: storage})

// Creating Upload Endpoint for images
app.use(`/images`, express.static('upload/images'))

app.post("/upload", upload.single('product'), (req, res)=>{
    console.log("Inside /upload endpoint");
    console.log("Request file:", req.file);
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    })
})

const uploadMultipleMiddleware = (req, res, next) => {
    const uploadMultiple = upload.array('relatedImages', 4); // 4 is the maximum number of files

    uploadMultiple(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            console.log("MulterError:", err);
            return res.status(500).json(err);
        } else if (err) {
            console.log("Error during upload:", err);
            return res.status(500).json(err);
        }

        console.log("Files received:", req.files);
        
        // At this point, `req.files` contains an array of related images
        const imageUrls = req.files.map(file => `http://localhost:${port}/images/${file.filename}`);
        req.imageUrls = imageUrls; // Attach imageUrls to the request object

        next(); // Move to the next middleware or route handler
    });
};

// Creating Endpoint to upload mulitple related images
app.post("/uploadMultiple", uploadMultipleMiddleware, (req, res) => {
    // Access the imageUrls from req.imageUrls
    const imageUrls = req.imageUrls;

    res.json({
        success: 1,
        imageUrls: imageUrls,
    });
});

// Schema for creating products
const Product = mongoose.model("Product", {
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    new_price: {
        type: Number,
        required: true,
    },
    old_price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    available: {
        type: Boolean,
        default: true,
    },
    description: {
        type: String,
        required: true,
    },
    relatedImages: {
        type: Array,
        required: true,
    },
});

//Creating middleware to fetch user
const fetchUser = async (req, res, next) => {
    try {
        // Check if 'auth-token' header is present in the request
        const token = req.header('auth-token') || req.header('Authorization');

        if (!token) {
            return res.status(401).send({
                errors: "Please authenticate using a valid token"
            });
        }

        // Extract user data from the token
        const data = jwt.verify(token.replace('Bearer ', ''), 'secret_ecom');
        console.log("Decoded Token Data:", data);

        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({
            errors: "Please authenticate using a valid token"
        });
    }
};


// Endpoint to save image in MongoDB
app.post('/addproduct', async(req, res)=>{
    try{
        let products = await Product.find({});
        let id;
        if(products.length>0) {
            let last_product_array = products.slice(-1);
            let last_product = last_product_array[0];
            id = last_product.id+1;
        }
        else {
            id = 1;
        }
        
        const product = new Product({
            id: id,
            name: req.body.name,
            image: req.body.image,
            category: req.body.category,
            new_price: req.body.new_price,
            old_price: req.body.old_price,
            date: req.body.date,
            available: req.body.available,
            description: req.body.description,
            relatedImages: req.body.relatedImages,
        });

        console.log(product);
        await product.save();
        console.log("Saved");

        //Generating response for frontend
        res.json({
            success: true,
            name: req.body.name,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// Creating API for deleting Products
app.post('/removeproduct', async(req, res)=>{
    await Product.findOneAndDelete({
        id: req.body.id
    });
    console.log("Removed");
    res.json({
        success: true,
        name: req.body.name,
    });
});

// Creating API/Endpoint for getting all products
app.get('/allproducts', async(req, res)=>{
    let products = await Product.find({});
    console.log("All Products fetched.");
    res.send(products);
});

// Schema creation for user model
const Users = mongoose.model("Users", {
    name: {
        type: String,
    },
    email: {
        type: String, 
        unique: true,
    },
    password: {
        type: String,
    },
    cartData:{
        type: Object,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    address: {
        type: String,
    },
    contact: {
        type: String,
    },
});

// Creating Endpoint for registering the user
app.post('/signup', async (req, res) => {
    try {
        // Validate the email and password format
        const { email, password, username, address, contact } = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Check if any of the required fields are missing
        if (!email || !password || !username || !address || !contact) {
            return res.status(400).json({
                success: false,
                errors: 'Please provide values for all required fields (email, password, username, address, contact).',
            });
        }

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                errors: 'Invalid email format',
            });
        }

        // Check if the email exists in the database
        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                errors: 'Existing user found with the same email address',
            });
        }

        // Validate password strength
        // At least 8 characters, at least one lowercase letter, one uppercase letter, one number, and one special character
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                success: false,
                errors: 'Weak password. It should have at least 8 characters, one lowercase letter, one uppercase letter, one number, and one special character.',
            });
        }

        // If all required fields are provided, email is valid, does not exist, and password is strong, proceed with user registration
        let cart = {};
        for (let i = 0; i < 300; i++) {
            cart[i] = 0;
        }

        const user = new Users({
            name: username,
            email,
            password,
            cartData: cart,
            address,
            contact,
        });

        await user.save();

        // For user authentication
        const data = {
            user: {
                id: user.id,
            },
        };

        const token = jwt.sign(data, 'secret_ecom');
        res.json({
            success: true,
            token,
        });
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).json({
            success: false,
            errors: 'Internal Server Error',
        });
    }
});

//Creating endpoint for user login
app.post('/login', async(req, res) => {
    let user = await Users.findOne({email: req.body.email});
    if(user) {
        const passCompare = req.body.password === user.password;
        if(passCompare) {
            const data = {
                user: {
                    id: user.id
                }
            }
            const token = jwt.sign(data, 'secret_ecom');
            res.json({
                success: true,
                token
            });
        }
        else {
            res.json({
                success: false,
                errors: "Wrong Password",
            });
        }
    }
    else {
        res.json({
            success: false,
            errors: "Wrong Email"
        });
    }
})

// Creating endpoint for new collection data
app.get('/newcollections', async(req, res) => {
    let products = await Product.find({});
        
        if (products.length === 0) {
            console.log("No products found.");
            return res.status(404).send("No products found.");
        }

        // Assuming you want the last 8 products in the collection
        let newcollection = products.slice(-8);

        console.log("New Collection Fetched");
        res.send(newcollection);
});

//Creating endpoint for appliances data
app.get('/appliances', async(req, res) => {
    let products = await Product.find({
        category: "appliances"
    });
    let popular_in_appliances = products.slice(-4);
    console.log("Recent Appliances fetched");
    res.send(popular_in_appliances);
});

//Creating endpoint for adding products in cartdata
app.post('/addtocart', fetchUser, async(req, res) => {
    
    let userData = await Users.findOne({
        _id: req.user.id
    });

    userData.cartData[req.body.itemId] += 1;

    await Users.findOneAndUpdate({_id: req.user.id},
        {cartData:userData.cartData});

    res.send("Added")
})

//Creating endpoint to remove product from cartData
app.post('/removefromcart', fetchUser, async(req, res) => {
    let userData = await Users.findOne({
        _id: req.user.id
    });

    if(userData.cartData[req.body.itemId]>0)
        userData.cartData[req.body.itemId] -= 1;

    await Users.findOneAndUpdate({_id: req.user.id},
        {cartData:userData.cartData});

    res.send("Removed")
})

//Creating endpoint to get cartdata
app.post('/getcart', fetchUser, async(req, res) => {
    console.log("GetCart");
    let userData = await Users.findOne({_id : req.user.id});
    res.json(userData.cartData);
})

app.listen(port, (error)=>{
    if(!error) {
        console.log("Server Running on Port " + port);
    }
    else {
        console.log("Error : " + error);
    }
})

// Creating endpoint to get details of the current user
app.get('/currentuser', fetchUser, async (req, res) => {
    try {
        // Log the user ID received from the token
        console.log("User ID from token:", req.user.id);

        // Fetch user details from the database using the user ID
        const user = await Users.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                errors: 'User not found',
            });
        }

        // Return the full user object for debugging
        res.json({
            success: true,
            user: user,
        });
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({
            success: false,
            errors: 'Internal Server Error',
        });
    }
});

// Creating endpoint to update user details
app.post('/updateuser', fetchUser, async (req, res) => {
    try {
        const userId = req.user.id; // Get the user ID from the decoded token
        const updatedUserDetails = req.body;

        console.log("Updated user details : ");
        console.log(updatedUserDetails);

        // Update user details in the database
        await Users.findByIdAndUpdate(userId, updatedUserDetails);

        res.json({
            success: true,
            message: 'User details updated successfully',
        });
    } catch (error) {
        console.error('Error updating user details:', error);
        res.status(500).json({
            success: false,
            errors: 'Internal Server Error',
        });
    }
});

//Schema for order
const Order = mongoose.model("Order", {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    cartItems : {
        type: Object,
        required: true,
    },
    totalCartAmount : {
        type : Number,
        required : true,
    },
    userAddress : {
        type : String,
        required : true,
    },
    date : {
        type : Date,
        default : Date.now,
    },
    currentUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
    }
});

// API Endpoint for storing orders placed
app.post('/placeorder', fetchUser, async (req, res) => {
    try {
        const { cartItems, totalCartAmount, userAddress, currentUser, image } = req.body;

        const order = new Order({
            userId: currentUser.id,
            cartItems,
            totalCartAmount,
            userAddress,
            currentUser,
        });

        await order.save();

        res.json({
            success: true,
            message: 'Order placed successfully',
        });
        // implement this function in your ShopContext
        // For example: clearCart(req.user.id);
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({
            success: false,
            errors: 'Internal Server Error',
        });
    }
});

//Endpoint for fetching placed orders
app.get('/allorders', async(req, res) => {
    let orders = await Order.find({});
    console.log("Orders fetched!");
    console.log(orders);
    res.send(orders);
});

// Endpoint for deleting order
app.post('/removeorder', async (req, res) => {
    try {
        const orderId = req.body.id;

        const deletedOrder = await Order.findByIdAndDelete(orderId);

        if (!deletedOrder) {
            console.log("Order not found");
            return res.status(404).json({
                success: false,
                error: 'Order not found',
            });
        }

        console.log("Order Removed");
        res.json({
            success: true,
            name: deletedOrder.currentUser.name,
        });
    } catch (error) {
        console.error('Error removing order:', error);
        res.status(500).json({
            success: false,
            errors: 'Internal Server Error',
        });
    }
});

// Endpoint to get user details by userId
app.get('/user/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await Users.findById(userId);
  
      if (!user) {
        return res.status(404).json({
          success: false,
          errors: 'User not found',
        });
      }
  
      res.json({
        success: true,
        user: user,
      });

      console.log("User info using ID fetched : ");
      console.log(user);

    } catch (error) {
      console.error('Error fetching user details:', error);
      res.status(500).json({
        success: false,
        errors: 'Internal Server Error',
      });
    }
  });

const getDefaultCart = ()=>{
    let cart = {};
    for(let index = 0; index<300+1 ; index++) {
        cart[index] = 0;
    }
    return cart;
}

// Endpoint to empty user's cart
app.post('/emptycart', fetchUser, async (req, res) => {
    try {
        const userId = req.user.id;

        // Update user's cartData to an empty cart
        await Users.findByIdAndUpdate(userId, { cartData: getDefaultCart() });

        res.json({
            success: true,
            message: 'User cart emptied successfully',
        });
    } catch (error) {
        console.error('Error emptying user cart:', error);
        res.status(500).json({
            success: false,
            errors: 'Internal Server Error',
        });
    }
});

  
