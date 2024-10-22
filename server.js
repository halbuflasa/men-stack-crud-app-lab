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
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  res.render("index.ejs");
});

app.get("/plants", async (req, res) => {
  const allPlants = await Plant.find();
  console.log(allPlants); 
  res.render("plants/index.ejs", { plants: allPlants });
});

app.get('/plants/new', async (req, res) =>{
  res.render("plants/new.ejs");
});
app.post('/plants', async (req, res)=>{
  await Plant.create(req.body)
  res.redirect("/plants");
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});

