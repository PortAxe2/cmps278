const express = require('express');
const router = express.Router();
const url = require('url');
const ItemsReview = require('../models/ItemReview');

router.get('/root', async (req,res) => {
    res.send("On Items Review");
});

//Get Last 5 review reviews
router.get('/lastfive/:postId', async(req, res) => {
    try{
        const query = {itemID: req.params.postId};
        const posts = await ItemsReview.find(query).limit(5);
        res.json(posts);
    }catch(err){
        res.json({message: err});
    }
});

router.get('/all/:postId', async(req, res) => {
    try{
        const query = {itemID: req.params.postId};
        const posts = await ItemsReview.find(query);
        res.json(posts);
    }catch(err){
        res.json({message: err});
    }
});

router.post('/createReview', async (req,res) => {
    console.log("Create review reached");
    console.log(req.body.username);
    const post = new ItemsReview({
        itemID: req.body.itemID,
        reviewerUsername: req.body.username,
        reviewerPicture: req.body.picture,
        reviewText: req.body.commentSubmit,
        numberOfLikes: 0,
        replies: []
    });

    try {
        const savedPost = await post.save();
        //res.json(savedPost);
        res.redirect(url.format({
            pathname: '/items/itemDetail',
            query: {
                "itemID": itemID
            }
        }));
    }catch(err){
        res.json({message: err});
    }
});


module.exports = router;