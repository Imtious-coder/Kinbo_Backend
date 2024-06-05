const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { error, log } = require("console");

app.use(express.json());
app.use(cors());

// DATABASE CONNECTION (mongodb)
mongoose.connect("mongodb+srv://kinbo:kinbo@cluster0.azdemqf.mongodb.net/kinbo");

// API (home-page)
app.get("/", (req, res) => {
  res.send("Backend is running perfeclty.")
});

// IMAGE UPLOAD FUNCTIONALITY 
const storage = multer.diskStorage({
  destination: "./Images",
  filename: (req, file, cb) => {
    return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
  }
});
const upload = multer({ storage: storage});

// UPLOAD ENDPOINT FOR IMAGES
app.use("/images", express.static("./Images"));

app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success : 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`
  })
});

// SCHEMA (create-product)
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
});
// SCHEMA (create-user)
const Users = mongoose.model("Users", {
  name: {
    type: String,
  },
  email : {
    type: String,
    unique: true,
  },
  password : {
    type: String,
  },
  cartData : {
    type: Object,
  },
  date : {
    type: Date,
    default: Date.now(),
  },
});

// ADD PRODUCT FUNCTIONALITY
app.post("/addproduct", async (req, res) => {
  let products = await Product.find({});
  let id;
  if(products.length > 0) {
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id + 1;
  } else {
    id = 1;
  }
  const product = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });
  console.log(product, "Created product");
  await product.save();
  console.log("Product Saved");
  res.json({
    success: true,
    name: req.body.name,
  })
});

// DELETE PRODUCT FUNCTIONALITY
app.post("/removeproduct", async (req, res) => {
  await Product.findOneAndDelete({id:req.body.id});
  console.log("Product Removed.");
  res.json({
    success: true,
    name: req.body.name,
  })
});

// ALL PRODUCTS GET FUNCTIONALITY
app.get("/allproducts", async (req, res) => {
  let products = await Product.find({});
  console.log("ALL Products Fetched.");
  res.send(products);
});
// app.post("/allproducts", async (req, res) => {
//   let products = await Product.find({})
//   console.log("ALL Products Fetched.");
//   res.send(products);
// })

// NEW USER SIGNUP FUNCTIONALITY
app.post("/signup", async (req, res) => {
  // check existing user
  let check = await Users.findOne({email: req.body.email});
  if (check) {
    return res.status(400).json({
      success: false,
      error: "User already exist.",
    })
  };

  // cart details
  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  };

  // new user create
  const user = new Users({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
  });

  // token generate
  await user.save();
  const data = {
    user: {
      id: user.id,
    }
  };
  const token = jwt.sign(data, "secret_ecom");
  res.json({
    success: true,
    token
  });

});

// LOGIN FUNCTIONALITY
app.post("/login", async (req, res) => {
  let user = await Users.findOne({
    email: req.body.email
  });
  if(user) {
    const passCompare = req.body.password === user.password;
    if(passCompare) {
      const data = {
        user: {
          id: user.id
        }
      }
      const token = jwt.sign(data, "secret_ecom");
      res.json({
        success:true,
        token,
      });
    } else {
      res.json({
        success:false,
        error: "Wrong Password",
      });
    }
  } else {
    res.json({
      success: false,
      error: "Wrong Email ID"
    });
  }
});

app.get("/newcollection", async (req, res) => {
  let products = await Product.find({});
  let newcollection = products.slice(1).slice(-8);
  console.log("New Collection");
  res.send(newcollection);
});

app.get("/popularInWomen", async (req, res) => {
  let products = await Product.find({category: "women"});
  let popularInWomen = products.slice( 0, 4 );
  console.log("Popular In Women");
  res.send(popularInWomen);
})

// const fetchUser = async (req, res, next) => {
//   const token = req.header("auth-token");
//   if (!token) {
//     res.status(401).send({error: "Wrong token"})
//   } else {
//     try{
//       const data = jwt.verify(token, "secret_ecom");
//       req.user = data.user;
//       next();
//     } catch (error) {
//       res.status(401).send({error:"Token is invalid"})
//     }
//   }
// };

// app.post("/addtocart", fetchUser, async (req, res) => {
//   let userData = await Users.findOne({
//     _id: req.user.id,
//   });
//   userData.cartData[req.body.itemId] + 1;
//   await Users.findOneAndUpdate({_id:req.user.id}, {cartData:userData.cartData});
//   res.send("Added");
//   console.log(req.body, req.user);
// });

// APP
app.listen(port, (err) => {
  if(!err) {
    console.log("Server is running on port " + port)
  } else {
    console.log("Something is wrong" + err)
  }
});













































