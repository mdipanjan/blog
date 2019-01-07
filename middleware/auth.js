const jwt = require("jsonwebtoken");

module.exports = function auth(req,res,next){
//     const token = req.header('x-auth-token');
//     if(!token) return res.status(401).send('access denied');
//     next();
// try{
//         const decoded =  jwt.verify(token,'jwprivatekey');
//         req.user = decoded;
//         next();
//     }
//     catch(ex){
//         res.status(400).send('Invalid Token');
//     }
let token = req.cookies.auth;

// decode token
if (token) {

  jwt.verify(token, 'jwprivatekey', function(err, token_data) {
    if (err) {
       return res.status(403).send('Error');
    } else {
      req.user_data = token_data;
      
      next();
    }
  });

} else {
  return res.status(403).send('No token');
}



}
// module.exports = auth;