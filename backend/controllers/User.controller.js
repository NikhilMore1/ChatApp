const UserModel = require('../models/UserName.model');
const cloudinary = require('cloudinary');
const fs = require('fs');
const SaveName = async(req,res)=>{
    try{
        const {name,category} = req.body;
        const existingUser = await UserModel.findOne({name});
        if(!existingUser){
            const filename = req.file.filename;
            const resp = await cloudinary.uploader.upload(req.file.path);
            fs.unlinkSync(req.file.path);
            res.status(201).send({
                message:`New User Created`,
                respnse:resp,
                image_url:resp.secure_url
            });
            const newUser = await UserModel({
                name,category,image:resp.secure_url
            });
            const response= await newUser.save();
            console.log(response);
        }
        else{
            return res.status(400).send({
                error:`User ${name} already exists`,
            });
        }
     
    }catch(error){
        return res.status(500).send({
            error:`Internal error occured ${error}`,
        }); 
        console.log(error);
    }
}

const getNames = async(req,res)=>{
    try{
        const getUsers = await UserModel.find();
        res.json({UsersName:getUsers});
    }catch(error){
        console.log({error:error});
        res.status(500).send({error:"Internal error occured",error});
    }
}
module.exports ={
    SaveName,
    getNames
}