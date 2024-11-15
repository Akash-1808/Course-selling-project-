const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const { Admin, Course } = require("../db");
const { jwtSecretKey } = require("../jwt");
const router = Router();
const jwt = require("jsonwebtoken")

// Admin Routes
router.post('/signup', async (req, res) => {
    // Implement admin signup logic
    const username =req.body.username;
    const password =req.body.password;
    
    await Admin.create({
        username:username,
        password:password
    })
    res.json({msg:"Admin created succesfully"})
});

router.post('/signin', async (req, res) => {
    // Implement admin signup logic
    const username = req.headers.username;
    const password = req.headers.password;
   const user = await Admin.findOne({
        username,
        password
    })
    
    if(user){
        const token = jwt.sign({username},jwtSecretKey)
        res.json({token})
    }else{
        res.status(411).json({msg:"Wrong username & password"})
    }
});

router.post('/courses', adminMiddleware, async (req, res) => {
    // Implement course creation logic
    const title =req.body.title
    const description =req.body.description
    const price =req.body.price 
    const imageLink =req.body.imageLink
    await Course.create({
        title  ,
        description ,
        price ,
        imageLink 
    })
    res.json({msg:"Course created succesfully"})
});

router.get('/courses', adminMiddleware, async (req, res) => {
    // Implement fetching all courses logic
    const course = await Course.find({})
    res.json({course})

});

module.exports = router;