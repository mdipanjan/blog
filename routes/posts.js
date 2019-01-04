const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

//load blog model 

require('../models/blogs');
const Blog = mongoose.model('blog');



router.get('/',(req,res)=>{
    Blog.find({})
    .sort({date:'desc'})
    .then(blogs=>{
        res.render('blogs/posts',{
            blogs:blogs
        });
    })
});




module.exports = router;