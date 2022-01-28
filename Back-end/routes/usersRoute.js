const express = require('express');
const router  = express.Router();
const Users   = require('../models/Users');

//Fetch user details
router.get('/', async (req,res) => {
    try {
        const posts = await Users.find();
        res.json(posts);
    }catch(err){
        res.json({message: err});
    }
});

//Get User info by ID
router.post('/getInfo', async (req, res) => {
    try {
        const posts = await Users.findById(req.body._id);
        res.json(posts);
    }catch(err){
        res.json({message: err});
    }
});


//SignIn
router.post('/signIn', async (req, res) => {
    try {
        const query = {username: req.body.username, password: req.body.password}
        const posts = await Users.find(query);
        res.json(posts);
    }catch(err){
        res.json({message: err});
    }
});

//Create user
router.post('/createUser', async(req,res) => {
    const post = new Users({
        username: req.body.username ,
        email: req.body.email,
        password: req.body.password,
        userImageURL: req.body.userImageURL,
        wishlistIDs: [],
    });
    try {
        const savedPost = await post.save();
        res.json(savedPost);
    }catch(err){
        res.json({message: err});
    }
});

//Add to wishlist
router.post('/addToWishlist', async(req,res) => {
    const filter = {_id: req.query.userID};
    const update = {$addToSet: {wishlistIDs: req.query.itemID}};
    try {
        const post = await Users.updateOne(filter, update);
        res.send(post);
    }catch(err){
        res.send({message: err});
    }
});


module.exports = router;