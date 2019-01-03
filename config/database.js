if(process.env.NODE_ENV === 'production'){
    module.exports={
        mongoURI:'mongodb://<mdipanjan>:<Honulal@17>@ds125938.mlab.com:25938/blog'
    }
}else module.exports={
    mongoURI:'mongodb://localhost/blogpage'
}