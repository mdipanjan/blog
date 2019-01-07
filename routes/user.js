// const express = require('express');
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const router = express.Router();


// router.get('/',(req, res)=>{
//     // res.send('ok');
//     res.render('users/signup');
// });


// //Register New Users///


// const {User, validateUser} = require('../models/users');

// // const User = mongoose.model('user');

// router.post('/signup',  (req,res)=>{


//     // const { error } = validateUser(req.body); 
     
//     // if (error) return res.status(400).send(error.details[0].message);
  
//     //  let sameUser =  await User.findOne({email:req.body.email});

//     //  if(sameUser) return res.status(400).send('already registered');

//     //  if(!sameUser)
//     //     user = new User(req.body);

//     //     const salt = await bcrypt.genSalt(10);

//     //     user.password = await bcrypt.hash(user.password,salt);

//     //     await user.save();

//         console.log(req.body);

//         res.send('ok');
     
//     });


// module.exports = router;