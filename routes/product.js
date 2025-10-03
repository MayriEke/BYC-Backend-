const { Category } = require("../model/category");
const { Product, validate } = require("../model/product");
const express = require("express");
const router = express.Router();


router.get("/test", (req, res) => {
  res.send("api  is working");
});

router.get("/", async (req, res) => {
  const product = await Product.find().sort("name");
  res.send(product)
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    const category = await Category.findById(req.body.categoryId);
    if (!category) return res.status(400).send("Invalid category id");
    let product = new Product({
      name: req.body.name,
      image: req.body.image,
      price: req.body.price,
      description: req.body.description,
      productNumber: req.body.productNumber,
      numberInStock: req.body.numberInStock,
      category: {
        _id: category._id,
        name: category.name,
      },
    });
    product = await product.save();
    res.send(product);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


router.put('/:id', async (req, res) => {
  console.log("Incoming request body:", req.body);
    const {error} = validate(req.body);
    if (error) return res.send(404).send(error.details[0].message)

    const category = await Category.findById(req.body.categoryId);
    if(!category) return res.status(400).send("Invalid category id");
    
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    image: req.body.image,
    numberInStock: req.body.numberInStock,
    productNumber: req.body.productNumber,
    category: {
          _id: category._id,
          name: category.name
      },
    rating: req.body.rating || '',
  }, 
  {new: true}
  );

  if(!updatedProduct) return res.status(404).send('The product with the given ID was not found.')
        res.json({product: updatedProduct, success: true, message: 'Product updated successfully'});
});

router.delete('/:id', async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id)
    if(!product) return res.status(404).send('The product with the given ID was not found')

    res.send(product)
});

router.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id)
    if(!product) return res.status(404).send('The product with the given ID was not found')

    res.send(product)
});


module.exports = router;
