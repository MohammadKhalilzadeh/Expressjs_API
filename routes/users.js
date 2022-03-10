const { response } = require('express')
const express = require('express')
const { where } = require('../models/user')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const checkAuth = require('../middleware/check-auth')


// Getting all
router.get('/',/* checkAuth, */ async (req, res) => {
    try{
        const users = await User.find()
        return res.status(200).json(users)
    }catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Getting One
router.get('/:id', getUser,/* checkAuth,*/ async  (req, res) => {
    return res.status(200).send(res.user)
})

// Get by Email or Phone
router.post('/single/:input', async  (req, res) => {
    console.log(req.params.input);
    User.findOne({ $or:[ { phone: req.params.input },{email:req.params.input} ]})
    .exec()
    .then(user => {
        console.log(user);
        console.log(req.body);
        console.log("1");
        if(!user){
            console.log("2");
            return res.status(404).json({
                message: 'Not Found'
            })
        }
        bcrypt.compare(req.body.password,user.password,(err,result)=>{
            if(err){
                return res.status(401).json({
                    message: 'Unauthorized'
                })
            }
            if(result){
            const token = jwt.sign({
                "id":user._id,
            } ,
            "tm4ever"
            ,{ expiresIn: "1h" }, )
                return res.status(202).json({token:token})
            }
            //  res.status(401).json({
            //     message: 'Auth Failed'
            // })
            // console.log("BCRYPT");
            // console.log("5");
        })
    })
    .catch(err => {
        res.status(500).json({ error: err})
    })

})

// Creating One
router.post('/',  async (req, res) => {

    try {
        User.find({email: req.body.email})
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'Conflict'
                })
            } else {
                bcrypt.hash(req.body.password,10, async (err,hash) => {
                    if(err){
                        return res.status(503).json({
                            error:err
                        })
                    }else{
                        const user = new User({
                            firstname: req.body.firstname,
                            lastname: req.body.lastname,
                            email: req.body.email,
                            phone: req.body.phone,
                            password:hash ,
                        })
                        //const newuser =
                        await user.save().then(result => {
                            res.status(201).json(result)
                        }).catch(err => {
                            console.log(err);
                            res.status(500).json({ error: err})
                        })
                        // res.status(200).json(newuser)
                    }
                })
            }
        })
        .catch()

    } catch (error) {
        res.status(400).json({message:error.message})
    }
})

// Updating One
router.patch('/:id', getUser, checkAuth,  async  (req, res) => {
    try {
        const updatedUser = await res.user.save()
        res.status(200).json(updatedUser)
    } catch (error) {
        res.status(400).json({ message: error.message})
    }
})

// Deleting One
router.delete('/:id', getUser, checkAuth,  async (req, res) => {
    try {
        await res.user.remove()
        res.status(200).json({ message: 'Deleted user' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

async function getUser(req, res, next) {
    let user
    try {
        console.log(req.params.id);
        user = await User.findById(req.params.id)
        if (user == null){
            return res.status(404).json({message: 'Not Found'})
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

    res.user = user
    next()
}

module.exports = router