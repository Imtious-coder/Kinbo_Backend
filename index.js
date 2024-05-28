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
})

app.listen(port, (err) => {
  if(!err) {
    console.log("Server is running on port " + port)
  } else {
    console.log("Something is wrong" + err)
  }
});