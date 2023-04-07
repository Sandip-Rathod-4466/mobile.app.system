const express = require('express');
const dotenv = require('dotenv');
dotenv.config({path:"./config.env"});
require("./config.env");
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require("multer");
const path = require("path");
require('./database');
const Product = require("./models/product");



// port
const PORT = process.env.PORT || 8000;


// const upload = multer({ dest: 'uploads/' });
const upload = multer({
    storage:multer.diskStorage({
        destination: function(req,file,cb){
            cb(null,"uploads")
            // file object
            /*{
                fieldname: 'user_file',
                originalname: 'broken_4k-3840x2160.jpg',
                encoding: '7bit',
                mimetype: 'image/jpeg'
            }*/
        },
        filename:function(req,file,cb){
            cb(null,`${file.originalname}_${Date.now()}.${file.mimetype.split('/')[1]}`)
        }
    })
}).single("user_img")

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use('/uploads',express.static("./uploads"));

// add product
app.post('/add',upload,async(req,res)=>{
    const image = `http://localhost:${PORT}/${req.file.path}`;
    let result = new Product({
    // img:req.file.path,
    img:image,
    name:req.body.name,
    catagory:req.body.catagory,
    price:req.body.price,
    discription:req.body.discription,
    company:req.body.company
    });
    result = await result.save();
    res.send(result);
});

// get all products
app.get('/products',async(req,res)=>{
    let product = await Product.find();
    res.send(product);
})

// delete products
app.delete("/delete/:key",async(req,res)=>{
    let productDelete = await Product.deleteOne({_id:req.params.key});
    res.send(productDelete);
});

// search products
app.get("/search/:key",async(req,res)=>{
    let products = await Product.find({
        "$or":[
            {name:{$regex:req.params.key}},
            {company:{$regex:req.params.key}},
            {catagory:{$regex:req.params.key}},
        ]
    })
    res.send(products)
});

// get single product 
app.get("/product/:key",async(req,res)=>{
    const result = await Product.findOne({_id:req.params.key})
    res.send(result);
});

app.put("/update/:key",upload,async(req,res)=>{
    if (req.file) {
        const image = `http://localhost:${PORT}/${req.file.path}`;
        let result = await Product.updateOne({_id:req.params.key},{$set:{...req.body,img:image}})
        res.send(result)
    }

    else{
        let image = await Product.findOne({_id:req.params.key})
        image = `${image.img}`;
        let result = await Product.updateOne({_id:req.params.key},{$set:{...req.body,img:image}})
        res.send(result)
    }


    // let result = await Product.updateOne({_id:req.params.key},{$set:{
    // img:image,
    // name:req.body.name,
    // catagory:req.body.catagory,
    // price:req.body.price,
    // discription:req.body.discription,
    // company:req.body.company
    // }})


})


    app.use(express.static("frontend/build"));
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,"frontend","build","index.html"))
    });


app.listen(PORT,()=>{
    console.log(`server listen at http://localhost:${PORT}/products`);
});


