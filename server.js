const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const app = express();
const methodOverride = require("method-override"); 
const morgan = require("morgan"); 

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

const Plant = require("./models/plant.js");
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method")); 
app.use(morgan("dev")); 
/////////////////////IMAGES///////////////////
// Define the multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the uploads directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to filename
  },
});

// Create an instance of multer with the defined storage
const upload = multer({ storage });

// Serve the uploads folder statically
app.use("/uploads", express.static("uploads"));
/////////////////////////////////////////////////////////

app.get("/", async (req, res) => {
  res.render("index.ejs");
});

app.get("/plants", async (req, res) => {
  const allPlants = await Plant.find();
  console.log(allPlants); 
  res.render("plants/index.ejs", { plants: allPlants });
});

app.get('/plants/new', async (req, res) => {
  res.render("plants/new.ejs");
});

app.get("/plants/:plantId", async (req, res) => {
  const foundPlant = await Plant.findById(req.params.plantId);
  res.render("plants/show.ejs", { plant: foundPlant });
});

// Use upload.single for handling the image upload in the form
app.post("/plants", upload.single("image"), async (req, res) => {
  const plantData = {
    name: req.body.name,
    description: req.body.description,
    image: req.file ? req.file.filename : null, // Save the filename of the uploaded image
  };
  await Plant.create(plantData);
  res.redirect("/plants");
});

app.delete("/plants/:plantId", async (req, res) => {
  await Plant.findByIdAndDelete(req.params.plantId);
  res.redirect("/plants");
});


app.get("/plants/:plantId/edit", async (req, res) => {
  const foundPlant= await Plant.findById(req.params.plantId);
  res.render("plants/edit.ejs", {
    plant: foundPlant,
  });
});

app.put("/plants/:plantId", upload.single("image"), async (req, res) => {
  const plantData = {
    name: req.body.name,
    description: req.body.description,
    image: req.file ? req.file.filename : req.body.existingImage, // Use the new file if uploaded, otherwise keep the existing image
  };

  await Plant.findByIdAndUpdate(req.params.plantId, plantData);
  res.redirect(`/plants/${req.params.plantId}`);
});


app.listen(3000, () => {
  console.log("Listening on port 3000");
});
