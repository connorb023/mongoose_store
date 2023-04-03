// Dependcies 
const express = require("express")
const mongoose = require("mongoose")
const Product = require("./models/products")
const methodOverride = require("method-override")
require ("dotenv").config()
const app = express()
const PORT = process.env.PORT;

mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection

db.on('error', (err) => console.log(' is mongo not running?'));
db.on('connected', () => console.log('mongo connected :)'));
db.on('disconnected', () => console.log('mongo disconnected :('));

app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(methodOverride("_method"))
app.use("/public", express.static('public'));


app.get("/",(req,res) => {
    res.send("working");
})

// Index

app.get('/products', async (req, res) => {
    const allProducts = await Product.find({})
    res.render('index.ejs', {
        products: allProducts})
})


// New 
app.get("/new", (req,res) => {
    res.render("new.ejs")
})

//Delete
app.delete('/products/:id', async (req, res) => {
 
    await Product.findByIdAndDelete(req.params.id);
    res.redirect("/products")
})

// Update

app.put('/products/:id', async (req, res) => {
    await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
    );
    res.redirect(`/products/${req.params.id}`)
});


// Create 
 app.post("/new", (req,res) => {
    const product = new Product (req.body)
    product.save().then(res.redirect("/products"))  
});

// Edit
app.get('/products/:id/edit', async (req, res) => {
  const product = await Product.findById(
      req.params.id,);
  res.render("edit.ejs", {product})
});

// Show 
app.get("/productpage", (req,res) => {
    res.render("show.ejs")
})

app.get('/products/:id', async (req, res) => {  
 const foundProduct = await Product.findById(req.params.id).exec()
 res.render('show.ejs', {product: foundProduct, });

});

app.post("/products/:id/buy", async (req, res) => {
  try {
    
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send("Error product not found");
    }
    if (product.qty <= 0) {
      return res.status(400).send("Warning product out of stock");
    }
    product.qty -= 1;
    await product.save();
    res.redirect(`/products/${product._id}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

// Listener
app.listen(PORT, () => {
    console.log(`listening at  ${PORT}`)
})