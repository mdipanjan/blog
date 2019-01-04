const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose= require('mongoose');
const methodOverride = require('method-override')
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



// mongodb connection

mongoose.connect(db.mongoURI,{
 
    useNewUrlParser: true 
})
.then(()=>console.log('connected to mongodb..'))
.catch(err=>console.error('unable to connect',err)); 


//load blog model 

require('./models/blogs');

const Blog = mongoose.model('blog');



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
        res.redirect('/posts');
        console.log(blog);
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

app.put('/blogs/:id', (req,res)=>{
        Blog.findOne({
            _id:req.params.id
        })
        .then(blog=>{
           blog.title = req.body.title;
           blog.description = req.body.description;

           blog.save()
           .then(blog=>{
               console.log(blog);
               res.redirect('/posts')
           })
        })
})
app.delete('/blogs/:id', (req,res)=>{
    Blog.remove({_id:req.params.id})
    .then(()=>{
        res.redirect('/posts');
    })
   
})

//static files

app.use(express.static(path.join(__dirname,'public')));






//To load static images
// app.use(express.static('public/img')); 


//express-handlebar middleware

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');



const port = process.env.PORT || 8000;
app.listen(port,()=>{
    console.log(`server started at port ${port}`);
});