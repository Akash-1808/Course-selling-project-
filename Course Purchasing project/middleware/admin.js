const jwt = require("jsonwebtoken");

const {jwtSecretKey} = require("../jwt")
// Middleware for handling auth

 function adminMiddleware(req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
    const word =req.headers.authorization
    const token = word.split(' ')
    const jsonwtoken =token[1]
    
    try {
       const decodevalue =  jwt.verify(jsonwtoken,jwtSecretKey)
       
        if(decodevalue.username){
            req.username =decodevalue.username
            next()
        }
        else{
            res.status(403).json({msg:"Admin not registered"})
        }
    } catch (e) {
        
        res.json({msg:"Incorrect input"})
    }

}

module.exports = adminMiddleware;