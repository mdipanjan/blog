const admin = require('./middleware/admin');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth');
const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const helmet = require('helmet');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose= require('mongoose');
const methodOverride = require('method-override');
//const flash = require('connect-flash');
//const session = require('express-session');
const about = require('./routes/about');
const blogs = require('./routes/blogs');
const posts = require('./routes/posts');
const works = require('./routes/works');
// const user = require('./routes/user');
const app = express();
app.use(cookieParser());
const db = require('./config/database');

console.log(`app: ${app.get('env')}`);
app.use(helmet());

app.use('/about', about);
app.use('/blogs', blogs);
app.use('/posts', posts);
app.use('/works', works);
// app.use('/signup',user);

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//Method override
app.use(methodOverride('_method'));

//Expresss session middleware


 // app.use(flash()); 

//Global variable
// app.use(function(req,res,next){
//     res.locals.token = req.token || null ;
//     next();
// });



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

app.post('/blogs', auth,  (req,res)=>{
    
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
        //req.flash('success_msg','Blog Post Added');
        res.redirect('/posts');
        // console.log(blog);
    })
    .catch(err=>console.error(err)); 
    
}


});


app.get('/signup', (req,res)=>{
    // res.send('ok');
    res.render('users/signup');
})


//Register New Users///


const {User, validateUser} = require('./models/users');

// const User = mongoose.model('user');

app.post('/signup', async (req,res)=>{


    const { error } = validateUser(req.body); 
     
    if (error) return res.status(400).send(error.details[0].message);
  
     let sameUser =  await User.findOne({email:req.body.email});

     if(sameUser) return res.status(400).send('already registered');

     if(!sameUser)
        user = new User(req.body);

        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(user.password,salt);

        await user.save();

        const token = user.generateAuthToken(); 
        res.header('x-auth-token', token);
     
        console.log(token);
        res.send('ok');
     
    });
  
///Logging in  user////



app.get('/login', (req,res)=>{
    // res.send('ok');
    res.render('users/login');
})


app.post('/login', async (req,res)=>{

  
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email:req.body.email});
    // console.log(user);
    if (!user) return res.status(400).send('Invalid email or password');
 

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid email or password');

    const token = user.generateAuthToken(); 
    res.header('x-auth-token', token);
    res.cookie('auth',token);
    res.render('index');
    
    //console.log(res.cookie()); 
   });





//TO VALIDATE THE LOGIN CREDENTIALS

   function validate(req) {
    const schema = {
      email: Joi.string().min(3).max(250).required().email(),
      password: Joi.string().min(5).max(255).required()
    };
  
    return Joi.validate(req, schema); 
  }



      
        
    

app.get('/blogs/edit/:id', auth, (req,res)=>{
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


app.put('/blogs/:id', auth, (req,res)=>{
        Blog.findOne({
            _id:req.params.id
        })
        .then(blog=>{
           blog.title = req.body.title;
           blog.description = req.body.description;

           blog.save()
           .then(blog=>{
               //console.log(blog);
               //req.flash('success_msg','Blog Post Edited');
               res.redirect('/posts')
           })
        })
})
app.delete('/blogs/:id',  auth , (req,res)=>{

    Blog.deleteOne({_id:req.params.id})
    .then(()=>{
        //req.flash('success_msg','Blog Post Removed');
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