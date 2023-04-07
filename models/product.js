const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    img:String,
    name:String,
    catagory:String,
    price:String,
    discription:String,
    company:String
});

module.exports = mongoose.model('products',productSchema);