const { Customer, validate } = require("../model/customer");
const express = require('express');
const router = express.Router();

router.get('/', async(req, res) => {
    const customer = await Customer.find().sort('name')
    res.send(customer)
});

router.post('/', async(req, res) => {
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message)

        let customer = new Customer({
            name: req.body.name,
            isGold: req.body.isGold,
            company: req.body.company,
            country: req.body.country,
            cityTown: req.body.cityTown,
            state: req.body.state,
            phone: req.body.phone,
            email: req.body.email,
        });

        customer = await customer.save()
        res.send(customer)
});

router.put('/:id', async(req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).json(error.details[0].message)

        const customer = await Customer.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            isGold: req.body.isGold,
            company: req.body.company,
            country: req.body.country,
            cityTown: req.body.cityTown,
            state: req.body.state,
            phone: req.body.phone,
            email: req.body.email,
        }, {new: true});
        if (!customer) return res.status(404).send('customer not found')
            res.send(customer)
});

router.delete('/', async(req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(404).send(error.details[0].message)

    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        isGold: req.body.isGold, 
        phone: req.body.phone
    }, {new: true});
    if(!customer) return res.status(404).send('customer with the given ID was not found.')
        res.send(customer)
});

module.exports = router