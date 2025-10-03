const { Category, validate } = require("../model/category");
const express = require('express');
const router = express.Router();


router.get('/', async(req, res) => {
    const category = await Category.find().sort('name')
    res.send(category)
});


router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(404).send(error.details[0].message) 
    
    let category = new Category({
        name: req.body.name  
    });

    category = await category.save()
    res.send(category)
});

router.put('/:id', async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(404).send(error.details[0].message)
        const category = await Category.findByIdAndUpdate(req.params.id, {name: req.body.name}, {new: true})
    if(!category) {
        return res.status(404).json('The category with the given ID was not found.')
    }
    res.json({ success: true, message: 'Category updated successfully', category })
});







router.delete('/:id', async (req,res) => {
    const category = await Category.findByIdAndDelete(req.params.id)
    if (!category) return res.status(404).json('The category with the given ID was not found.')
        res.send(category)
});

router.get('/:id', async (req, res) => {
    const category = await Category.findById(req.params.id)
    if (!category) return res.status(404).json('The category with the given ID was not found.')
    res.send(category) 
})




module.exports = router
