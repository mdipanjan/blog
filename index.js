const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose= require('mongoose');
const about = require('./routes/about');
const blogs = require('./routes/blogs');
const posts = require('./routes/posts');
const works = require('./routes/works');
const app = express();


app.use('/about', about);

app.use('/blogs', blogs);

app.use('/posts', posts);

app.use('/works', works);

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())



// mongodb connection

mongoose.connect('mongodb://localhost/blogpage',{
    useNewUrlParser: true 
})
.then(()=>console.log('connected to mongodb..'))
.catch(err=>console.error('unable to connect',err)); 


//load blog model 

require('./models/blogs');

const Blog = mongoose.model('blog');

//Form submit and redirect to post page

app.post('/blogs',(req,res)=>{
    
let errors = [];

if(!req.body.title){
    errors.push({
        text:'please add some title'
    })
}
if(!req.body.description){
    errors.push({
        text:'please add some description'
    })
}
if(errors.length > 0){
    res.render('blogs/blogs',{
        errors:errors,
        title:req.body.title,
        description:req.body.description
    });

}else{
    //console.log(req.body);
    new Blog(req.body)
    .save()
    .then(blog=>{
        res.redirect('/posts');
        console.log(blog);
    })
    .catch(err=>console.error(err)); 
    
}


});


// app.get('/posts',(req,res)=>{
//     Blog.find({})
//     .sort({date:'desc'})
//     .then(blogs=>{
//         res.render('blogs/posts',{
//             blogs:blogs
//         });
    
//     })

// });


//static files

app.use(express.static(path.join(__dirname,'public')));






//To load static images
// app.use(express.static('public/img')); 


//express-handlebar middleware

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


app.get('/',(req,res)=>{
    res.render('index');
})

const port = process.env.PORT || 8000;
app.listen(port,()=>{
    console.log(`server started at port ${port}`);
});