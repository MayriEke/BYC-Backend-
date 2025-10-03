const mongoose = require("mongoose");
const express = require ("express");
const category = require('./routes/categories');
const product = require('./routes/product');
const customers = require('./routes/customers');
const user = require('./routes/users');
const carts = require('./routes/carts');
const order = require('./routes/orders');
const auth = require('./routes/auth');
const blog = require('./routes/blogs');
const app = express();
const cors = require('cors');
app.use(cors());

const config = require('config');

if(!config.get('jwtPrivateKey')){
    console.error("FATAL ERROR: jwtPrivateKey is not defined");
    process.exit(1);
}

mongoose.connect('mongodb://localhost:27017/bycdatabase')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.log('Could not connect to MongoDB...',err))

    // middleware
app.use(express.json());
app.use('/byc/document/api/categories', category);
app.use('/byc/api/products', product);
app.use('/byc/api/customer', customers);
app.use('/byc/api/users', user)
app.use('/byc/api/login', auth);
app.use('/byc/api/carts', carts);
app.use ('/byc/api/orders', order);
app.use('/byc/api/blogs', blog)



const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`listening on port ${port}...`));