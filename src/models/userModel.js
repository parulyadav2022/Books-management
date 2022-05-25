const mongoose  = require('mongoose')




const userSchema  = new mongoose.Schema({
    fname: {type:String,require:true},
    lname: {type:String,require:true},
    email: {type:String,require:true,trim:true},
    profileImage: {type:String, require:true}, // s3 link
    phone: {type:String, require:true,trim:true}, 
    password: {type:String, require:true,trim:true}, // encrypted password
    shipping : {street:String,city:String,pincode :String},
    billing : {street:String,city:String,pincode :String}
    
    },

   {timestamps: true

})

module.exports = mongoose.model("user", userSchema);
