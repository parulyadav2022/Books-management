const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')
const aws = require('aws-sdk')

// upload file function and connection........................

 aws.config.update({
    accessKeyId: "AKIAY3L35MCRUJ6WPO6J",
    secretAccessKey: "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",
    region: "ap-south-1"
})

let uploadFile= async ( file) =>{
	return new Promise( function(resolve, reject) {
	 // this function will upload file to aws and return the link
	 let s3= new aws.S3({apiVersion: '2006-03-01'}); // we will be using the s3 service of aws
 
	 var uploadParams= {
		 ACL: "public-read",
		 Bucket: "classroom-training-bucket",  //HERE
		 Key: "abc/" + file.originalname, //HERE 
		 Body: file.buffer
	 }
 
 
	 s3.upload( uploadParams, function (err, data ){
		 console.log(3)
		 if(err) {
			 return reject({"error": err})
		 }
		 console.log(data)
		 console.log("file uploaded succesfully")
		 return resolve(data.Location)
	 })
	 //console.log(1)
 
	 // let data= await s3.upload( uploadParams)
	 // if( data) return data.Location
	 // else return "there is an error"
 
	})
 }
//............................END ..............................................

const isValid = function (value) {
	if (typeof value === 'undefined' || value === null) return false
	if (typeof value === 'string' && value.trim().length === 0) return false
	return true
}
const registerUser = async function (req, res) {
	try {
        
        const getBodyData = req.body
        const files = req.files;
		const { fname,lname,  email, profileImage,phone, password, address } = getBodyData

// first name and last name validation.......................................

        if (!isValid(fname)) {
			return res
				.status(400)
				.send({ status: false, message: 'Please Enter first name' })
		}
        if (!isValid(lname)) {
			return res
				.status(400)
				.send({ status: false, message: 'Please Enter last name' })
		}


    // Email validation.......................................

    if (!isValid(email)) {
        return res
            .status(400)
            .send({ status: false, message: 'Please Enter email' })
    }

    const checkEmail = await userModel.findOne({ email: email })

    if (checkEmail) {
        return res
            .status(409)
            .send({ status: false, message: 'Email is already register' })
    }

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.trim())) {
        return res
            .status(400)
            .send({ status: false, message: 'Email should be valid' })
    }

// mobile validation.......................................
		
if (!isValid(phone)) {
    return res
        .status(400)
        .send({ status: false, message: 'Please Enter mobile' })
}

const checkPhone = await userModel.findOne({ phone: phone })
if (checkPhone) {
    return res
        .status(409)
        .send({ status: false, message: 'Mobile number is already registred' })
}

if (!/^\d{10}$/.test(phone)) {
    return res
        .status(400)
        .send({ status: false, message: 'Mobile no should be valid' })
}



// Password validation.......................................

if (!isValid(password)) {
    return res
        .status(400)
        .send({ status: false, message: 'Please Enter password' })
}
if (password.length <= 8 || password.length >= 15) {
    return res.status(400).send({
        status: false,
        message: 'password length should be in the range of 8 to 15 only',
    })
}


// Pincode Validation....................................

//if (!/^\d{6}$/.test(address.pincode)) {
    //return res
        //.status(400)
        //.send({ status: false, message: 'only number is accepted in pincode ' })
//}

//UPload Profile Image.................................

//let files= req.files
			if(files && files.length>0){
				//upload to s3 and get the uploaded link
				// res.send the link back to frontend/postman
				let uploadedFileURL= await uploadFile( files[0] )
				getBodyData.profileImage = uploadedFileURL
				//console.log(2)
			}

// Create user data/Registration....................


        const createUser = await userModel.create(getBodyData)
		return res
			.status(201)
			.send({ status: true, message: 'Success', data: createUser })
    }
    catch(error){
          res.status(500).send({status:false , message:error.message})
    }
}

module.exports = { registerUser }