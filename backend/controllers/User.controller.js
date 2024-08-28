const UserModel = require('../models/UserName.model');
const SaveName = async(req,res)=>{
    try{
        const {name} = req.body;
        const newUser = await UserModel({
            name
        });
        const resp = await newUser.save();
        res.status(201).send({
            message:`New User Created`,
            respnse:resp
        });
        console.log(resp);
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