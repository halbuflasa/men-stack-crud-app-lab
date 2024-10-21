const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected",()=>{
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

const Plant = require("./models/plant.js");
app.get("/", async (req, res) => {
  res.render("index.ejs");
});

app.get('/plants/new', (req, res) =>{
  res.render("plants/new.ejs");
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});

