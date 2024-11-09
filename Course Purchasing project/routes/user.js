const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const {User,Course} =require("../db/index")
const jwt = require("jsonwebtoken")
const {jwtSecretKey} = require("../jwt")
// User Routes
router.post('/signup', async (req, res) => {
    // Implement user signup logic
    const username =req.body.username;
    const password =req.body.password;
    
    await User.create({
        username:username,
        password:password
    })
    res.json({msg:"User created succesfully"})
});

router.post('/signin', async (req, res) => {
    // Implement user signin logic
   try {const username = req.headers.username;
    const password = req.headers.password;
   const user = await User.findOne({
        username,
        password
    })
    
    if(user){
        const token = jwt.sign({username},jwtSecretKey)
        res.json({token})
    }else{
        res.status(411).json({msg:"Wrong username & password"})
    }
    
   } catch (error) {
    
    res.json({msg:"Something wrong"})
   } 
});

router.put('/updateUserInfo',userMiddleware,async (req,res) =>{
    // update user info
        const user = req.username
        const newusername = req.body.username
        const newPassword = req.body.password
       try {
        await User.findOneAndUpdate({user},{
        username:newusername,
        password:newPassword
       })
       res.json({msg:"User info updated"})
       } catch (e) {
        
        res.json({msg:"Something went wrong"})
       } 
})

router.delete('/deleteuser',userMiddleware, async (req,res) =>{
// Delete the user
        const user = req.username
       try {
        await User.findOneAndDelete({user})
       res.json({msg:"User Deleted"})
       } catch (e) {
        
        res.json({msg:"Something went wrong"})
       } 

})


router.get('/courses',userMiddleware, async (req, res) => {
    // Implement listing all courses logic
   const courses = await Course.find({});
   res.json({courses})
});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    // Implement course purchase logic
        const courseId = req.params.courseId
        const username = req.username
        
        await User.updateOne({username},{
            "$push":{
                purchasedCourse:courseId
            }
        })
        res.json({msg:"Purchased the course"})
});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    // Implement fetching purchased courses logic
    const username = req.username
    const user = await User.findOne({username})
    if(user){
         const course = await Course.find({
        _id:{
            '$in':user.purchasedCourse
        }
    })
    res.json({course:course})
    }
    else{
        res.json({msg:"user not found please signup"})
    }
   
});

module.exports = router