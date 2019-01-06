const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose= require('mongoose');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const about = require('./routes/about');
const blogs = require('./routes/blogs');
const posts = require('./routes/posts');
const works = require('./routes/works');
const app = express();

const db = require('./config/database');

console.log(`app: ${app.get('env')}`);


app.use('/about', about);

app.use('/blogs', blogs);

app.use('/posts', posts);

app.use('/works', works);

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//Method override
app.use(methodOverride('_method'));

//Expresss session middleware
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    
  }));

  app.use(flash()); 

//Global variable
app.use(function(req,res,next){
    res.locals.success_msg= req.flash('success_msg');
    res.locals.error_msg= req.flash('error_msg');
    next();
})



// mongodb connection

mongoose.connect(db.mongoURI,{
 
    useNewUrlParser: true 
})
.then(()=>console.log('connected to mongodb..'))
.catch(err=>console.error('unable to connect',err)); 


//load blog model 

require('./models/blogs');

const Blog = mongoose.model('blog');

///Handlebars helper

const {
    truncate,
    stripTags
} = require('./helpers/hbs');


app.get('/',(req,res)=>{
    res.render('index');
})

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
        req.flash('success_msg','Blog Post Added');
        res.redirect('/posts');
        // console.log(blog);
    })
    .catch(err=>console.error(err)); 
    
}


});



app.get('/blogs/edit/:id',(req,res)=>{
        Blog.findOne({
            _id:req.params.id
        })
        .then(blog=>{
            res.render('blogs/edit',{
                blog:blog
            });
            //console.log(blog);
          
        });
});


app.get('/blogs/des/:id',(req,res)=>{
    Blog.findOne({
        _id:req.params.id
    })
    .then(blog=>{

        console.log(blog);
        res.render('blogs/descriptive',{
            blog:blog
         });
    
      
    });
});


app.put('/blogs/:id', (req,res)=>{
        Blog.findOne({
            _id:req.params.id
        })
        .then(blog=>{
           blog.title = req.body.title;
           blog.description = req.body.description;

           blog.save()
           .then(blog=>{
               //console.log(blog);
               req.flash('success_msg','Blog Post Edited');
               res.redirect('/posts')
           })
        })
})
app.delete('/blogs/:id', (req,res)=>{
    Blog.deleteOne({_id:req.params.id})
    .then(()=>{
        req.flash('success_msg','Blog Post Removed');
        res.redirect('/posts');
    })
   
})

//static files

app.use(express.static(path.join(__dirname,'public')));






//To load static images
// app.use(express.static('public/img')); 


//express-handlebar middleware

app.engine('handlebars', exphbs({
    helpers:{
        truncate:truncate,
        stripTags:stripTags
    },
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');



const port = process.env.PORT || 8000;
app.listen(port,()=>{
    console.log(`server started at port ${port}`);
});