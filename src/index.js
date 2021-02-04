
const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');

const app =express();
require('./db/conn');
const Resiter = require('./modals/register');
const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, '../Public');
const tempalte_path = path.join(__dirname, '../templates');
app.use(express.json());
app.use(express.urlencoded({extended:false}));
//console.log(static_path);
//app.use(express.static(tempalte_path));
app.use(express.static(static_path));

app.set("view engine", "hbs");
app.set("views", tempalte_path);

app.get('/', (req, res) => {
    res.render("Resiter");

})
app.get('/login', (req, res) => {
    res.render("login");

})

app.post('/', async (req, res) => {
 
    try{
        //res.send(req.body.firstName);
       const password = req.body.password;
        const cpassword = req.body.confirmpassword;
        if(password === cpassword){
            const  Risteremploye = new Resiter({
                firstname : req.body.firstname,
                lastname  : req.body.lastname,
                gender : req.body.gender,
                email : req. body.email,
                phone : req.body.phone,
                password : req.body.password,
                confirmpassword : req.body.confirmpassword 
            })


          const token = await Risteremploye.generateAuthToken();     
            
          const res = await Risteremploye.save();
          res.status(201).render("index");

        }else{
            res.send("password are not matching");
        }

    } catch(error){
        res.status(400).send(error);
    }

})



app.post('/login', async (req, res) => {
 
    try{
        //res.send(req.body.email);
        const email = req.body.email;
        const password = req.body.password;
       // console.log(`${email} and passwor${password}`);
         const useremail = await  Resiter.findOne({email:email});
        // res.send(useremail);
        // console.log(useremail);
        const isMatch  = await bcrypt.compare(password, useremail.password);
        const token = await useremail.generateAuthToken();     
       if(isMatch){
          res.status(201).render('Resiter');
          //res.status(201).render(index);
       }else{
           res.send("password is not correct");
       }

    } catch(error){
        res.status(400).send("invalid email");
    }

})

app.listen(port, () => {
    console.log(`server is running at port no ${port}`);
})