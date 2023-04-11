const mongoose = require('mongoose');
mongoose.set('strictQuery',false);

mongoose.connect('mongodb+srv://todoappaccess:todoappaccess@cluster0.z0olmn9.mongodb.net/mobile_app').then(()=>{
    console.log(`connected!`);
})

