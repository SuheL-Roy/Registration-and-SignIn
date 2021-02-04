
const mongoose  = require('mongoose');
const  bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const employename = new mongoose.Schema({

    firstname : {
        type:String,
        required:true
    },
    lastname: {
        type:String,
        required:true
    },
    gender: {
        type:String,
        required:true

    },
    email: {
        type:String,
        required:true,
        unique:true
    },

    password: {
        type:String,
        required:true
    },
    confirmpassword: {
        type:String,
        required:true
    },
    phone: {
        type:Number,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

employename.methods.generateAuthToken = async function(){
    try{
        const token =jwt.sign({_id:this._id.toString()}, "mynameisthapayouareyoutubertyhefbhuynd3webmllhhhjjngfh");
        this.tokens = this.tokens.concat({token});
        await this.save();
       // console.log(token);
        return token;

    }catch(error){
        res.send(ërror);
        console.log(error);

    }
}


employename.pre("save", async function(next) {
  //  const passwordHash =  await bcrypt.hash(password,10);
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10);
       // console.log(`the current password is ${this.password}`);
        this.confirmpassword = await bcrypt.hash(this.password, 10);
    }

    next();

})


const Resiter = new mongoose.model("Resister", employename);

module.exports = Resiter;