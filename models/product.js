const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// mongoose.connect('mongodb://localhost:27017/farmProduct')
//     .then(() => {
//         console.log('mongoose worked')
//     })
//     .catch((e) => {
//         console.log('error')
//         console.log(e);

//     })


const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        lowercase: true,
        enum: ['vegetable', 'fruit', 'dairy', 'icecream']
    },
    farm: {
        type: Schema.Types.ObjectId,
        ref: 'Farm'
    }
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product;