const express = require('express')
const app = express();
const path = require('path');
const methodOverride = require('method-override')


const mongoose = require('mongoose');

const Product = require('./models/product');
const Farm = require('./models/farm')
const { find } = require('./models/product');
mongoose.connect('mongodb://localhost:27017/farmProduct2')
    .then(() => {
        console.log('mongoose worked')
    })
    .catch((e) => {
        console.log('error')
        console.log(e);

    })

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))



const category = ['vegetable', 'fruit', 'dairy', 'icecream']
//Products list page
//farm routes

app.get('/farms/new', (req, res) => {
    res.render('farms/new')
})

app.get('/farms', async (req, res) => {
    const farms = await Farm.find({});
    res.render('farms/index', { farms })
})

app.post('/farms', async (req, res) => {
    const farm = await new Farm(req.body)
    await farm.save();
    res.redirect('farms')
})

app.get('/farms/:id', async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.findById(id).populate('products');
    res.render('farms/show', { farm })
})
app.delete('/farms/:id', async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.findByIdAndDelete(id);
    console.log(farm);
    res.redirect('/farms');
})



app.get('/farms/:id/product/new', async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.findById(id);
    res.render('new', { category, farm })
})

app.post('/farms/:id/product', async (req, res) => {
    const { id } = req.params;
    const { name, price, category } = req.body;
    const product = await new Product({ name, price, category });
    const farm = await Farm.findById(id);
    farm.products.push(product);
    product.farm = farm;
    await farm.save();
    await product.save();
    res.redirect(`/farms/${id}`)


})












//product routes
app.get('/products', async (req, res) => {
    const { category } = req.query;
    if (category) {
        const products = await Product.find({ category })
        // console.log(products)
        // res.send('All products listed')
        res.render('products', { products, category: category })
    } else {
        const products = await Product.find({})
        // console.log(products)
        // res.send('All products listed')
        res.render('products', { products, category: 'All' })
    }
})



//Adding new product link
app.get('/products/new', (req, res) => {
    res.render('new', { category })
})


//showing added new product in db 
app.post('/products', async (req, res) => {
    const newProduct = new Product(req.body)
    await newProduct.save();
    res.redirect(`/products/${newProduct._id}`)
})


//showing the listed product
app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const foundProduct = await Product.findById(id).populate('farm', 'name');
    // console.log(foundProduct)
    res.render('show', { foundProduct })

})

//edit request forum with id
app.get('/products/:id/edit', async (req, res) => {
    const { id } = req.params;
    const foundProduct = await Product.findById(id);
    // console.log(foundProduct)
    res.render('edit', { foundProduct, category })
})

//put request br edit form
app.put('/products/:id', async (req, res) => {
    // console.log(req.body)
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { runValidators: true })
    res.redirect(`/products/${updatedProduct._id}`)
})


//deleeting an existing product
app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndRemove(id)
    res.redirect('/products')
})

app.listen(3000, () => {
    console.log('Listening on port 3000 ')
})

