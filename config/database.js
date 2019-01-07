if(process.env.NODE_ENV === 'production'){
    module.exports={
        mongoURI:'mongodb://mdipanjan:mdipanjan1@ds151124.mlab.com:51124/blog'
    }
}else module.exports={
    mongoURI:'mongodb://localhost/blogpage'
}