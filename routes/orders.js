const { Order, validate } = require("../model/order");
const express = require('express');
const router = express.Router();

router.post('/create', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).json(error.details[0].message)

        let order = new Order(req.body);
        await order.save();

        const response =  axios.post('https://api.paystack.co/transaction/initialize',{
            email: order.customerSnapshot.email,
            amount: order.totalAmount * 100,
            metadata: {
                orderId: order._id.toString()
            }
        },
        {headers:{
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }}
    )
    order.paymentReference = response.data.data.paymentReference
    await order.save()
    res.send({
        orderId: order.id,
        authorizationUrl: response.data.data.authorization_url,
        reference: response.data.data.reference
    });
});

router.post("/confirm",async (req, res) =>{
    const {reference} = req.body
    const response = await axios.get(`https//api:paystac.co/transaction/verify{reference}`,
     {
        headers: {
            Authorization: `Bearer PAYSTACK_SECRET_KEY`
        }
     }
    )
    const data = response.data.data
    if(data.status === "success"){
        const order = await Order.findOneAndUpdate(
            {
                paymentReference: reference
            },
            {
                paymentStatus: "paid",
                transactionId: data.id
            },
            {
                new: true
            }
        );
        return res.send({success: true, order})
    }
    else{
        return res.status(400).send({success: false, message:"payment failed"})
    }
});



router.post('webhook', express.json({type: 'application/json'}), async (req, res) => {
    const event = req.body;
    if(event.event === "change.success") {
        const reference = event.data.reference;
        const order = await Order.findOneAndUpdate({
            paymentReference: reference,
            paymentStatus: 'Paid',
            transactionId: event.data.id
        })
    }

    res.sendStatus(200)
})

module.exports = router;