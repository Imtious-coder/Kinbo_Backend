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

// APP
app.listen(port, (err) => {
  if(!err) {
    console.log("Server is running on port " + port)
  } else {
    console.log("Something is wrong" + err)
  }
});