const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');

const Product = require('./models/product');

const app = express();

// db connection
mongoose.connect('mongodb+srv://mragodoy:K92tCSHC89r9ykLR@cluster0.edinewt.mongodb.net/?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.error('Connexion à MongoDB échouée !'));


// CORS policies settings
app.use((req, res, next) => {

  res.setHeader('Access-Control-Allow-Origin', '*');

  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');

  next();
});


app.use(bodyParser.json());

// Save a new product
app.post("/api/products", (req, res, next) => {
  delete req.body._id;
  const product = new Product({
    ...req.body,
  });
  product
    .save()
    .then(() => res.status(201).json({ product }))
    .catch((error) => res.status(400).json({ error }));
});

// Get a product by id
app.get("/api/products/:id", (req, res, next) => {
  Product.findOne({ _id: req.params.id })
    .then((product) => res.status(200).json({ product }))
    .catch((error) => res.status(404).json({ error }));
});

// Get all products
app.get("/api/products", (req, res, next) => {
  Product.find()
    .then((products) => res.status(200).json({ products }))
    .catch((error) => res.status(400).json({ error }));
});

// Modify a product
app.put("/api/products/:id", (req, res, next) => {
  Product.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Modified!" }))
    .catch((error) => res.status(400).json({ error }));
});

// Delete a product
app.delete("/api/products/:id", (req, res, next) => {
  Product.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "Deleted! " }))
    .catch((error) => res.status(400).json({ error }));
});

module.exports = app;
