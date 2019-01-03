const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

router.get('/',(req,res)=>{
    res.render('works/works');
})

module.exports = router;