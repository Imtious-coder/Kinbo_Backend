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

// Database connection with mongoDB
mongoose.connect("mongodb+srv://kinbo:kinbo@cluster0.azdemqf.mongodb.net/kinbo")

// API
app.get("/", (req, res) => {
  res.send("Backend is running perfeclty.")
});

// Image storing functionality 
const storage = multer.diskStorage({
  destination: "./Images",
  filename: (req, file, cb) => {
    return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
  }
});

const upload = multer({ storage: storage});

// Creating upload enpoint for images
app.use("/images", express.static("./Images"));

app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success : 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`
  })
});

// Schema for creating products.
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
})

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

// APP
app.listen(port, (err) => {
  if(!err) {
    console.log("Server is running on port " + port)
  } else {
    console.log("Something is wrong" + err)
  }
});